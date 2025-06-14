import React from "react";

interface TravelStyleCardProps {
  style: {
    id: string;
    title: string;
    image: string;
    icon: React.ReactNode;
    bgColor: string;
  };
}

export default function TravelStyleCard({ style }: TravelStyleCardProps) {
  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-md group border border-gray-200">
      <img
        src={style.image}
        alt={style.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
        <h3 className="text-white text-xl font-bold z-10">{style.title}</h3>
      </div>
      
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 z-20"
        style={{ backgroundColor: style.bgColor }}
      >
        <div className="text-white text-3xl">{style.icon}</div>
      </div>
    </div>
  );
} 