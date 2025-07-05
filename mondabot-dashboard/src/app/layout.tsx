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

  // Always wrap with ClerkProvider and configure custom URLs
  return (
    <ClerkProvider
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
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {content}
    </ClerkProvider>
  );
}
