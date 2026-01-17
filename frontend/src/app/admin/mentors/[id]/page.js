"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, Upload, ExternalLink } from "lucide-react";
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

export default function EditMentorPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        college: "",
        college_id: "",
        price: "",
        meet_link: "",
        image: "",
        bio: "",
        expertise: ""
    });

    useEffect(() => {
        async function fetchMentor() {
            if (!id) return;

            try {
                const { data, error } = await supabase
                    .from("mentors")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;

                if (data) {
                    // Ensure all values are strings (not null) to avoid controlled/uncontrolled input errors
                    setFormData({
                        name: data.name || "",
                        email: data.email || "",
                        role: data.role || "",
                        college: data.college || "",
                        college_id: data.college_id || "",
                        price: data.price || "",
                        meet_link: data.meet_link || "",
                        image: data.image || "",
                        bio: data.bio || "",
                        expertise: Array.isArray(data.expertise) ? data.expertise.join(", ") : (data.expertise || "")
                    });
                    if (data.image) setPreviewUrl(data.image);
                }
            } catch (error) {
                console.error("Error fetching mentor:", error);
                alert("Error fetching mentor details");
                router.push("/admin/mentors");
            } finally {
                setDataLoading(false);
            }
        }

        fetchMentor();
    }, [id, router]);

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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('mentors')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

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

            // Update logic
            const { error } = await supabase
                .from("mentors")
                .update({
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    college: formData.college,
                    college_id: formData.college_id,
                    price: formData.price,
                    meet_link: formData.meet_link,
                    image: formData.image,
                    bio: formData.bio,
                    expertise: expertiseArray,
                    updated_at: new Date().toISOString()
                })
                .eq("id", id);

            if (error) throw error;

            router.push("/admin/mentors");
            router.refresh();
        } catch (error) {
            console.error("Error updating mentor:", error);
            alert("Failed to update mentor: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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
                        Edit Mentor
                    </h1>
                    <p className="text-gray-500">Update mentor details.</p>
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
                                    <option value="">Select College</option>
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
                                    <div className="mt-2 relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 group cursor-pointer" onClick={() => window.open(previewUrl, '_blank')}>
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <ExternalLink className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                )}
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
                                {loading ? "Updating..." : "Update Mentor"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
