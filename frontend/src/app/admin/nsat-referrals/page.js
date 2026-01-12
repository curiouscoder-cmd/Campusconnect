"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, CheckCircle, XCircle, Clock, Mail, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NsatReferralsPage() {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            const { data, error } = await supabase
                .from("nsat_referrals")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setReferrals(data || []);
        } catch (error) {
            console.error("Error fetching referrals:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (referral) => {
        setProcessingId(referral.id);
        try {
            // Update status to approved
            const { error } = await supabase
                .from("nsat_referrals")
                .update({
                    status: "approved",
                    approved_at: new Date().toISOString(),
                })
                .eq("id", referral.id);

            if (error) throw error;

            // Send approval email
            await fetch("/api/send-nsat-approval", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: referral.name,
                    email: referral.email,
                }),
            });

            // Refresh list
            fetchReferrals();
            alert("Referral approved! Email sent to " + referral.email);
        } catch (error) {
            console.error("Error approving referral:", error);
            alert("Failed to approve referral");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (referral) => {
        if (!confirm("Are you sure you want to reject this referral?")) return;

        setProcessingId(referral.id);
        try {
            const { error } = await supabase
                .from("nsat_referrals")
                .update({ status: "rejected" })
                .eq("id", referral.id);

            if (error) throw error;
            fetchReferrals();
        } catch (error) {
            console.error("Error rejecting referral:", error);
            alert("Failed to reject referral");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredReferrals = referrals.filter(r =>
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.nsat_registration_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case "approved":
                return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
            case "rejected":
                return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            case "booked":
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Booked</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const stats = {
        total: referrals.length,
        pending: referrals.filter(r => r.status === "pending").length,
        approved: referrals.filter(r => r.status === "approved").length,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    NSAT Referrals
                </h1>
                <p className="text-gray-500 mt-1">Manage free session requests from NSAT registrations</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white">
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">Total Submissions</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-6">
                        <p className="text-sm text-yellow-700">Pending Review</p>
                        <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                        <p className="text-sm text-green-700">Approved</p>
                        <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, email, or NSAT ID..."
                            className="pl-9 bg-gray-50 border-gray-200 text-gray-900 focus:border-primary/50 placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading referrals...</div>
                        ) : filteredReferrals.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm ? "No referrals found matching your search." : "No NSAT referrals yet."}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">NSAT ID</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Submitted</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredReferrals.map((referral) => (
                                            <tr key={referral.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-medium text-gray-900">
                                                    {referral.name}
                                                </td>
                                                <td className="p-4 text-gray-600 text-sm">
                                                    {referral.email}
                                                </td>
                                                <td className="p-4 text-gray-600 text-sm font-mono">
                                                    {referral.nsat_registration_id || "-"}
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(referral.status)}
                                                </td>
                                                <td className="p-4 text-gray-500 text-sm">
                                                    {new Date(referral.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {referral.status === "pending" && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleApprove(referral)}
                                                                    disabled={processingId === referral.id}
                                                                    className="bg-green-500 hover:bg-green-600 text-white"
                                                                >
                                                                    {processingId === referral.id ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <>
                                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                                            Approve
                                                                        </>
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleReject(referral)}
                                                                    disabled={processingId === referral.id}
                                                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                                                >
                                                                    <XCircle className="w-4 h-4 mr-1" />
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        {referral.status === "approved" && (
                                                            <span className="text-sm text-gray-500">
                                                                Approved {referral.approved_at && new Date(referral.approved_at).toLocaleDateString()}
                                                            </span>
                                                        )}
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
