// *********************
// Role of the component: Footer component
// Name of the component: Footer.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <Footer />
// Input parameters: no input parameters
// Output: Footer component
// *********************

import { navigation } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[color:var(--footer-dark,#373737)] text-white" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-8 h-[160px] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-extrabold tracking-wide mb-1">
          <span className="text-white">Technology</span> <span className="text-[color:var(--brand-blue,#1E396E)]">Zone</span>
        </h2>
        <p className="text-sm text-gray-300">© {new Date().getFullYear()} Technology Zone. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
