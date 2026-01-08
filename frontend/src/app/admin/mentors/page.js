"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Settings, Trash2, Search, Edit } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function MentorsPage() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const { data, error } = await supabase
                .from("mentors")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setMentors(data || []);
        } catch (error) {
            console.error("Error fetching mentors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this mentor?")) return;

        try {
            const { error } = await supabase
                .from("mentors")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setMentors(mentors.filter(m => m.id !== id));
        } catch (error) {
            alert("Error deleting mentor");
            console.error(error);
        }
    };

    const filteredMentors = mentors.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.college.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Mentors
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your team of mentors</p>
                </div>
                <Link href="/admin/mentors/new">
                    <Button className="bg-primary hover:bg-primary/90 rounded-full text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Mentor
                    </Button>
                </Link>
            </div>

            <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search mentors..."
                            className="pl-9 bg-gray-50 border-gray-200 text-gray-900 focus:border-primary/50 placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading mentors...</div>
                        ) : filteredMentors.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm ? "No mentors found matching your search." : "No mentors added yet."}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="p-4">Mentor</th>
                                            <th className="p-4 hidden md:table-cell">Role</th>
                                            <th className="p-4 hidden md:table-cell">College</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredMentors.map((mentor) => (
                                            <tr key={mentor.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={mentor.image} />
                                                            <AvatarFallback className="bg-gray-200 text-gray-600">{mentor.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{mentor.name}</p>
                                                            <p className="text-xs text-gray-500 md:hidden">{mentor.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 hidden md:table-cell text-gray-600 text-sm">{mentor.role}</td>
                                                <td className="p-4 hidden md:table-cell text-gray-600 text-sm">{mentor.college}</td>
                                                <td className="p-4 text-sm">
                                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                                        {mentor.price}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/admin/mentors/${mentor.id}`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-50"
                                                            onClick={() => handleDelete(mentor.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
