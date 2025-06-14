import React from "react";
import { Link } from "react-router-dom";
import { _HERO } from "../../../constants/landingPage";


export default function HeroSection() {
  return (
    <div
      className={`relative pt-20 min-h-screen flex items-center justify-center bg-cover bg-center bg-[url("${_HERO.bgImage}")]`}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-purple-300">
          {_HERO.subtitle}
        </h2>
        <h1
          className="text-4xl md:text-6xl font-bold mb-6"
          dangerouslySetInnerHTML={{ __html: _HERO.title }}
        />
        <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
          {_HERO.description}
        </p>
        <div className="flex gap-1 w-full gap-4 justify-center my-4">
        {
          _HERO.images.map((img, i) => (
            <div className="w-40 h-40 rounded-xl overflow-hidden transition-all duration-300 hover:rounded-r-2xl">
               <img
                src={img}
                key={i}
                alt={`image-${i}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 hover:rounded-r-2xl"
              />
            </div>
          ))
        }
        </div>
       
        <Link
          to={_HERO.ctaLink}
          className="inline-block bg-lime-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 mt-5"
        >
          EXPLORE
        </Link>
      </div>
    </div>
  );
} 