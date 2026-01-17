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

// Available colleges for mentor selection
const COLLEGES = [
    { id: "nst", name: "Newton School of Technology" },
    { id: "sst", name: "Scaler School of Technology" },
    { id: "vst", name: "Vedam School of Technology" },
    { id: "niat", name: "NxtWave Institute of Advanced Technology" },
    { id: "pst", name: "Polaris School of Technology" },
];

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

    const handleCollegeChange = (e) => {
        const selectedId = e.target.value;
        const selectedCollege = COLLEGES.find(c => c.id === selectedId);
        setFormData({
            ...formData,
            college_id: selectedId,
            college: selectedCollege?.name || ""
        });
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

            // Use API route with service role (bypasses RLS for speed)
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

            // Redirect immediately
            toast.success("Mentor added!", { description: `${formData.name} has been added successfully.` });
            router.push("/admin/mentors");
        } catch (error) {
            console.error("Error adding mentor:", error);
            toast.error("Failed to add mentor", { description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/mentors">
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100 text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Add New Mentor
                    </h1>
                    <p className="text-gray-500">Enter the details for the new mentor.</p>
                </div>
            </div>

            <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-white border-gray-300 text-gray-900 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="mentor@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-gray-700">Role</Label>
                                <Input
                                    id="role"
                                    name="role"
                                    required
                                    placeholder="e.g. 2nd Year Student"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="college_id" className="text-gray-700">College</Label>
                                <select
                                    id="college_id"
                                    name="college_id"
                                    required
                                    value={formData.college_id}
                                    onChange={handleCollegeChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                >
                                    {COLLEGES.map((college) => (
                                        <option key={college.id} value={college.id}>
                                            {college.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-gray-700">Price</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    required
                                    placeholder="e.g. ₹99"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meet_link" className="text-gray-700">Google Meet Link</Label>
                                <Input
                                    id="meet_link"
                                    name="meet_link"
                                    type="url"
                                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                    value={formData.meet_link}
                                    onChange={handleChange}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                                <p className="text-xs text-gray-500">Personal Google Meet link for sessions</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-gray-700">Profile Image</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 w-full">
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-3 file:text-sm hover:file:bg-gray-200"
                                        />
                                    </div>
                                    {uploading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                                </div>
                                {previewUrl && (
                                    <div className="mt-2 relative w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                {/* Fallback URL input if needed */}
                                <Input
                                    id="image"
                                    name="image"
                                    placeholder="Or paste image URL..."
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="mt-2 bg-white border-gray-300 text-gray-900 text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                required
                                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expertise" className="text-gray-700">Expertise (comma separated)</Label>
                            <Input
                                id="expertise"
                                name="expertise"
                                required
                                placeholder="Campus Life, Academics, Placements"
                                value={formData.expertise}
                                onChange={handleChange}
                                className="bg-white border-gray-300 text-gray-900"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading || uploading} className="bg-primary hover:bg-primary/90 min-w-[120px] text-white">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                {loading ? "Saving..." : "Save Mentor"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
