import "./globals.css";

export const metadata = {
  title: "CogniCV",
  description: "AI Resume Assistant",
  icons: {
    icon: "/resume.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#042930] text-white">
        {children}
      </body>
    </html>
  );
}