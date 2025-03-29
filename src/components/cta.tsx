import Image from "next/image";
import BlurredShape from "../../public/images/blurred-shape.svg";
import { IconRocket, IconLogin } from "@tabler/icons-react";

export default function Cta() {
  return (
    <section className="relative overflow-hidden" data-aos="fade-up">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 opacity-90"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(120,53,234,0.1),transparent_50%)]"></div>
      
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="bg-linear-to-r from-transparent via-gray-800/50 py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,#f5f5f5,#a5b4fc,#f8fafc,#818cf8,#f5f5f5)] bg-[length:200%_auto] bg-clip-text pb-8 font-nacelle text-3xl font-semibold text-transparent md:text-4xl"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Start Your Web3 Fitness Journey Today
            </h2>
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
      </div>
    </section>
  );
}
