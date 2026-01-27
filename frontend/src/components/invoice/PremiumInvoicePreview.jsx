"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, X, CheckCircle2, Calendar, Clock, CreditCard, FileText, Building2 } from 'lucide-react';
import ShineBorder from '@/components/ui/fancy/ShineBorder';

export default function PremiumInvoicePreview({ payment, onClose, onDownloadPDF }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const handlePrint = () => {
        window.print();
    };

    const totalAmount = parseFloat(payment.amount.replace(/[^0-9.]/g, '') || "0");
    const tax = parseFloat(payment.tax || 0);
    const subtotal = (totalAmount - tax).toFixed(2);

    const details = payment.payment_method_details || {};

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:bg-white print:backdrop-blur-none"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-2xl print:shadow-none print:max-w-full print:max-h-full print:rounded-none"
            >
                {/* Action Buttons - Hidden on Print */}
                <div className="absolute top-4 right-4 flex gap-2 print:hidden z-10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrint}
                        className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg"
                        title="Print to PDF"
                    >
                        <Printer className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onDownloadPDF}
                        className="p-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                        title="Download PDF"
                    >
                        <Download className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-lg"
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Invoice Content */}
                <div className="p-8 md:p-12 print:p-12">
                    {/* Header with Gradient Background */}
                    <div className="relative mb-8 pb-8 border-b-2 border-gradient-to-r from-emerald-500 to-teal-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-t-2xl -mx-8 md:-mx-12 -mt-8 md:-mt-12 h-32 print:rounded-none" />

                        <div className="relative flex justify-between items-start pt-4">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                                    Campus Connect
                                </h1>
                                <p className="text-sm text-gray-600">Professional Mentorship Services</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-emerald-600 mb-1">INVOICE</div>
                                <div className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                                    {payment.invoice_id || `INV-${payment.id.slice(-6).toUpperCase()}`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Meta Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Billed To */}
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Billed To</div>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                    <div className="font-bold text-gray-900 text-lg mb-1">
                                        {payment.user_name || "Student / Learner"}
                                    </div>
                                    {payment.user_email && (
                                        <div className="text-sm text-gray-600">{payment.user_email}</div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Method</div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="w-4 h-4 text-blue-600" />
                                        <span className="font-semibold text-gray-900">{payment.payment_method || "Online"}</span>
                                    </div>
                                    {details.Last4 && (
                                        <div className="text-sm text-gray-600">
                                            Card: •••• {details.Last4} {details.Network && `(${details.Network})`}
                                        </div>
                                    )}
                                    {details.VPA && (
                                        <div className="text-sm text-gray-600">UPI: {details.VPA}</div>
                                    )}
                                    {details.Bank && (
                                        <div className="text-sm text-gray-600">Bank: {details.Bank}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="space-y-3">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date of Issue</div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-600" />
                                    <span className="font-semibold text-gray-900">
                                        {payment.date || formatDate(new Date())}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transaction ID</div>
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-emerald-600" />
                                    <span className="font-mono text-sm text-gray-900">
                                        {payment.transaction_id?.slice(-12) || payment.id.slice(-12)}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    <span className="font-semibold text-emerald-900">Payment Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-t-xl px-6 py-3 border-b-2 border-emerald-500">
                            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                <div className="col-span-6">Description</div>
                                <div className="col-span-2 text-right">Unit Price</div>
                                <div className="col-span-2 text-right">Qty</div>
                                <div className="col-span-2 text-right">Amount</div>
                            </div>
                        </div>

                        <div className="border border-t-0 border-gray-200 rounded-b-xl p-6">
                            <div className="grid grid-cols-12 gap-4 items-start mb-4">
                                <div className="col-span-6">
                                    <div className="font-bold text-gray-900 text-lg mb-2">
                                        {payment.session_title || "Mentorship Session"}
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-3 h-3" />
                                            <span>Mentor: {payment.mentor_name}</span>
                                        </div>
                                        {payment.mentor_college && (
                                            <div className="text-xs text-gray-500 ml-5">{payment.mentor_college}</div>
                                        )}
                                        {payment.slot_date && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(payment.slot_date)}</span>
                                                {payment.slot_time && (
                                                    <>
                                                        <Clock className="w-3 h-3 ml-2" />
                                                        <span>{formatTime(payment.slot_time)}</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-2 text-right font-semibold text-gray-900">₹{subtotal}</div>
                                <div className="col-span-2 text-right font-semibold text-gray-900">1</div>
                                <div className="col-span-2 text-right font-semibold text-gray-900">₹{subtotal}</div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end mb-8">
                        <div className="w-full md:w-1/2 space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-900">₹{subtotal}</span>
                            </div>
                            {tax > 0 && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-semibold text-gray-900">₹{tax.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center py-4 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 rounded-xl border-2 border-emerald-500">
                                <span className="text-lg font-bold text-emerald-900">Amount Paid</span>
                                <span className="text-2xl font-bold text-emerald-600">₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 border-t border-gray-200 text-center space-y-2">
                        <p className="text-sm text-gray-600">Thank you for choosing Campus Connect!</p>
                        <p className="text-sm text-gray-500">
                            Questions? Email us at{' '}
                            <a href="mailto:contact@campus-connect.co.in" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                contact@campus-connect.co.in
                            </a>
                        </p>
                        <p className="text-xs text-gray-400 pt-2">
                            © {new Date().getFullYear()} Campus Connect Inc. • This is a computer-generated invoice.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
