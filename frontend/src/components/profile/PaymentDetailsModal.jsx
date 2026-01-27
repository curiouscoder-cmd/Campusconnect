import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Video, MapPin, ExternalLink, CreditCard, Receipt, FileText, Eye } from "lucide-react";
import { formatTime } from "@/lib/booking-utils";
import jsPDF from "jspdf";
import PremiumInvoicePreview from "@/components/invoice/PremiumInvoicePreview";

export function PaymentDetailsModal({ payment, onClose }) {
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);
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

    const handleDownloadReceipt = () => {
        const doc = new jsPDF();

        // Colors & Fonts
        const primaryColor = [16, 185, 129]; // Emerald 500
        const darkText = [30, 41, 59]; // Slate 800
        const lightText = [100, 116, 139]; // Slate 500
        const borderColor = [226, 232, 240]; // Slate 200
        const bgLight = [248, 250, 252]; // Slate 50

        // --- HEADER SECTION WITH BACKGROUND ---
        doc.setFillColor(...bgLight);
        doc.rect(0, 0, 210, 45, "F");

        // Logo & Company Name
        doc.setTextColor(...primaryColor);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Campus Connect", 20, 22);

        doc.setFontSize(9);
        doc.setTextColor(...lightText);
        doc.setFont("helvetica", "normal");
        doc.text("Learner's Platform • Professional Mentorship Services", 20, 28);

        // INVOICE Title (Right)
        doc.setTextColor(...primaryColor);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 190, 22, { align: "right" });

        doc.setFontSize(10);
        doc.setTextColor(...darkText);
        doc.setFont("helvetica", "normal");
        doc.text(payment.invoice_id || `INV-${payment.id.slice(-6).toUpperCase()}`, 190, 30, { align: "right" });

        // --- INVOICE META SECTION ---
        const metaY = 55;

        // Left Column - Billed To
        doc.setFontSize(8);
        doc.setTextColor(...lightText);
        doc.setFont("helvetica", "bold");
        doc.text("BILLED TO", 20, metaY);

        doc.setFontSize(11);
        doc.setTextColor(...darkText);
        doc.setFont("helvetica", "bold");
        doc.text(payment.user_name || "Student / Learner", 20, metaY + 6);

        doc.setFontSize(9);
        doc.setTextColor(...lightText);
        doc.setFont("helvetica", "normal");
        if (payment.user_email) doc.text(payment.user_email, 20, metaY + 12);

        // Right Column - Invoice Details
        const rightX = 120;
        doc.setFontSize(8);
        doc.setTextColor(...lightText);
        doc.setFont("helvetica", "bold");

        doc.text("DATE OF ISSUE", rightX, metaY);
        doc.text("TRANSACTION ID", rightX, metaY + 10);

        doc.setFontSize(9);
        doc.setTextColor(...darkText);
        doc.setFont("helvetica", "normal");
        doc.text(payment.date || new Date().toLocaleDateString(), rightX + 35, metaY);
        doc.text(payment.transaction_id?.slice(-12) || payment.id.slice(-12), rightX + 35, metaY + 10);

        // --- PAYMENT METHOD SECTION ---
        const payY = metaY + 25;
        doc.setFontSize(8);
        doc.setTextColor(...lightText);
        doc.setFont("helvetica", "bold");
        doc.text("PAYMENT METHOD", 20, payY);

        let methodText = payment.payment_method || "Online";
        const details = payment.payment_method_details || {};

        doc.setFontSize(10);
        doc.setTextColor(...darkText);
        doc.setFont("helvetica", "normal");
        doc.text(methodText, 20, payY + 6);

        // Add specific details based on method
        let detailY = payY + 12;
        if (details.Last4) {
            doc.setFontSize(8);
            doc.setTextColor(...lightText);
            doc.text(`Card: •••• ${details.Last4}${details.Network ? ` (${details.Network})` : ''}`, 20, detailY);
            detailY += 5;
        }
        if (details.VPA) {
            doc.setFontSize(8);
            doc.setTextColor(...lightText);
            doc.text(`UPI: ${details.VPA}`, 20, detailY);
            detailY += 5;
        }
        if (details.Bank) {
            doc.setFontSize(8);
            doc.setTextColor(...lightText);
            doc.text(`Bank: ${details.Bank}`, 20, detailY);
        }

        // --- LINE ITEMS TABLE ---
        let yPos = 110;

        // Table Header
        doc.setFillColor(...bgLight);
        doc.rect(15, yPos - 6, 180, 10, "F");

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...lightText);
        doc.text("DESCRIPTION", 20, yPos);
        doc.text("UNIT PRICE", 125, yPos, { align: 'right' });
        doc.text("QTY", 150, yPos, { align: 'right' });
        doc.text("AMOUNT", 190, yPos, { align: 'right' });

        // Item Row
        yPos += 12;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...darkText);
        doc.text(payment.session_title || "Mentorship Session", 20, yPos);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...lightText);
        doc.text(`Mentor: ${payment.mentor_name}`, 20, yPos + 5);
        if (payment.mentor_college) doc.text(payment.mentor_college, 20, yPos + 10);

        const dateStr = payment.slot_date ? formatDate(payment.slot_date) : "";
        const timeStr = payment.slot_time ? formatTime(payment.slot_time) : "";
        if (dateStr) doc.text(`Scheduled: ${dateStr}${timeStr ? ' • ' + timeStr : ''}`, 20, yPos + 15);

        // Pricing
        const totalAmount = parseFloat(payment.amount.replace(/[^0-9.]/g, '') || "0");
        const tax = parseFloat(payment.tax || 0);
        const displaySubtotal = (totalAmount - tax).toFixed(2);

        doc.setFontSize(10);
        doc.setTextColor(...darkText);
        doc.setFont("helvetica", "normal");
        doc.text(`₹${displaySubtotal}`, 125, yPos, { align: 'right' });
        doc.text("1", 150, yPos, { align: 'right' });
        doc.text(`₹${displaySubtotal}`, 190, yPos, { align: 'right' });

        // --- SUMMARY SECTION ---
        yPos += 30;
        doc.setDrawColor(...borderColor);
        doc.line(15, yPos, 195, yPos);

        yPos += 10;
        const summaryX = 135;
        const valX = 190;

        doc.setFontSize(9);
        doc.setTextColor(...lightText);
        doc.setFont("helvetica", "normal");

        doc.text("Subtotal", summaryX, yPos);
        doc.setTextColor(...darkText);
        doc.text(`₹${displaySubtotal}`, valX, yPos, { align: 'right' });

        if (tax > 0) {
            yPos += 7;
            doc.setTextColor(...lightText);
            doc.text("Tax", summaryX, yPos);
            doc.setTextColor(...darkText);
            doc.text(`₹${tax.toFixed(2)}`, valX, yPos, { align: 'right' });
        }

        // Total
        yPos += 12;
        doc.setDrawColor(...borderColor);
        doc.line(summaryX - 5, yPos - 5, 195, yPos - 5);

        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryColor);
        doc.text("Amount Paid", summaryX, yPos);
        doc.text(`₹${totalAmount.toFixed(2)}`, valX, yPos, { align: 'right' });

        // --- FOOTER ---
        const pageHeight = doc.internal.pageSize.height;

        // Footer background
        doc.setFillColor(...bgLight);
        doc.rect(0, pageHeight - 35, 210, 35, "F");

        doc.setFontSize(8);
        doc.setTextColor(...lightText);
        doc.setFont("helvetica", "normal");

        doc.text("Thank you for choosing Campus Connect!", 105, pageHeight - 22, { align: "center" });
        doc.text("Questions? Email us at contact@campus-connect.co.in", 105, pageHeight - 16, { align: "center" });

        doc.setFontSize(7);
        doc.setTextColor(...lightText);
        doc.text(`© ${new Date().getFullYear()} Campus Connect Inc. • This is a computer-generated invoice.`, 105, pageHeight - 10, { align: "center" });

        doc.save(`Invoice_${payment.invoice_id || payment.id}.pdf`);
    };

    return (
        <>
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
                                            <span className="text-xs font-medium uppercase">Amount Paid</span>
                                        </div>
                                        <p className="font-bold text-emerald-700 text-lg">
                                            {payment.amount}
                                        </p>
                                        {payment.tax > 0 && (
                                            <p className="text-xs text-gray-400 mt-1">Includes ₹{payment.tax} Tax</p>
                                        )}
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <div className="p-1 bg-gray-200 rounded-full text-gray-600">
                                                <FileText className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-medium uppercase">Invoice Ref</span>
                                        </div>
                                        <p className="font-semibold text-gray-900 text-sm font-mono break-all">
                                            {payment.invoice_id || `#${payment.id.slice(-6).toUpperCase()}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Detailed Payment Specs */}
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-blue-50 rounded-full text-blue-600">
                                            <CreditCard className="w-3 h-3" />
                                        </div>
                                        <span className="text-xs font-medium uppercase text-gray-500">Method</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {payment.payment_method || "Online"}
                                        </p>
                                        {payment.payment_method_details && (
                                            <p className="text-xs text-gray-400">
                                                {payment.payment_method_details.Last4 ? `•••• ${payment.payment_method_details.Last4}` :
                                                    payment.payment_method_details.VPA ? payment.payment_method_details.VPA : ''}
                                            </p>
                                        )}
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
                                        onClick={() => setShowInvoicePreview(true)}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-900/20"
                                    >
                                        <Eye className="w-4 h-4" /> Preview Invoice
                                    </button>

                                    <button
                                        onClick={handleDownloadReceipt}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-purple-900/10"
                                    >
                                        <Receipt className="w-4 h-4" /> Download PDF
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

            {/* Premium Invoice Preview Modal */}
            <AnimatePresence>
                {showInvoicePreview && (
                    <PremiumInvoicePreview
                        payment={payment}
                        onClose={() => setShowInvoicePreview(false)}
                        onDownloadPDF={handleDownloadReceipt}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
