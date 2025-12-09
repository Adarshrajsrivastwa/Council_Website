import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Compass, Users } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import assets from "../../data/assets.json";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const videoRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const content = contentRef.current;

    gsap.to(video, {
      scale: 0.8,
      y: -100,
      ease: "power1.out",
      scrollTrigger: {
        trigger: video,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(content, {
      y: -80,
      opacity: 0.3,
      ease: "power1.out",
      scrollTrigger: {
        trigger: content,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden font-sans">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={assets.videos.homeHero} type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90"></div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-center items-center h-full text-center px-2"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-white to-indigo-400 bg-clip-text text-transparent"
        >
          STUDENT COUNCIL
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-lg md:text-2xl mt-4 text-gray-200 font-medium tracking-wide"
        >
          Empowering <span className="text-indigo-400 font-semibold">Students</span> • Building{" "}
          <span className="text-indigo-400 font-semibold">Leaders</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-10 flex flex-wrap gap-6 justify-center"
        >
          <motion.a
            href="/sih"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow-lg transition-all duration-300"
          >
            <Compass className="w-5 h-5" /> Explore SIH
          </motion.a>

          <motion.a
            href="#"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/90 hover:bg-white text-black font-bold transition-all duration-300"
          >
            <Users className="w-5 h-5" /> Join Student Council
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
