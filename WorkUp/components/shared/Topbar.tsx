// components/shared/Topbar.tsx
"use client"; // This component now needs client-side interactivity

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react'; // Icons for the hamburger menu

import { ModeToggle } from '../../app/page'; // Assuming this path is correct
import { Button } from '../ui/button'; // Assuming you have a Button component from shadcn/ui

const Topbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-semibold text-primary hover:opacity-80">
            WorkUp
          </Link>
          <nav className="hidden md:flex gap-4 text-sm">
            <Link href="/home/job-list" className="hover:underline">
              Job Listings
            </Link>
            <Link href="/home/post-jobs" className="hover:underline">
              Post a Job
            </Link>
            <Link href="/home/saved-jobs" className="hover:underline">
              My Jobs
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Topbar;