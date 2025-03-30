"use client";

import heroImage from "../../public/images/heroImage.jpeg";
// import ModalVideo from "../components/modal-video";
import Image from "next/image";
import Logo from "../components/ui/logo";
import { IconRocket, IconLogin } from "@tabler/icons-react";
// import { useState } from "react";

export default function HeroHome() {
  return (
    <section className="relative" data-aos="fade-up">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 opacity-90"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(120,53,234,0.1),transparent_50%)]"></div>
      
      {/* Logo container */}
      <div className="absolute inset-x-0 top-5 sm:top-10 z-20 px-4 sm:px-10">
        <div className="flex items-center justify-between">
          {/* Bigger Logo - smaller on mobile */}
          <div className="scale-110 sm:scale-150 origin-left">
            <Logo />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-20 sm:pt-24 md:pt-28 pb-12 md:pb-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="line-clamp-2 animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,#f5f5f5,#a5b4fc,#f8fafc,#818cf8,#f5f5f5)] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-3xl sm:text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
              Transform Your Fitness Journey <br className="lg:block hidden" /> with Web3 Technology
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-indigo-200/80"
                data-aos="fade-up"
                data-aos-delay={200}
              >
               Earn crypto rewards while achieving your fitness goals. Track progress, join challenges, and build a healthier you.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center gap-4">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn group relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-3.5 font-medium text-white shadow-xl transition-all duration-300 ease-out hover:from-indigo-500 hover:to-indigo-700 hover:shadow-indigo-500/25 focus:outline-none mb-4 sm:mb-0"
                    href="/signup"
                  >
                    <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white/20 opacity-30 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                    <IconRocket className="mr-2 h-5 w-5" />
                    <span>Get Started</span>
                  </a>
                </div>
                <div data-aos="fade-up" data-aos-delay={600}>
                  <a
                    className="btn group relative inline-flex items-center overflow-hidden rounded-full bg-gray-800/80 px-7 py-3.5 font-medium text-gray-100 transition-all duration-300 ease-out hover:bg-gray-800 focus:outline-none border border-gray-700/50 backdrop-blur-sm"
                    href="/signin"
                  >
                    <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white/10 opacity-30 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                    <IconLogin className="mr-2 h-5 w-5" />
                    <span>Sign In</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
            <Image 
              src={heroImage} 
              alt="Fitness Tracking Dashboard" 
              priority 
              className="relative rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-800/50" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
