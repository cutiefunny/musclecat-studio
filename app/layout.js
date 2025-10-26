// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AlertModal from "@/components/common/AlertModal";
import ConfirmModal from "@/components/common/ConfirmModal";

export const metadata = {
  applicationName: "근육고양이 스튜디오",
  title: {
    default: "근육고양이 스튜디오",
    template: "근육고양이 스튜디오",
  },
  description: "강력한 소프트웨어 개발 스튜디오다!",
  keywords: ["development", "studio", "musclecat", "software", "web", "app"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "근육고양이 스튜디오",
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "근육고양이 스튜디오",
    title: {
      default: "근육고양이 스튜디오",
      template: "근육고양이 스튜디오",
    },
    description: "강력한 소프트웨어 개발 스튜디오다!",
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AlertModal />
        <ConfirmModal />
      </body>
    </html>
  );
}