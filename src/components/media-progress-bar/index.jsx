import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function MediaProgressbar({ isMediaUploading, progress }) {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
      setAnimatedProgress(progress);
    } else {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, progress]);

  if (!showProgress) return null;

  return (
    <div className="w-full bg-gray-200 rounded-full h-5 mt-5 mb-5 relative overflow-hidden ring-1 ring-gray-300">
      <motion.div
        className="bg-blue-600 h-full rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: `${animatedProgress}%`,
          transition: { duration: 0.5, ease: "easeInOut" },
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xs text-gray-800 font-bold mix-blend-difference">
          {progress < 100 ? `${progress}%` : "Processing on server..."}
        </span>
      </div>
      {progress >= 100 && isMediaUploading && (
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 bg-blue-300 opacity-30 pointer-events-none"
          animate={{
            x: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </div>
  );
}

export default MediaProgressbar;
