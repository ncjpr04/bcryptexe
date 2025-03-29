"use client";

import { useState } from "react";
import useMasonry from "../lib/useMasonry";
import Image, { StaticImageData } from "next/image";
import TestimonialImg01 from "../../public/images/testimonial-01.jpg";
import TestimonialImg02 from "../../public/images/testimonial-02.jpg";
import TestimonialImg03 from "../../public/images/testimonial-03.jpg";
import TestimonialImg04 from "../../public/images/testimonial-04.jpg";
import TestimonialImg05 from "../../public/images/testimonial-05.jpg";
import TestimonialImg06 from "../../public/images/testimonial-06.jpg";
import TestimonialImg07 from "../../public/images/testimonial-07.jpg";
import TestimonialImg08 from "../../public/images/testimonial-08.jpg";
import TestimonialImg09 from "../../public/images/testimonial-09.jpg";

interface TestimonialType {
  img: StaticImageData;
  name: string;
  location: string;
  achievement: string;
  content: string;
  categories: number[];
}

const testimonials: TestimonialType[] = [
  {
    img: TestimonialImg01,
    name: "Alex Chen",
    location: "Singapore",
    achievement: "Lost 15kg in 6 months",
    content: "The crypto rewards kept me motivated! I've earned over $500 worth of tokens while achieving my fitness goals. The community challenges are amazing!",
    categories: [1, 2, 4],
  },
  {
    img: TestimonialImg02,
    name: "Sarah Williams",
    location: "London",
    achievement: "Marathon Runner",
    content: "Being able to stake my earnings from daily runs has been incredible. The passive income from staking makes every workout more rewarding.",
    categories: [1, 3, 5],
  },
  {
    img: TestimonialImg03,
    name: "Raj Patel",
    location: "Mumbai",
    achievement: "Fitness Influencer",
    content: "The social features have helped me build a strong community. My followers love tracking our group challenges and earning rewards together!",
    categories: [1, 2, 4],
  },
  {
    img: TestimonialImg04,
    name: "Emma Thompson",
    location: "Sydney",
    achievement: "CrossFit Enthusiast",
    content: "The NFT badges I've earned for completing challenges are awesome! They're not just tokens - they're proof of my fitness journey.",
    categories: [1, 3, 5],
  },
  {
    img: TestimonialImg05,
    name: "Michael Kim",
    location: "Seoul",
    achievement: "Yoga Instructor",
    content: "Integrating Web3 with wellness is genius! My students love earning tokens while improving their practice. It's revolutionized my classes.",
    categories: [1, 2, 4],
  },
  {
    img: TestimonialImg06,
    name: "Lisa Rodriguez",
    location: "Barcelona",
    achievement: "Weight Training Pro",
    content: "The smart tracking is spot-on! Every rep counts towards rewards, and the community validation makes it completely fair and transparent.",
    categories: [1, 2, 5],
  },
  {
    img: TestimonialImg07,
    name: "David Chen",
    location: "Vancouver",
    achievement: "Cycling Champion",
    content: "From casual rides to competitions, every activity is rewarded. The token economics really encourage consistent exercise habits.",
    categories: [1, 3, 4],
  },
  {
    img: TestimonialImg08,
    name: "Anna Kowalski",
    location: "Warsaw",
    achievement: "Fitness Newcomer",
    content: "As a beginner, the reward system gave me extra motivation. Earning while getting healthy is the perfect combination!",
    categories: [1, 3, 5],
  },
  {
    img: TestimonialImg09,
    name: "James Wilson",
    location: "New York",
    achievement: "Gym Owner",
    content: "Implementing this at my gym has increased member engagement by 300%. The Web3 rewards system is a game-changer for fitness businesses.",
    categories: [1, 2, 4],
  },
];

export default function Testimonials() {
  const masonryContainer = useMasonry();
  const [category, setCategory] = useState<number>(1);

  return (
    <section className="relative">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 opacity-90"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(120,53,234,0.1),transparent_50%)]"></div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6" data-aos="fade-up">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center" data-aos="fade-up">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Community Success Stories
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,#f5f5f5,#a5b4fc,#f8fafc,#818cf8,#f5f5f5)] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Real People, Real Results
            </h2>
            <p className="text-lg text-indigo-200/80">
              See how our community is transforming fitness with Web3 rewards
            </p>
          </div>

          <div>
            {/* Category buttons */}
            <div className="flex justify-center pb-12 max-md:hidden md:pb-16" data-aos="fade-up" data-aos-delay="200">
              <div className="relative inline-flex flex-wrap justify-center rounded-[1.25rem] bg-gray-800/40 p-1">
                <button
                  className={`flex h-8 flex-1 items-center gap-2.5 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-indigo-200 ${category === 1 ? "relative bg-linear-to-b from-gray-900 via-gray-800/60 to-gray-900 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-indigo-500/0),--theme(--color-indigo-500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]" : "opacity-65 transition-opacity hover:opacity-90"}`}
                  aria-pressed={category === 1}
                  onClick={() => setCategory(1)}
                >
                  <span>All Stories</span>
                </button>
                <button
                  className={`flex h-8 flex-1 items-center gap-2.5 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-indigo-200 ${category === 2 ? "relative bg-linear-to-b from-gray-900 via-gray-800/60 to-gray-900 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-indigo-500/0),--theme(--color-indigo-500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]" : "opacity-65 transition-opacity hover:opacity-90"}`}
                  aria-pressed={category === 2}
                  onClick={() => setCategory(2)}
                >
                  <span>Weight Loss</span>
                </button>
                <button
                  className={`flex h-8 flex-1 items-center gap-2.5 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-indigo-200 ${category === 3 ? "relative bg-linear-to-b from-gray-900 via-gray-800/60 to-gray-900 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-indigo-500/0),--theme(--color-indigo-500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]" : "opacity-65 transition-opacity hover:opacity-90"}`}
                  aria-pressed={category === 3}
                  onClick={() => setCategory(3)}
                >
                  <span>Cardio</span>
                </button>
                <button
                  className={`flex h-8 flex-1 items-center gap-2.5 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-indigo-200 ${category === 4 ? "relative bg-linear-to-b from-gray-900 via-gray-800/60 to-gray-900 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-indigo-500/0),--theme(--color-indigo-500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]" : "opacity-65 transition-opacity hover:opacity-90"}`}
                  aria-pressed={category === 4}
                  onClick={() => setCategory(4)}
                >
                  <span>Strength</span>
                </button>
                <button
                  className={`flex h-8 flex-1 items-center gap-2.5 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-indigo-200 ${category === 5 ? "relative bg-linear-to-b from-gray-900 via-gray-800/60 to-gray-900 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-indigo-500/0),--theme(--color-indigo-500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]" : "opacity-65 transition-opacity hover:opacity-90"}`}
                  aria-pressed={category === 5}
                  onClick={() => setCategory(5)}
                >
                  <span>Wellness</span>
                </button>
              </div>
            </div>

            {/* Updated grid layout with consistent gap */}
            <div
              className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-8"
              ref={masonryContainer}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="group" 
                  data-aos="fade-up" 
                  data-aos-delay={300 + (index * 100)}
                >
                  <TestimonialCard testimonial={testimonial} category={category} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: TestimonialType;
  category: number;
}

function TestimonialCard({ testimonial, category }: TestimonialCardProps) {
  return (
    <div
      className={`relative rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-5 backdrop-blur-xs transition-opacity before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] ${!testimonial.categories.includes(category) ? "opacity-10" : ""}`}
    >
      <div className="flex flex-col gap-4">
        <p className="text-indigo-200/80">
          &quot;{testimonial.content}&quot;
        </p>
        <div className="flex items-center gap-3">
          <Image
            className="inline-flex shrink-0 rounded-full"
            src={testimonial.img}
            width={36}
            height={36}
            alt={testimonial.name}
          />
          <div className="text-sm font-medium">
            <span className="text-gray-200">{testimonial.name}</span>
            <span className="text-gray-700"> - </span>
            <span className="text-indigo-200/80">{testimonial.achievement}</span>
            <div className="text-indigo-200/80">
              {testimonial.location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
