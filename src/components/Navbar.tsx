"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-[1px] bg-white/3 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
        <div className="flex justify-between items-center h-16">
          {/* Logo + Text */}
              <Link href="/">
          <div className="flex cursor-pointer justify-center items-center gap-2">
            <Image
              src="/logo.png" // your PNG in public folder
              alt="HiddenEcho Logo"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="font-bold translate-y-[2px] text-lg text-white">HiddenEcho</span>
          </div>
          </Link>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="mr-4 text-white">
                  Welcome, {user.username || user.email}{" "}
                </span>
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    {" "}
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      Dashboard
                    </Button>{" "}
                  </Link>{" "}
                  <Button
                    onClick={() => signOut()}
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
