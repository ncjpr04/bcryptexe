import Link from "next/link";
import Logo from "@/components/ui/logo";
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 py-8 md:grid-cols-12 md:py-12">
          {/* Logo */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="mb-2">
              <Logo />
            </div>
            <div className="text-sm text-indigo-200/65">
              Empowering businesses with innovative solutions for sustainable growth and success.
            </div>
          </div>

          {/* Services links */}
          <div className="md:col-span-4 lg:col-span-3">
            <h6 className="mb-3 font-medium text-gray-200">Services</h6>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-indigo-200/65 transition hover:text-indigo-200">
                  Business Solutions
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-indigo-200/65 transition hover:text-indigo-200">
                  Tech and IT
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-indigo-200/65 transition hover:text-indigo-200">
                  Marketing and Branding
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-indigo-200/65 transition hover:text-indigo-200">
                  Finance and Accounting
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div className="md:col-span-4 lg:col-span-2">
            <h6 className="mb-3 font-medium text-gray-200">Company</h6>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-indigo-200/65 transition hover:text-indigo-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-indigo-200/65 transition hover:text-indigo-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="md:col-span-4 lg:col-span-4">
            <h6 className="mb-3 font-medium text-gray-200">Contact</h6>
            <ul className="space-y-2 text-sm">
              <li className="text-indigo-200/65">
                <strong className="font-medium text-indigo-200">Address:</strong><br />
                Sunshine Apartments, Patrakar Colony,<br />
                Mansarovar, Jaipur,<br />
                Rajasthan 302020
              </li>
              <li className="text-indigo-200/65">
                <strong className="font-medium text-indigo-200">Phone:</strong><br />
                +91 141 411 7961
              </li>
              <li className="text-indigo-200/65">
                <strong className="font-medium text-indigo-200">Email:</strong><br />
                <a href="mailto:example@gmail.com" className="hover:text-indigo-200">
                  example@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom area */}
        <div className="border-t border-gray-800/60 py-4 md:flex md:items-center md:justify-between">
          {/* Social links */}
          <ul className="mb-4 flex md:order-1 md:mb-0 md:ml-4">
            <li className="ml-4">
              <a
                className="flex items-center justify-center rounded-full bg-gray-800/60 text-indigo-200/65 transition hover:bg-gray-800 hover:text-indigo-200"
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">Twitter</span>
                <IconBrandX className="h-8 w-8 p-2" />
              </a>
            </li>
            <li className="ml-4">
              <a
                className="flex items-center justify-center rounded-full bg-gray-800/60 text-indigo-200/65 transition hover:bg-gray-800 hover:text-indigo-200"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">Instagram</span>
                <IconBrandInstagram className="h-8 w-8 p-2" />
              </a>
            </li>
            <li className="ml-4">
              <a
                className="flex items-center justify-center rounded-full bg-gray-800/60 text-indigo-200/65 transition hover:bg-gray-800 hover:text-indigo-200"
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">LinkedIn</span>
                <IconBrandLinkedin className="h-8 w-8 p-2" />
              </a>
            </li>
            <li className="ml-4">
              <a
                className="flex items-center justify-center rounded-full bg-gray-800/60 text-indigo-200/65 transition hover:bg-gray-800 hover:text-indigo-200"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <IconBrandFacebook className="h-8 w-8 p-2" />
              </a>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="mr-4 text-sm text-indigo-200/65">
            &copy; {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
