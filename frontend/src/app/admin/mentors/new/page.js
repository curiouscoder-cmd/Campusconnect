"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { GridPattern } from "@/components/ui/fancy/GridPattern";

export default function AddMentorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        college: "Newton School of Technology",
        college_id: "nst",
        price: "₹99",
        meet_link: "",
        image: "",
        bio: "",
        expertise: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Compress image before upload
    const compressImage = async (file, maxWidth = 800, quality = 0.8) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                let { width, height } = img;

                // Only resize if larger than maxWidth
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(resolve, 'image/jpeg', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log('=== IMAGE UPLOAD START ===');
        console.log('Original file size:', Math.round(file.size / 1024), 'KB');

        setUploading(true);
        try {
            // Show preview immediately
            setPreviewUrl(URL.createObjectURL(file));
            console.log('Preview set');

            // Compress image if it's larger than 500KB
            let uploadFile = file;
            if (file.size > 500 * 1024) {
                console.log('Compressing...');
                console.time('compression');
                const compressedBlob = await compressImage(file);
                console.timeEnd('compression');

                if (!compressedBlob) {
                    console.error('Compression returned null!');
                    uploadFile = file; // Use original
                } else {
                    uploadFile = new File([compressedBlob], 'image.jpg', { type: 'image/jpeg' });
                    console.log('Compressed to:', Math.round(uploadFile.size / 1024), 'KB');
                }
            }

            // Upload to Supabase Storage
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
            console.log('Uploading to Supabase...', fileName);
            console.time('supabase-upload');

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('mentors')
                .upload(fileName, uploadFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            console.timeEnd('supabase-upload');
            console.log('Upload result:', { uploadData, uploadError });

            if (uploadError) {
                console.error('Upload error details:', uploadError);
                throw uploadError;
            }

            // Get Public URL
            const { data } = supabase.storage.from('mentors').getPublicUrl(fileName);
            console.log('Public URL:', data.publicUrl);

            setFormData(prev => ({ ...prev, image: data.publicUrl }));
            setPreviewUrl(data.publicUrl);
            console.log('=== IMAGE UPLOAD SUCCESS ===');
        } catch (error) {
            console.error('=== IMAGE UPLOAD FAILED ===', error);
            alert('Error uploading image: ' + (error.message || 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.time('mentor-insert');
            const expertiseArray = formData.expertise.split(',').map(item => item.trim()).filter(item => item !== "");

            console.log('Starting mentor insert via API...');

            // 1. Insert Mentor
            const response = await fetch('/api/admin/mentors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    expertise: expertiseArray
                })
            });

            const result = await response.json();
            console.timeEnd('mentor-insert');
            console.log('Insert result:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create mentor');
            }

            // 2. Send Onboarding Email (Fire and forget or await)
            try {
                const emailResponse = await fetch('/api/admin/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'onboarding',
                        data: {
                            email: formData.email,
                            mentorName: formData.name
                        }
                    })
                });

                if (emailResponse.ok) {
                    console.log('Onboarding email sent successfully');
                    toast.success("Mentor added & Invited!", {
                        description: `Email sent to ${formData.email}`
                    });
                } else {
                    console.warn('Failed to send onboarding email');
                    toast.success("Mentor added!", {
                        description: "But failed to send invite email."
                    });
                }
            } catch (emailErr) {
                console.error("Error sending email:", emailErr);
            }

            // Redirect
            router.push("/admin/mentors");
        } catch (error) {
            console.error("Error adding mentor:", error);
            toast.error("Failed to add mentor", { description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] bg-gray-50/50 p-4 md:p-8 overflow-hidden">
            <GridPattern width={40} height={40} className="absolute inset-0 -z-10 opacity-50" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/mentors">
                        <Button variant="ghost" size="icon" className="hover:bg-white/50 backdrop-blur-sm -ml-2">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                            Add New Mentor
                        </h1>
                        <p className="text-gray-500 mt-1">Onboard a new expert to the platform.</p>
                    </div>
                </div>

                <Card className="bg-white/80 backdrop-blur-md border-gray-200/50 shadow-xl rounded-2xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Info Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-100">
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-semibold text-gray-500 uppercase">Full Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            placeholder="e.g. Sarah Connor"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-semibold text-gray-500 uppercase">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="mentor@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-xs font-semibold text-gray-500 uppercase">Current Role</Label>
                                        <Input
                                            id="role"
                                            name="role"
                                            required
                                            placeholder="e.g. Senior Engineer @ Google"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image" className="text-xs font-semibold text-gray-500 uppercase">Profile Image</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative group w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                                {previewUrl ? (
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ImageIcon className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload className="w-4 h-4 text-white" />
                                                </div>
                                                <Input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    id="image"
                                                    name="image"
                                                    placeholder="Or paste URL..."
                                                    value={formData.image}
                                                    onChange={handleChange}
                                                    className="bg-gray-50/50 border-gray-200 text-xs h-9"
                                                />
                                                <p className="text-[10px] text-gray-400 mt-1">Upload a photo or paste a direct link.</p>
                                            </div>
                                            {uploading && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Academic & Professional */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-100 mt-8">
                                    Academic Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="college" className="text-xs font-semibold text-gray-500 uppercase">College Name</Label>
                                        <Input
                                            id="college"
                                            name="college"
                                            required
                                            value={formData.college}
                                            onChange={handleChange}
                                            className="bg-gray-50/50 border-gray-200 h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="college_id" className="text-xs font-semibold text-gray-500 uppercase">College ID (Slug)</Label>
                                        <Input
                                            id="college_id"
                                            name="college_id"
                                            required
                                            placeholder="e.g. nst"
                                            value={formData.college_id}
                                            onChange={handleChange}
                                            className="bg-gray-50/50 border-gray-200 h-11 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Session Details */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-100 mt-8">
                                    Session Configuration
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-xs font-semibold text-gray-500 uppercase">Session Price</Label>
                                        <div className="relative">
                                            <Input
                                                id="price"
                                                name="price"
                                                required
                                                placeholder="e.g. ₹99"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="bg-gray-50/50 border-gray-200 h-11 pl-4"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meet_link" className="text-xs font-semibold text-gray-500 uppercase">Google Meet Link</Label>
                                        <Input
                                            id="meet_link"
                                            name="meet_link"
                                            type="url"
                                            placeholder="https://meet.google.com/..."
                                            value={formData.meet_link}
                                            onChange={handleChange}
                                            className="bg-gray-50/50 border-gray-200 h-11 text-blue-600"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 mt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="expertise" className="text-xs font-semibold text-gray-500 uppercase">Expertise Tags</Label>
                                        <Input
                                            id="expertise"
                                            name="expertise"
                                            required
                                            placeholder="Campus Life, Academics, Placements (Comma separated)"
                                            value={formData.expertise}
                                            onChange={handleChange}
                                            className="bg-gray-50/50 border-gray-200 h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio" className="text-xs font-semibold text-gray-500 uppercase">Biography</Label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={4}
                                            required
                                            placeholder="Tell us about your journey..."
                                            className="flex w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                            value={formData.bio}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                                <Link href="/admin/mentors">
                                    <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl text-gray-500 hover:text-gray-900">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    {loading ? "Creating Mentor..." : "Save & Invite"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
