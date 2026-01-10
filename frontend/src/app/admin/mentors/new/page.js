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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('mentors')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data } = supabase.storage.from('mentors').getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image: data.publicUrl }));
            setPreviewUrl(data.publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image! Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const expertiseArray = formData.expertise.split(',').map(item => item.trim()).filter(item => item !== "");

            const { error } = await supabase
                .from("mentors")
                .insert([{
                    ...formData,
                    expertise: expertiseArray
                }]);

            if (error) throw error;

            router.push("/admin/mentors");
            router.refresh();
        } catch (error) {
            console.error("Error adding mentor:", error);
            alert("Failed to add mentor: " + error.message);
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
                                <Label htmlFor="college" className="text-gray-700">College Name</Label>
                                <Input
                                    id="college"
                                    name="college"
                                    required
                                    value={formData.college}
                                    onChange={handleChange}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="college_id" className="text-gray-700">College ID</Label>
                                <Input
                                    id="college_id"
                                    name="college_id"
                                    required
                                    placeholder="e.g. nst"
                                    value={formData.college_id}
                                    onChange={handleChange}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
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
