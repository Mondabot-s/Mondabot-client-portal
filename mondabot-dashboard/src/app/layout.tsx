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

  // Check if Clerk is configured
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Only wrap with ClerkProvider if the publishable key is available
  if (publishableKey) {
    return (
      <ClerkProvider
        publishableKey={publishableKey}
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: "#d90077",
            colorBackground: "#ffffff",
            colorText: "#1f2937",
            colorInputBackground: "#ffffff",
            colorInputText: "#1f2937",
            borderRadius: "0.5rem",
          },
        }}
        signInUrl="/login"
        signUpUrl="/signup"
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        {content}
      </ClerkProvider>
    );
  }

  // Return content without ClerkProvider if key is not available
  return content;
}
