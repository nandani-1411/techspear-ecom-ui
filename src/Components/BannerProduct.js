import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllBanners } from "../features/bannerSlice"; 
import { toast } from "react-toastify";

const Banner = () => {
  const dispatch = useDispatch();
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await dispatch(getAllBanners()).unwrap();
        setBanners(data?.data || []);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchBanners();
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        banners.length > 0 ? (prevIndex + 1) % banners.length : 0
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [banners]);

  const nextBanner = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
    );
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextBanner();
    if (diff < -50) prevBanner();
    touchStartX.current = null;
  };

  if (banners.length === 0) return <div className="h-64 bg-gray-200 animate-pulse"></div>;

  return (
    <div
      className="relative w-full aspect-[16/9] bg-gray-900 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Container */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className="w-full h-full flex-shrink-0"
          >
            <img
              src={banner.img}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevBanner}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition z-10"
      >
        <FaArrowLeft size={18} />
      </button>
      <button
        onClick={nextBanner}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition z-10"
      >
        <FaArrowRight size={18} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-110" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
