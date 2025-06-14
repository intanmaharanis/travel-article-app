import React from 'react'
import { Plane, Map, Heart } from "lucide-react";


export default function HeroCategory() {
  return (
    <div
        className="relative h-96 flex bg-linear-to-br from-lime-100 to-lime-200 items-center justify-center text-center">
        <div className="absolute top-20 left-20 opacity-20 transform -rotate-12">
        <Map size={75} className="text-400" />
      </div>
      <div className="absolute top-10 right-10 opacity-20 transform rotate-12">
        <Plane size={75} className="text-400" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 transform -rotate-12">
        <Heart size={75} className="text-400" />
      </div>
        <h1 className="text-5xl font-extrabold animate-fade-in-up text-teal-900">Explore Our Travel Categories</h1>
      </div>
  )
}
