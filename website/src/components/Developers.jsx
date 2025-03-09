import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Import Autoplay module
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay"; // Import Autoplay CSS
import Mechanshil from "../assets/Mechanshil.jpg";

const Developers = () => {
  // Create refs for the custom arrows
  const nextArrowRef = useRef(null);
  const prevArrowRef = useRef(null);
  const swiperRef = useRef(null); // Ref for Swiper instance

  // Developer data for the carousel
  const developers = [
    {
      id: 1,
      name: "Khuraijam Gunindro",
      role: "Smart Contract Developer",
      image:
        "https://plus.unsplash.com/premium_photo-1682095404705-f0ffdc30afb0?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual image URL
      description: "I create badass smart contracts🔥",
    },
    {
      id: 2,
      name: "Chanyahor A Shimray",
      role: "Business & Marketing Strategist",
      image:
        "https://plus.unsplash.com/premium_photo-1682095227569-31a7cd3d31b5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual image URL
      description: "Everything is in my palm😎",
    },
    {
      id: 3,
      name: "Khulpu Mechanshil Maring",
      role: "Web3 context & UI/UX developer",
      image: Mechanshil, // Replace with actual image URL
      description: "Simplicity is the best style🙂",
    },
    {
      id: 4,
      name: "Muidou Kanshouwa",
      role: "Researcher and Documentation Specialist",
      image:
        "https://plus.unsplash.com/premium_photo-1682095227569-31a7cd3d31b5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual image URL
      description: "Everything is found with research🧐",
    },
  ];

  // Initialize Swiper after component mounts
  useEffect(() => {
    if (swiperRef.current) {
      // Manually link the refs to Swiper navigation
      swiperRef.current.params.navigation.nextEl = nextArrowRef.current;
      swiperRef.current.params.navigation.prevEl = prevArrowRef.current;
      swiperRef.current.navigation.init(); // Initialize navigation
      swiperRef.current.navigation.update(); // Update navigation
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-16 relative">
      <Swiper
        modules={[Navigation, Autoplay]} // Add Autoplay module
        navigation={{
          nextEl: nextArrowRef.current, // Link to the next arrow ref
          prevEl: prevArrowRef.current, // Link to the prev arrow ref
        }}
        autoplay={{
          delay: 4000, // Auto-slide every 4 seconds
          disableOnInteraction: false, // Continue autoplay even after user interaction
        }}
        speed={1200} // Slower slide transition (1200ms)
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper; // Store Swiper instance in ref
        }}
      >
        {developers.map((developer) => (
          <SwiperSlide key={developer.id}>
            <div className="flex flex-col items-center text-center">
              <img
                src={developer.image}
                alt={developer.name}
                className="w-28 h-28 md:w-48 md:h-48 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl md:text-3xl font-bold text-white">
                {developer.name}
              </h3>
              <p className="text-sm md:text-lg text-gray-600 dark:text-white">
                {developer.role}
              </p>
              <p className="text-sm md:text-base italic text-gray-500 dark:text-gray-400 mt-5">
                "{developer.description}"
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <div
        ref={nextArrowRef}
        className="custom-next absolute top-1/2 right-2 sm:right-0 transform -translate-y-1/2 z-10 cursor-pointer bg-white/80 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
      <div
        ref={prevArrowRef}
        className="custom-prev absolute top-1/2 left-2 sm:left-0 transform -translate-y-1/2 z-10 cursor-pointer bg-white/80 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default Developers;
