import "./globals.css";

export const metadata = {
  title: "RAG Chatbot",
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