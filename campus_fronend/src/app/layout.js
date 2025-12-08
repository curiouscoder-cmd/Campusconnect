import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { FloatingNav } from "@/components/ui/floating-navbar";
import SmoothScroll from "@/components/smooth-scroll";
import { Home, Users, MessageSquare, Phone } from "lucide-react"; // Using Lucide instead of Tabler for consistency

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Campus Connect",
  description: "Mentorship platform for students",
};

export default function RootLayout({ children }) {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Mentors",
      link: "/#mentors",
      icon: <Users className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <SmoothScroll />
        <FloatingNav navItems={navItems} />
        {children}
      </body>
    </html>
  );
}
