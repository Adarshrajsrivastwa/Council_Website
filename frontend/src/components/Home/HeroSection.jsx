import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Users, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import assets from "../../data/assets.json";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const content = contentRef.current;

    // Video scale & move animation
    gsap.to(video, {
      scale: 0.8,
      y: -100,
      ease: "power1.out",
      scrollTrigger: {
        trigger: video,
        start: "top top",
        end: "bottom top",
        scrub: true, // smooth scroll effect
      },
    });

    // Content fade out and move up
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

  const handlePopupClick = () => {
    window.location.href = "/sih";
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {/* SIH Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                    initial={{ 
                      x: Math.random() * 400, 
                      y: Math.random() * 400,
                      scale: 0 
                    }}
                    animate={{ 
                      x: Math.random() * 400, 
                      y: Math.random() * 400,
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5
                    }}
                  />
                ))}
                
                {/* Geometric lines */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <motion.div
                  className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-transparent via-white/20 to-transparent"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: [0, 1, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </div>

              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10 hover:rotate-90 transform duration-300"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Popup Content */}
              <div className="text-center relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-white to-gray-300 text-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <motion.span 
                    className="text-2xl font-bold"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🚀
                  </motion.span>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-4"
                >
                  <motion.span
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="bg-gradient-to-r from-white via-gray-300 to-white bg-[length:200%_100%] bg-clip-text text-transparent"
                  >
                    Smart India Hackathon
                  </motion.span>
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 mb-6 leading-relaxed"
                >
                  Join us in India's biggest hackathon! Showcase your innovation and compete with the best minds in technology.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(255,255,255,0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePopupClick}
                  className="relative w-full bg-white text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:bg-gray-100 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      repeatDelay: 1
                    }}
                  />
                  <span className="relative z-10">Explore SIH →</span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={closePopup}
                  className="mt-3 text-gray-400 hover:text-white text-sm transition-colors relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.span
                    whileHover={{
                      x: [0, -2, 2, 0]
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Maybe later
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

        {/* Dark Overlay + Gradient */}
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90"></div>

        {/* Glass Card */}
        <div ref={contentRef} className="relative z-10 flex flex-col justify-center items-center h-full text-center px-2">
          <motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-white to-indigo-400 bg-clip-text text-transparent flex items-center justify-center gap-3"
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
                href="/join"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/90 hover:bg-white text-black font-bold transition-all duration-300"
              >
                <Users className="w-5 h-5" /> Join Student Council
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}