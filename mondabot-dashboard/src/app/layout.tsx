import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Layout from "../components/Layout";
import DevHealthCheck from "../components/DevHealthCheck";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mondabot Dashboard",
  description: "Project management dashboard with Airtable integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if Clerk is configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  const content = (
    <html lang="en">
      <body className={`${poppins.variable} font-sans page-background`}>
        <Layout>
          {children}
        </Layout>
        <DevHealthCheck />
      </body>
    </html>
  );

  // Only wrap with ClerkProvider if key is available
  if (clerkPublishableKey) {
    return (
      <ClerkProvider>
        {content}
      </ClerkProvider>
    );
  }

  // Return content without Clerk if key is not available (build time)
  return content;
}
