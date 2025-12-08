"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function CalendlyWidget({ url = "https://calendly.com/your-username" }) {
  return (
    <div
      style={{
        minWidth: "320px",
        height: "630px",
        borderRadius: "0.875rem",
        overflow: "hidden",
      }}
    >
      <iframe
        src={url}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Schedule a meeting"
        style={{ border: "none" }}
      />
    </div>
  );
}

export function CalendlyButton({ url = "https://calendly.com/your-username", label = "Book a Session" }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full px-8 h-12 text-base gradient-bg text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 border-0 font-medium cursor-pointer"
      >
        {label}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Calendly Iframe */}
            <iframe
              src={url}
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
