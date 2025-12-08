# Calendly Integration Setup

## Overview
Calendly has been integrated into Campus Connect for booking sessions. The integration uses the Calendly widget API.

## Setup Instructions

### 1. Get Your Calendly URL
- Go to [calendly.com](https://calendly.com)
- Sign up or log in to your account
- Create an event type for student sessions
- Copy your unique Calendly URL (e.g., `https://calendly.com/your-username/30min`)

### 2. Update the Calendly URL
Replace `https://calendly.com/your-username` with your actual Calendly URL in:

**File:** `src/app/page.js` (Line 145)
```jsx
<CalendlyButton url="https://calendly.com/YOUR-ACTUAL-URL" label="Talk to a Student" />
```

### 3. Available Components

#### CalendlyButton (Popup)
Opens Calendly in a popup modal when clicked.
```jsx
import { CalendlyButton } from "@/components/CalendlyWidget";

<CalendlyButton 
  url="https://calendly.com/your-username" 
  label="Book a Session" 
/>
```

#### CalendlyWidget (Inline)
Embeds Calendly directly on the page.
```jsx
import { CalendlyWidget } from "@/components/CalendlyWidget";

<CalendlyWidget url="https://calendly.com/your-username" />
```

## Features
- ✅ Popup booking modal (current implementation)
- ✅ Inline calendar embed option
- ✅ Styled to match Campus Connect design
- ✅ Responsive and mobile-friendly
- ✅ No additional npm packages required (uses Calendly's external widget)

## Customization

### Change Button Text
```jsx
<CalendlyButton label="Schedule Now" url="..." />
```

### Change Button Styling
Edit the className in `src/components/CalendlyWidget.jsx` in the `CalendlyButton` component.

### Add to Other Pages
You can use `CalendlyButton` or `CalendlyWidget` on any page:
```jsx
import { CalendlyButton } from "@/components/CalendlyWidget";

export default function BookingPage() {
  return <CalendlyButton url="https://calendly.com/your-username" />;
}
```

## Testing
1. Click the "Talk to a Student" button in the hero section
2. The Calendly popup should appear
3. You should be able to select a time slot and book

## Troubleshooting

**Popup doesn't open:**
- Verify your Calendly URL is correct
- Check browser console for errors
- Ensure Calendly script loaded successfully

**Styling issues:**
- The button uses Tailwind CSS classes
- Adjust className in CalendlyWidget.jsx if needed

**Mobile issues:**
- Calendly widget is responsive by default
- Test on mobile devices to ensure proper display

## Next Steps
- Replace `your-username` with your actual Calendly URL
- Test the booking flow
- Customize button text and styling as needed
- Consider adding Calendly to other CTAs (e.g., mentor cards, pricing section)
