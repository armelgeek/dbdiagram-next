

import React from "react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Welcome to Boutik!",
  subtitle = "Discover our amazing products and offers.",
  ctaText = "Shop Now",
  ctaHref = "/",
  className = "",
}) => {
  return (
    <section
      className={`w-full bg-gradient-to-br from-gray-50 to-white py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-8 ${className}`}
    >
      <div className="flex-1 flex flex-col items-start max-w-xl px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          {subtitle}
        </p>
        <a
          href={ctaHref}
          className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-800 transition"
        >
          {ctaText}
        </a>
      </div>
      <div className="flex-1 flex items-center justify-center">
        
      </div>
    </section>
  );

};

export default Hero;

