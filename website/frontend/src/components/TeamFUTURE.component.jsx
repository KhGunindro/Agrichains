import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion"; // Import motion
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Mechanshil from "../assets/Mechanshil.jpg";
import Muidou from "../assets/Muidou.jpeg";
import Chand from "../assets/chand.jpg";
import Gunindro from "../assets/Gunindro.jpg";

const Developers = () => {
  const nextArrowRef = useRef(null);
  const prevArrowRef = useRef(null);
  const swiperRef = useRef(null);

  const developers = [
    {
      id: 1,
      name: "Chanyahor A Shimray",
      role: "Team Leader, Future",
      image: Chand,
      description: "Who's the boss here?😎",
    },
    {
      id: 2,
      name: "Khuraijam Gunindro",
      role: "Smart Contract Developer",
      image: Gunindro,
      description: "Not everyone can be smart!🔥",
    },
    {
      id: 3,
      name: "Khulpu Mechanshil Maring",
      role: "FullStack developer",
      image: Mechanshil,
      description: "Simplicity is the best style!🙂",
    },
    {
      id: 4,
      name: "Muidou Kanshouwa",
      role: "Researcher and Business Strategist",
      image: Muidou,
      description: "Everything is found with research!🧐",
    },
  ];

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.navigation.nextEl = nextArrowRef.current;
      swiperRef.current.params.navigation.prevEl = prevArrowRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-16 relative">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          nextEl: nextArrowRef.current,
          prevEl: prevArrowRef.current,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          bulletClass: "custom-bullet",
          bulletActiveClass: "custom-bullet-active",
        }}
        speed={1200}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {developers.map((developer) => (
          <SwiperSlide key={developer.id}>
            <div className="flex flex-col items-center text-center pt-2">
              {/* Developer Image with Framer Motion */}
              <motion.img
                src={developer.image}
                alt={developer.name}
                className="w-28 h-28 md:w-48 md:h-48 rounded-full object-cover mb-4 border-4 border-white/20 hover:border-green-500 transition-all duration-300"
                whileHover={{ scale: 1.05 }} // Subtle hover animation
              />
              {/* Name */}
              <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {developer.name}
              </h3>
              {/* Role */}
              <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400">
                {developer.role}
              </p>
              {/* Description */}
              <p className="text-sm md:text-base italic text-gray-600 dark:text-gray-400 mt-5 max-w-2xl">
                "{developer.description}"
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <div
        ref={nextArrowRef}
        className="custom-next absolute top-1/2 right-2 sm:right-0 transform -translate-y-1/2 z-10 cursor-pointer bg-white/80 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
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
        className="custom-prev absolute top-1/2 left-2 sm:left-0 transform -translate-y-1/2 z-10 cursor-pointer bg-white/80 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
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

      {/* Custom Pagination Dots */}
      <div className="custom-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10"></div>
    </div>
  );
};

export default Developers;
