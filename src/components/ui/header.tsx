"use client";

import Link from "next/link";
import Logo from "./logo";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useState } from "react";

export default function Header() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Add your theme switching logic here if needed
  };

  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl  px-3 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">
          {/* Site branding */}
          <div className="flex items-center">
           
          </div>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/60"
          >
            {isDark ? (
              <IconSun className="h-5 w-5 text-gray-300" />
            ) : (
              <IconMoon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
