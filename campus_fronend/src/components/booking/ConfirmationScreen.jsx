"use client";

import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, Video, Mail, Copy, ExternalLink } from "lucide-react";
import { formatTime } from "@/lib/booking-utils";
import { useState } from "react";

export function ConfirmationScreen({
  mentor,
  selectedSlot,
  selectedSession,
  userDetails,
  meetLink,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (meetLink) {
      navigator.clipboard.writeText(meetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCalendar = () => {
    const startDate = new Date(`${selectedSlot.date}T${selectedSlot.startTime}:00`);
    const endDate = new Date(startDate.getTime() + selectedSession.duration * 60000);

    const event = {
      title: `Campus Connect: ${selectedSession.title} with ${mentor.name}`,
      start: startDate.toISOString().replace(/-|:|\.\d+/g, ""),
      end: endDate.toISOString().replace(/-|:|\.\d+/g, ""),
      details: `Session with ${mentor.name} from ${mentor.college}.\n\nMeet Link: ${meetLink || "Will be shared via email"}`,
      location: meetLink || "Online",
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;

    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="text-center space-y-6">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>
      </motion.div>

      {/* Success Message */}
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900"
        >
          Booking Confirmed!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mt-2"
        >
          Your session with {mentor.name} has been scheduled
        </motion.p>
      </div>

      {/* Booking Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 rounded-xl p-5 text-left space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-lg font-bold text-indigo-600">
              {mentor.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{mentor.name}</p>
            <p className="text-sm text-gray-500">{mentor.college}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {formatTime(selectedSlot.startTime)} ({selectedSession.duration} min)
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Video className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{selectedSession.title}</span>
          </div>
        </div>

        {/* Meet Link */}
        {meetLink && (
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 mb-2">Meeting Link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={meetLink}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-indigo-600" />
              </a>
            </div>
          </div>
        )}
      </motion.div>

      {/* Email Confirmation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 text-sm text-gray-500"
      >
        <Mail className="w-4 h-4" />
        <span>Confirmation sent to {userDetails.email}</span>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        <button
          onClick={handleAddToCalendar}
          className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Add to Google Calendar
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
}
