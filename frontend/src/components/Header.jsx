import React, { useState, useEffect } from "react";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import useHideOnScroll from "../hooks/useHideOnScroll";
import assets from "../data/assets.json";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const showNav = useHideOnScroll(5);
  const navigate = useNavigate();

  const links = [
    { name: "Home", href: "/" },
    { name: "Clubs", href: "/clubs" },
    { name: "Mentors", href: "/mentors" },
    { name: "Team", href: "/team" },
    // { name: "Gallery", href: "/gallery" },
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) setMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex justify-between items-center 
        h-[12vh] px-6 lg:px-12 uppercase
        bg-gradient-to-r from-black/80 via-gray-900/70 to-black/80 backdrop-blur-xl text-white border-b border-white/20
        shadow-2xl shadow-black/30
        transition-all duration-700 ease-in-out z-50
        ${showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        {/* Logo */}
        <div 
          className="flex items-center gap-3 sm:gap-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/clublogo/Student_council_vjzt0j.png"
            alt="Council Logo"
            className="h-12 sm:h-14 w-auto object-contain hover:scale-110 transition-transform duration-300"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide text-red-500 uppercase">
            Student Council
          </h1>
        </div>

        {/* Desktop Links */}
        {isDesktop && (
          <ul className="flex items-center gap-8 lg:gap-12 font-medium text-gray-200 text-base lg:text-lg">
            {links.map((link) => (
              <li key={link.name} className="relative group">
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `transition-colors duration-300 text-xl relative px-1 ${
                      isActive
                        ? "text-red-500 text-2xl font-bold"
                        : "hover:text-red-400"
                    }`
                  }
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        {/* Mobile Menu Button */}
        {!isDesktop && (
          <button
            className="text-3xl sm:text-4xl focus:outline-none hover:text-red-500 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <RiCloseLine /> : <RiMenuLine />}
          </button>
        )}
      </nav>

      {/* Mobile Sidebar */}
      {!isDesktop && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
              menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div
            className={`fixed top-0 right-0 h-full w-4/5 sm:w-2/3 md:w-1/2 bg-gradient-to-b from-gray-900/95 via-black/90 to-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 z-50 uppercase
            transform transition-transform duration-500 ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col items-center mt-24 gap-6 text-base sm:text-lg font-medium text-gray-200">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `transition-colors duration-300 ${
                      isActive ? "text-red-500 font-semibold" : "hover:text-red-400"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
