"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    src: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
    title: "Cetak Brosur Kilat",
    desc: "Diskon Hingga 50% Khusus Hari Ini",
  },
  {
    id: 2,
    src: "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
    title: "Kartu Nama Mewah",
    desc: "Bikin Bisnis Kamu Terlihat Profesional",
  },
  {
    id: 3,
    src: "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
    title: "Spanduk & Banner",
    desc: "Cetak Cepat Harga Bersahabat",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="relative w-full px-4 md:px-10 lg:px-20 mb-10 group">
      <div className="relative overflow-hidden rounded-3xl h-[200px] md:h-[400px] shadow-xl bg-base-300">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={slide.id === 1}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex flex-col justify-center p-8 md:p-20 text-white">
                <h2 className="text-2xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-xl opacity-90 drop-shadow-md max-w-md">
                  {slide.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 transition-all duration-300 rounded-full bg-white ${
                current === i ? "w-10" : "w-2.5 opacity-50 hover:opacity-80"
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 -left-1 md:left-4 lg:left-14 -translate-y-1/2 btn btn-circle btn-primary shadow-2xl border-none text-white z-5 hover:scale-110 transition-transform active:scale-95"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 -right-1 md:right-4 lg:right-14 -translate-y-1/2 btn btn-circle btn-primary shadow-2xl border-none text-white z-5 hover:scale-110 transition-transform active:scale-95"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}