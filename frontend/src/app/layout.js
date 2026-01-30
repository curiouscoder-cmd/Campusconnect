import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/smooth-scroll";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata = {
  title: "Campus Connect | Talk to Real Students at New-Gen Colleges",
  description: "Get honest insights from current students at NST, Vedam, NIAT & more. Book 1:1 sessions to ask about campus life, placements, faculty, hostel, and whether the college is worth joining.",
  metadataBase: new URL('https://campus-connect.co.in'),
  openGraph: {
    title: 'Campus Connect | Talk to Real Students',
    description: 'Get honest insights from current students at new-gen colleges. Book 1:1 sessions for just ₹49.',
    url: 'https://campus-connect.co.in',
    siteName: 'Campus Connect',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Campus Connect - Talk to Real Students',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Connect | Talk to Real Students',
    description: 'Get honest insights from current students at new-gen colleges. Book 1:1 sessions for just ₹49.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: "/favicon_light.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon_dark.ico",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans`}>
        <AuthProvider>
          <SmoothScroll />
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                fontFamily: 'var(--font-inter)',
              },
            }}
          />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
