import { useEffect, useRef, useState } from 'react';

const BackgroundVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMoving, setIsMoving] = useState(false);
  const movementTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsMoving(true);
      
      if (movementTimeout.current) {
        clearTimeout(movementTimeout.current);
      }

      movementTimeout.current = setTimeout(() => {
        setIsMoving(false);
      }, 100); // 100ms threshold to detect "not moving"
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (movementTimeout.current) clearTimeout(movementTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isMoving) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Auto-play might be blocked by browser until user interaction
        });
      }
    }
  }, [isMoving]);

  return (
    <div className="video-background-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="video-background-element"
      >
        <source src={`${import.meta.env.BASE_URL}background-video.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay" />
    </div>
  );
};

export default BackgroundVideo;
