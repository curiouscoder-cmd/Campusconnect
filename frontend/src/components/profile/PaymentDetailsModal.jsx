import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Video, MapPin, ExternalLink, CreditCard, Receipt, FileText } from "lucide-react";
import { formatTime } from "@/lib/booking-utils";

export function PaymentDetailsModal({ payment, onClose }) {
    if (!payment) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "Date not available";
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md perspective-1000"
                >

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative w-full">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <CreditCard className="w-32 h-32 transform translate-x-8 -translate-y-8 rotate-12" />
                            </div>

                            <button
                                onClick={onClose}
                                type="button"
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all backdrop-blur-md z-50 cursor-pointer"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/30 backdrop-blur-md shadow-inner overflow-hidden">
                                    {payment.mentor_image ? (
                                        <img
                                            src={payment.mentor_image}
                                            alt={payment.mentor_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        payment.mentor_name?.charAt(0) || "M"
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{payment.mentor_name}</h2>
                                    <p className="text-emerald-100 text-sm flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {payment.mentor_college || "College"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Status Badge */}
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${payment.status === 'Completed' || payment.status === 'captured' ? 'bg-emerald-100 text-emerald-700' :
                                    payment.status === 'Refunded' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {payment.status}
                                </span>
                            </div>

                            {/* Payment Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <div className="p-1 bg-emerald-100 rounded-full text-emerald-600">
                                            <Receipt className="w-3 h-3" />
                                        </div>
                                        <span className="text-xs font-medium uppercase">Amount</span>
                                    </div>
                                    <p className="font-bold text-emerald-700 text-lg">
                                        {payment.amount}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <div className="p-1 bg-gray-200 rounded-full text-gray-600">
                                            <FileText className="w-3 h-3" />
                                        </div>
                                        <span className="text-xs font-medium uppercase">Booking Ref</span>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm font-mono">
                                        #{payment.id.slice(-6).toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            {/* Session Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Date</span>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {payment.slot_date ? formatDate(payment.slot_date) : new Date(payment.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Time</span>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {payment.slot_time ? formatTime(payment.slot_time) : "TBD"}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                    <Video className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase">Session Type</span>
                                </div>
                                <p className="font-semibold text-emerald-900 text-sm">
                                    {payment.session_title || "Mentorship Session"}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={() => alert("Receipt download coming soon!")}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    <Receipt className="w-4 h-4" /> Download Receipt
                                </button>

                                {payment.meet_link && (
                                    <a
                                        href={payment.meet_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 text-emerald-600 bg-emerald-50 rounded-xl font-semibold hover:bg-emerald-100 transition-colors"
                                    >
                                        Join Session <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}
