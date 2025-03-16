import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay,  } from "react-icons/fi";
import { Edit_foto } from "@/icons";
import { VideoProps } from "./index.model";

const VideoPlay: React.FC<VideoProps> = ({ src, setOnPlay, onVideoChange, isAdmin,  }) => {
  const [thisOnPause, setThisOnPause] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setThisOnPause(false);
      setIsPlaying(false);
      setOnPlay(false);
      setTimeout(() => {
        videoRef.current?.load();
      }, 1000);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newVideoURL = URL.createObjectURL(event.target.files[0]);
      onVideoChange(newVideoURL);
    }
  };

  return (
    <div className="relative w-full h-[583px] mx-auto">
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

      {/* Edit Icon (Visible Only for Admin) */}
      {isAdmin && (
        <AnimatePresence>
          <motion.label
            className="absolute top-4 right-4 bg-primary-500 p-2 rounded-full shadow-lg hover:bg-primary-700 transition cursor-pointer z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit_foto className="w-6 h-6 text-white" />
            <input
              type="file"
              accept="video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </motion.label>
        </AnimatePresence>
      )}

      {/* Overlay Play Button */}
      <AnimatePresence>
        {!isPlaying && !thisOnPause ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg cursor-pointer z-40"
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
              <FiPlay color="black" className="w-5 h-5" />
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlay;