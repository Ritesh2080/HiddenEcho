"use client";

import { useState, useEffect } from "react";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 w-full z-45 backdrop-blur-[1px] bg-white/3 border-t border-white/5 text-center p-4 md:p-6 text-white">
      © {currentYear} HiddenEcho. All rights reserved.
    </footer>
  );
};

export default Footer;