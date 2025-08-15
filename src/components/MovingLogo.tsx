"use client";

import { useRef, useEffect } from "react";
import gsap from 'gsap';
import Image from "next/image";

export default function MovingLogo() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.x
      const y = e.y

      gsap.to(logoRef.current, {
        x,
        y, 
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    // This div is now centered on the screen. GSAP will move it from this central point.
    <div
      ref={logoRef}
      className="fixed z-50 pointer-events-none"
    >
      <Image
        src="/logo.png"
        alt="HiddenEcho Logo"
        width={30}
        height={30}
        priority
      />
    </div>
  );
}