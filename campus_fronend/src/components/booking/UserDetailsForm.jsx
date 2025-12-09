"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserDetailsForm({ userDetails, onUpdateDetails, onSubmit }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!userDetails.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userDetails.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!userDetails.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(userDetails.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleChange = (field, value) => {
    onUpdateDetails({ ...userDetails, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Enter your details
      </h3>

      {/* Name Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          Full Name
        </label>
        <input
          type="text"
          value={userDetails.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter your full name"
          className={cn(
            "w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-0",
            errors.name
              ? "border-red-300 focus:border-red-500"
              : "border-gray-200 focus:border-indigo-500"
          )}
        />
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500"
          >
            {errors.name}
          </motion.p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          Email Address
        </label>
        <input
          type="email"
          value={userDetails.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter your email"
          className={cn(
            "w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-0",
            errors.email
              ? "border-red-300 focus:border-red-500"
              : "border-gray-200 focus:border-indigo-500"
          )}
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500"
          >
            {errors.email}
          </motion.p>
        )}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          Phone Number
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-4 py-3 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
            +91
          </span>
          <input
            type="tel"
            value={userDetails.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="Enter your phone number"
            className={cn(
              "flex-1 px-4 py-3 rounded-r-xl border-2 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-0",
              errors.phone
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-indigo-500"
            )}
          />
        </div>
        {errors.phone && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500"
          >
            {errors.phone}
          </motion.p>
        )}
      </div>

      {/* Questions Field (Optional) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          Questions for the mentor{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={userDetails.questions || ""}
          onChange={(e) => handleChange("questions", e.target.value)}
          placeholder="What would you like to discuss?"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 focus:border-indigo-500 resize-none"
        />
      </div>
    </form>
  );
}
