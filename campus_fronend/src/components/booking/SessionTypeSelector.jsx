"use client";

import { motion } from "framer-motion";
import { Clock, Video, Users, Check } from "lucide-react";
import { SESSION_TYPES } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";

const iconMap = {
  quick: Clock,
  deep: Video,
  group: Users,
};

export function SessionTypeSelector({ selectedType, onSelectType }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Choose session type
      </h3>

      {SESSION_TYPES.map((session) => {
        const Icon = iconMap[session.id] || Clock;
        const isSelected = selectedType?.id === session.id;

        return (
          <motion.button
            key={session.id}
            onClick={() => onSelectType(session)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
              isSelected
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  isSelected ? "bg-indigo-500" : "bg-gray-100"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isSelected ? "text-white" : "text-gray-600"
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {session.title}
                    </span>
                    {session.type === "group" && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Up to {session.maxParticipants} people
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-indigo-600">
                    ₹{session.price}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  {session.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {session.duration} min
                  </span>
                  <span>{session.type === "1:1" ? "1:1 Session" : "Group Session"}</span>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
