import { icons } from "lucide-react";
import "./globals.css";

export const metadata = {
  icons: {
    icon: "/resume.png",
  },
  title: "CogniCV",
  description: "AI Resume Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}