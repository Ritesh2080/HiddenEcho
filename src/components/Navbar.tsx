"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

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
                src="/logo.png"
                alt="HiddenEcho Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-bold translate-y-[2px] text-lg text-white">
                HiddenEcho
              </span>
            </div>
          </Link>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <span className="mr-4 text-white">
                  Welcome, {user.username || user.email}
                </span>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="https://github.com/Ritesh2080">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    Github
                  </Button>
                </Link>
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="https://github.com/Ritesh2080">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    Github
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="flex md:hidden items-center gap-2">
            {session && (
              <span className="text-white text-sm">
                Welcome, {user.username || user.email}
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-[#111] text-white border-white/10">
                {session ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="https://github.com/Ritesh2080">Github</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="https://github.com/Ritesh2080">Github</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/sign-in">Login</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
