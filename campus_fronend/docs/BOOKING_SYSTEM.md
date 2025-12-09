# Campus Connect - Custom Booking System

A premium Calendly-style booking system for student-to-student college guidance sessions.

## Overview

This booking system provides a complete workflow for scheduling paid mentorship sessions:
1. **Slot Selection** - Calendar-based time slot picker
2. **Session Type** - Choose between Quick Chat, Deep Dive, or Group Session
3. **User Details** - Collect applicant information
4. **Payment** - Razorpay integration with 10-minute slot reservation
5. **Confirmation** - Meeting link generation and calendar integration

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BookingModal                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  SlotPicker  │→ │SessionType   │→ │ UserDetails  │           │
│  │              │  │  Selector    │  │    Form      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│         ↓                                    ↓                   │
│  ┌──────────────┐                   ┌──────────────┐            │
│  │PaymentScreen │←──────────────────│ Razorpay    │            │
│  │ (10min hold) │                   │  Checkout   │            │
│  └──────────────┘                   └──────────────┘            │
│         ↓                                                        │
│  ┌──────────────┐                                               │
│  │Confirmation  │ → Email + Calendar + Meet Link                │
│  │   Screen     │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### Frontend Components

| Component | Location | Description |
|-----------|----------|-------------|
| `BookingModal` | `/src/components/booking/BookingModal.jsx` | Main orchestrator component |
| `SlotPicker` | `/src/components/booking/SlotPicker.jsx` | Calendar and time slot selection |
| `SessionTypeSelector` | `/src/components/booking/SessionTypeSelector.jsx` | Session type cards |
| `UserDetailsForm` | `/src/components/booking/UserDetailsForm.jsx` | User information form |
| `PaymentScreen` | `/src/components/booking/PaymentScreen.jsx` | Payment with countdown timer |
| `ConfirmationScreen` | `/src/components/booking/ConfirmationScreen.jsx` | Success screen with meet link |

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/availability/[mentorId]` | GET | Fetch mentor's available slots |
| `/api/bookings/hold-slot` | POST | Reserve slot for 10 minutes |
| `/api/bookings/hold-slot` | DELETE | Release slot reservation |
| `/api/payments/create-order` | POST | Create Razorpay order |
| `/api/payments/verify` | POST | Verify payment and confirm booking |
| `/api/bookings/confirm` | POST | Finalize booking |
| `/api/bookings/confirm` | GET | Fetch booking details |

## Session Types

| Type | Duration | Price | Description |
|------|----------|-------|-------------|
| Quick Chat | 15 min | ₹99 | Quick doubts about admissions or campus life |
| Deep Dive | 30 min | ₹199 | Detailed discussion about placements, faculty |
| Group Session | 45 min | ₹49/seat | Join with other applicants |

## Booking Flow

```
User clicks "Book Session"
        ↓
┌───────────────────┐
│  1. Select Slot   │ ← Calendar view with available times
└───────────────────┘
        ↓
┌───────────────────┐
│ 2. Session Type   │ ← Quick Chat / Deep Dive / Group
└───────────────────┘
        ↓
┌───────────────────┐
│ 3. User Details   │ ← Name, Email, Phone, Questions
└───────────────────┘
        ↓
┌───────────────────┐
│ 4. Payment        │ ← Slot reserved for 10 minutes
│   [10:00 timer]   │   Razorpay checkout opens
└───────────────────┘
        ↓
    Payment Success?
    ├── Yes → Confirm booking, generate meet link
    └── No  → Release slot, return to step 1
        ↓
┌───────────────────┐
│ 5. Confirmation   │ ← Meet link, calendar invite
└───────────────────┘
```

## Database Schema (Supabase)

### Tables

```sql
-- Mentors table
CREATE TABLE mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  image TEXT,
  role TEXT,
  college TEXT,
  branch TEXT,
  year TEXT,
  rating DECIMAL(2,1),
  tags TEXT[],
  meet_link TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Availability table
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  is_reserved BOOLEAN DEFAULT FALSE,
  reserved_until TIMESTAMP,
  reserved_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id),
  slot_id UUID REFERENCES availability(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  questions TEXT,
  session_type TEXT NOT NULL,
  session_duration INTEGER,
  session_price INTEGER,
  status TEXT DEFAULT 'pending',
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  meet_link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  order_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'created',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

```env
# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Design System

### Colors
- **Primary**: Indigo (#6366F1)
- **Background**: White (#FFFFFF)
- **Border**: rgba(17, 24, 39, 0.06)
- **Text**: Gray-900 (#111827)
- **Muted**: Gray-500 (#6B7280)

### Styling
- Border radius: 18-20px for modals, 12px for cards
- Shadows: Soft, high-end look
- Animations: Framer Motion for smooth transitions
- Typography: Clean, editorial layout

## Usage

```jsx
import { BookingModal } from "@/components/booking";

function MentorPage() {
  const [isOpen, setIsOpen] = useState(false);
  
  const mentor = {
    id: "mentor-1",
    name: "John Doe",
    role: "2nd Year Student",
    college: "Newton School of Technology",
    expertise: ["Campus Life", "Placements"],
    rating: "4.9",
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Book Session
      </button>
      
      <BookingModal
        mentor={mentor}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

## Error Handling

| Error | Handling |
|-------|----------|
| Slot already booked | Show error, return to slot selection |
| Reservation expired | Show warning, auto-return to slot selection |
| Payment failed | Show error message, allow retry |
| Network error | Show retry button with error message |

## Future Enhancements

1. **Google Calendar Integration** - Auto-create calendar events
2. **Email Notifications** - Confirmation emails with ICS attachments
3. **SMS Reminders** - Send reminders before sessions
4. **Rescheduling** - Allow users to reschedule bookings
5. **Cancellation & Refunds** - Handle cancellations with refund logic
6. **Mentor Dashboard** - View and manage bookings
7. **Analytics** - Track booking metrics and conversion rates
