"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Maximize, Minimize, Pause, Play, Volume, VolumeX } from "lucide-react";
import { motion, useInView } from "framer-motion";

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function HowItWork() {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Format time (seconds to MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setShowThumbnail(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false;
        setVolume(0.5); // Set to default volume when unmuting
      } else {
        videoRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume > 0) {
        videoRef.current.muted = false;
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle time updates
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current?.currentTime || 0);
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current?.duration || 0);
  };

  // Handle seeking
  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  // Handle clicking outside volume slider
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        volumeSliderRef.current &&
        !volumeSliderRef.current.contains(event.target) &&
        !event.target.closest(".volume-button")
      ) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Initialize volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      className="bg-[#fff] container mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="px-5 md:px-10 lg:px-20 2xl:px-8 my-[100px]">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          variants={containerVariants}
        >
          <motion.div
            className="space-y-6 rounded-[16px] shadow-[0px_0px_12px_3px_#00000012] p-6"
            variants={itemVariants}
          >
            <h2 className="text-[36px] font-bold text-center md:text-start">How it Works</h2>
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start mt-[24px]"
              variants={containerVariants}
            >
              <motion.div
                className="space-y-5 text-center h-[250px] max-w-[80%] mx-auto md:max-w-[180px] w-auto flex flex-col justify-center items-center"
                variants={itemVariants}
              >
                <Image
                  src="/assets/workIcon1.png"
                  alt=""
                  width={200}
                  height={200}
                  className="w-auto h-[120px]"
                />
                <h5 className="font-bold text-[18px]">Connect</h5>
                <p>Buyers and exporters join KingMansa for verified trade</p>
              </motion.div>
              <motion.div
                className="py-10 md:py-20 w-full md:w-auto flex justify-center"
                variants={itemVariants}
              >
                <Image
                  src="/assets/arrow1.png"
                  alt=""
                  width={200}
                  height={200}
                  className="w-[50px] h-auto rotate-90 md:rotate-0"
                />
              </motion.div>
              <motion.div
                className="space-y-5 text-center h-[250px] max-w-[80%] mx-auto md:max-w-[180px] w-auto flex flex-col justify-center items-center"
                variants={itemVariants}
              >
                <Image
                  src="/assets/workIcon1.png"
                  alt=""
                  width={200}
                  height={200}
                  className="w-auto h-[120px]"
                />
                <h5 className="font-bold text-[18px]">Connect</h5>
                <p>Buyers and exporters join KingMansa for verified trade</p>
              </motion.div>
              <motion.div
                className="py-20 w-full md:w-auto flex justify-center"
                variants={itemVariants}
              >
                <Image
                  src="/assets/arrow2.png"
                  alt=""
                  width={200}
                  height={200}
                  className="w-[50px] h-auto rotate-90 md:rotate-0"
                />
              </motion.div>
              <motion.div
                className="space-y-5 text-center h-[250px] max-w-[80%] mx-auto md:max-w-[180px] w-auto flex flex-col justify-center items-center"
                variants={itemVariants}
              >
                <Image
                  src="/assets/workIcon1.png"
                  alt=""
                  width={200}
                  height={200}
                  className="w-auto h-[120px]"
                />
                <h5 className="font-bold text-[18px]">Connect</h5>
                <p>Buyers and exporters join KingMansa for verified trade</p>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            className="rounded-[16px] shadow-[0px_0px_12px_3px_#00000012] relative"
            variants={itemVariants}
          >
            {/* Video Player */}
            <div
              ref={videoContainerRef}
              className="relative w-full h-full aspect-video bg-stone-900 rounded-lg overflow-hidden"
            >
              {/* Video Thumbnail (shown when video is paused) */}
              {showThumbnail && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Image
                    src="/assets/thumb.png"
                    alt="Video thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-70"
                  />
                  <button
                    onClick={togglePlay}
                    className="relative z-20 w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 text-stone-800 ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                poster="/assets/thumb.png"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                <source
                  src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress bar */}
                <div
                  className="w-full h-1 bg-gray-600 rounded-full mb-2 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {/* Play/Pause button */}
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-gray-300 transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause /> : <Play />}
                    </button>

                    {/* Volume controls */}
                    <div className="relative flex">
                      <button
                        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                        className="volume-button text-white hover:text-gray-300 transition-colors cursor-pointer"
                      >
                        {isMuted ? <VolumeX /> : <Volume />}
                      </button>
                      {showVolumeSlider && (
                        <div
                          ref={volumeSliderRef}
                          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-3 rounded-lg"
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24 h-1 accent-blue-500 cursor-pointer"
                            style={{
                              transform: "rotate(-90deg)",
                              height: "24px",
                              width: "80px",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Time display */}
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Fullscreen button */}
                    <button
                      onClick={toggleFullscreen}
                      className="text-white hover:text-gray-300 transition-colors cursor-pointer"
                    >
                      {isFullscreen ? (
                        <Minimize className="size-5 cursor-pointer" />
                      ) : (
                        <Maximize className="size-5 cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
