import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css"; 
import Link from "next/link";
import './globals.css';

const roboto = Roboto({
  variable: "--font-Roboto",
  weight: "400"
})

export const metadata: Metadata = {
  title: "Hello world App",
  description: "This is my first hello app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${roboto.className} bg-[#FDFBF0] text-[#333] min-h-screen`}
      >
        {/* <nav className="flex m-2 p-2 text-xl font-bold text-blue-800 border-2 shadow-lg bg-amber-100 justify-between"> 
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/foo">Foo</Link>
        </nav> */}
      
      {/* --- Header --- */}
      <header className="w-full bg-[#FDFBF0]">
        <div className="max-w-[1440px] w-[90%] mx-auto h-20 flex justify-between items-center">
          
          {/* Logo */}
          {/* <div className="flex items-center gap-2 text-2xl font-bold">
            <img src="/referent/icon.png" width="40" alt="icon home" className="w-10 h-10" />
            <span className="text-black">CoC</span>
          </div> */}

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-10 items-center">
            <Link href="/" className="font-extrabold text-black text-base hover:text-[#997A2E] transition-colors">HOME</Link>
            <Link href="/AddEntry" className="font-extrabold text-black text-base hover:text-[#997A2E] transition-colors">ADD ENTRY</Link>
            <Link href="/Stats" className="font-extrabold text-black text-base hover:text-[#997A2E] transition-colors">STATS</Link>
          </nav>

          {/* Mobile Hamburger (Icon จำลอง) */}
          <div className="block md:hidden cursor-pointer space-y-1.5">
            <div className="w-8 h-1 bg-black rounded"></div>
            <div className="w-8 h-1 bg-black rounded"></div>
            <div className="w-8 h-1 bg-black rounded"></div>
          </div>
          
        </div>
      </header>
        <div className="m-8">
          {children}
        </div>
      </body>
    </html>
  );
}
