import { Mulish } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata = {
  title: "WarmZap - Evite bloqueios no WhatsApp",
  description:
    "Conecte contas de WhatsApp recém-criadas e simule conversas de forma natural e automatizada para reduzir as chances de bloqueio.",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mulish.className}  antialiased`}>
        <ToastContainer autoClose={2000} />
        {children}
      </body>
    </html>
  );
}
