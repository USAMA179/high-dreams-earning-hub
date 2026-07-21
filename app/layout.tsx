import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "High Dreams Earning Hub",
  description: "A premium landing page for verified online earning platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        {children}
        <a
          href="https://wa.me/923374311057"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="WhatsApp support"
          className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.21-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.004 2.003C6.485 2.003 2 6.485 2 12.003c0 1.787.47 3.458 1.361 4.941L2 22l4.976-1.292a9.916 9.916 0 0 0 4.99 1.266h.035c5.52 0 10.005-4.483 10.005-10.005S17.524 2.003 12.004 2.003zm0 18.41h-.029a8.02 8.02 0 0 1-4.08-1.111l-.292-.173-2.95.766.79-2.874-.19-.296A7.952 7.952 0 0 1 4 12.003c0-4.414 3.59-8.005 8.003-8.005 4.414 0 8.005 3.59 8.005 8.005 0 4.414-3.59 8.005-8.005 8.005z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
