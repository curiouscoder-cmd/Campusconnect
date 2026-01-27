import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Video, MapPin, ExternalLink } from "lucide-react";
import { formatTime } from "@/lib/booking-utils";

export function BookingDetailsModal({ booking, onClose }) {
    if (!booking) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "Date not available";
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleAddToCalendar = () => {
        if (!booking) return;

        try {
            if (!booking.slot_date || !booking.slot_time) {
                console.warn("Missing slot date/time for calendar event");
                return;
            }

            let timeStr = booking.slot_time;
            if (timeStr && timeStr.split(':').length === 3) {
                timeStr = timeStr.substring(0, 5);
            }

            const start = new Date(`${booking.slot_date}T${timeStr || "12:00"}:00`);
            const duration = booking.duration || 30;
            const end = new Date(start.getTime() + duration * 60000);

            const event = {
                title: `Mentorship: ${booking.mentor_name}`,
                start: start.toISOString().replace(/-|:|\\.\\d+/g, ""),
                end: end.toISOString().replace(/-|:|\\.\\d+/g, ""),
                details: `Session with ${booking.mentor_name}. ${booking.meet_link ? `Link: ${booking.meet_link}` : ""}`,
                location: booking.meet_link || "Online",
            };

            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
            window.open(googleCalendarUrl, "_blank");
        } catch (e) {
            console.error("Calendar error", e);
        }
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
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Calendar className="w-32 h-32 transform translate-x-8 -translate-y-8 rotate-12" />
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
                                    {booking.mentor_image ? (
                                        <img
                                            src={booking.mentor_image}
                                            alt={booking.mentor_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        booking.mentor_name?.charAt(0) || "M"
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{booking.mentor_name}</h2>
                                    <p className="text-indigo-100 text-sm flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {booking.mentor_college || "College"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Status Badge */}
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>

                            {/* Session Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Date</span>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {booking.slot_date ? formatDate(booking.slot_date) : new Date(booking.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Time</span>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {booking.slot_time ? formatTime(booking.slot_time) : "TBD"}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <div className="flex items-center gap-2 text-indigo-500 mb-1">
                                    <Video className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase">Session Type</span>
                                </div>
                                <p className="font-semibold text-indigo-900 text-sm">
                                    {booking.session_title || "Mentorship Session"}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 pt-2">
                                {booking.meet_link && (
                                    <a
                                        href={booking.meet_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                    >
                                        Join Session <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}

                                <button
                                    onClick={handleAddToCalendar}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    <Calendar className="w-4 h-4" /> Add to Calendar
                                </button>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}
