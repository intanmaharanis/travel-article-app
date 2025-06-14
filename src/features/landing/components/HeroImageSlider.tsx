import React from "react";
import Marquee from "react-fast-marquee";

interface HeroImageSliderProps {
  images: string[];
}

export default function HeroImageSlider({
  images,
}: HeroImageSliderProps) {
  const row1 = images.slice(0, 8);
  const row2 = images.slice(4, 8);

  

  return (
    <div className="flex w-full md:w-5/12 h-screen overflow-hidden">
    {/* Kolom kiri - Marquee scroll down */}
    <Marquee speed={40} gradient={false}  direction="up" className="overflow-hidden flex flex-col gap-4 h-full">
            {images.map((img, i) => (
                <img
                key={i}
                  src={img}
                  alt={`Marquee Image ${i + 1}`}
                  className="w-40 h-40 overflow-hidden object-cover"
                />
            ))}
        </Marquee>
  
  </div>
  

  );
} 