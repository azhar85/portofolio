import "./globals.css";

export const metadata = {
  title: "Ahmad Azhar — Developer & Entrepreneur",
  description: "Portfolio of Ahmad Azhar — Full-Stack Developer, AI Enthusiast & Entrepreneur. Building digital products and businesses.",
  keywords: ["developer", "portfolio", "full-stack", "entrepreneur", "AI"],
  openGraph: {
    title: "Ahmad Azhar — Developer & Entrepreneur",
    description: "Full-Stack Developer, AI Enthusiast & Entrepreneur",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
