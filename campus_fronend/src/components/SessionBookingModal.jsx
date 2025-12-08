"use client";

import { useState, useEffect } from "react";
import { X, Clock, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

// Session types configuration - easy to modify pricing/duration
const SESSION_TYPES = [
  {
    id: "quick",
    title: "Quick Chat",
    duration: "15 min",
    type: "1:1 Session",
    price: "₹99",
    description: "Perfect for quick doubts about admissions or campus life",
    icon: Clock,
    calendlyPath: "15min", // Will be appended to base Calendly URL
  },
  {
    id: "deep",
    title: "Deep Dive",
    duration: "30 min",
    type: "1:1 Session",
    price: "₹199",
    description: "Detailed discussion about placements, faculty, and more",
    icon: Video,
    calendlyPath: "30min",
    popular: true,
  },
  {
    id: "group",
    title: "Group Session",
    duration: "45 min",
    type: "Group Session",
    price: "₹149",
    description: "Join with other applicants, ask questions together",
    icon: Users,
    calendlyPath: "45min-group",
  },
];

// Base Calendly URL - change this to your actual Calendly username
const CALENDLY_BASE_URL = "https://calendly.com/nitya6402";

export function SessionBookingModal({ mentor, isOpen, onClose }) {
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen || calendlyOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, calendlyOpen]);

  if (!isOpen && !calendlyOpen) return null;

  const handleBookSession = (session) => {
    const calendlyUrl = `${CALENDLY_BASE_URL}/${session.calendlyPath}`;
    setSelectedUrl(calendlyUrl);
    setCalendlyOpen(true);
    onClose(); // Close session type modal
  };

  const handleCloseCalendly = () => {
    setCalendlyOpen(false);
    setSelectedUrl("");
  };

  return (
    <>
      {/* Session Type Selection Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {mentor?.name?.charAt(0) || "S"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{mentor?.name || "Student"}</h3>
                  <p className="text-sm text-muted-foreground">{mentor?.college || "NST"}</p>
                </div>
              </div>
            </div>

            {/* Session Options */}
            <div className="p-6 space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Choose session type</h4>
              
              {SESSION_TYPES.map((session) => {
                const Icon = session.icon;
                return (
                  <button
                    key={session.id}
                    onClick={() => handleBookSession(session)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:border-primary hover:bg-primary/5 ${
                      session.popular ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${session.popular ? "bg-primary/10" : "bg-gray-100"}`}>
                        <Icon className={`w-5 h-5 ${session.popular ? "text-primary" : "text-gray-600"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{session.title}</span>
                            {session.popular && (
                              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-primary">{session.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{session.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {session.duration}
                          </span>
                          <span>{session.type}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-center text-muted-foreground">
                100% money-back guarantee if you&apos;re not satisfied
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calendly Popup Modal */}
      {calendlyOpen && selectedUrl && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleCloseCalendly}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseCalendly}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <iframe
              src={selectedUrl}
              width="100%"
              height="650"
              frameBorder="0"
              title="Schedule a meeting"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </>
  );
}

// Wrapper component for MentorCard with Book Session button
export function MentorCardWithBooking({ mentor, children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full">
        {children}
        <div className="mt-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Book Session
          </button>
        </div>
      </div>
      <SessionBookingModal
        mentor={mentor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
