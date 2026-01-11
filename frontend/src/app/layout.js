import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/smooth-scroll";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata = {
  title: "Campus Connect | Talk to Real Students at New-Gen Colleges",
  description: "Get honest insights from current students at NST, Vedam, NIAT & more. Book 1:1 sessions to ask about campus life, placements, faculty, hostel, and whether the college is worth joining.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans`}>
        <AuthProvider>
          <SmoothScroll />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
