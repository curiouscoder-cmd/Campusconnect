import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const mentorId = formData.get("mentorId");

        if (!file || !mentorId) {
            return NextResponse.json(
                { error: "File and mentorId are required" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "File must be an image" },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File size must be less than 5MB" },
                { status: 400 }
            );
        }

        const supabase = createServerClient();
        if (!supabase) {
            return NextResponse.json(
                { error: "Database not configured" },
                { status: 500 }
            );
        }

        // Create unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `mentor-${mentorId}-${Date.now()}.${fileExt}`;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Check if bucket exists, create if not
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === "mentor-images");

        if (!bucketExists) {
            const { error: createError } = await supabase.storage.createBucket("mentor-images", {
                public: true,
                fileSizeLimit: 5 * 1024 * 1024,
            });
            if (createError && !createError.message.includes("already exists")) {
                console.error("Error creating bucket:", createError);
                return NextResponse.json(
                    { error: "Failed to create storage bucket" },
                    { status: 500 }
                );
            }
        }

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("mentor-images")
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return NextResponse.json(
                { error: "Failed to upload image: " + uploadError.message },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from("mentor-images")
            .getPublicUrl(fileName);

        // Update mentor profile with new image URL
        const { error: updateError } = await supabase
            .from("mentors")
            .update({ image: publicUrl })
            .eq("id", mentorId);

        if (updateError) {
            console.error("Update error:", updateError);
            return NextResponse.json(
                { error: "Failed to update mentor profile" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            imageUrl: publicUrl,
        });

    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
