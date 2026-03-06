"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/event-styling", label: "Event Styling" },
  { href: "/gallery", label: "Gallery" },
  { href: "/shop", label: "Shop" },
  { href: "/balloon-order", label: "Balloon Order" },
  { href: "/visit", label: "Visit Us" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-cream/60 bg-brand-offwhite/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-9xl items-center justify-between gap-6 px-6 py-4 md:py-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2 rounded"
          aria-label="Party Barn – Home"
        >
          <Image
            src="/images/gallery/party-barn-logo-black.webp"
            alt="Party Barn"
            width={140}
            height={44}
            className="h-9 w-auto md:h-10"
            priority
          />
        </Link>

        <nav
          className={`absolute left-0 right-0 top-full border-t border-brand-cream/60 bg-brand-offwhite md:static md:border-0 md:bg-transparent ${
            menuOpen ? "block" : "hidden md:block"
          }`}
          aria-label="Main navigation"
        >
          <ul className="flex flex-col gap-0 md:flex-row md:gap-8 lg:gap-10">
            {navLinks.map(({ href, label }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-6 py-4 text-sm font-medium md:px-0 md:py-0 md:text-[15px] ${
                      isActive
                        ? "text-brand-copper"
                        : "text-brand-ink hover:text-brand-copper transition-colors"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded md:hidden focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span className="sr-only">{menuOpen ? "Close" : "Open"} menu</span>
          <svg
            className="h-6 w-6 text-brand-ink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
