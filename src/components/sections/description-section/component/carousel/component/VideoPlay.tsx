import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiPause } from "react-icons/fi";
import { VideoProps } from "./index.model";

const VideoPlay: React.FC<VideoProps> = ({ src, setOnPlay }) => {
  const [thisOnPause, setThisOnPause] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setThisOnPause(false);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setThisOnPause(true);
      setIsPlaying(false);
    }
  }

  const handleEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setThisOnPause(false);
      setIsPlaying(false);
      setOnPlay(false)
      setTimeout(() => {
        videoRef.current?.load();
      }, 1000);
    }
  }

  return (
    <div className="relative min-w-full h-[583px] mx-auto">
      {/* Video */}
      <motion.video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        src={src}
        onClick={handlePause}
        onPlay={() => setOnPlay(true)}
        onPause={() => setOnPlay(false)}
        muted
        onEnded={handleEnded}
      />


      {/* Overlay Play Button */}
      <AnimatePresence>
        {!isPlaying && !thisOnPause ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              onClick={handlePlay}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/80 p-4 rounded-full shadow-lg w-fit h-fit"
            >
              <FiPlay color="black" className="w-5 h-5"/>
            </motion.button>
          </motion.div>
        ) : null}
        {thisOnPause && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              onClick={handlePlay}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/80 p-4 rounded-full shadow-lg"
            >
              <FiPause color="black" className="w-5 h-5"/>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlay;
