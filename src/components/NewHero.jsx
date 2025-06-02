import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react'
import {ScrollTrigger} from 'gsap/all';
import Button from './Button';

gsap.registerPlugin(ScrollTrigger);

const NewHero = () => {

  const [currentIndex,setCurrentIndex] = useState(1);
  const [hasClicked,setHasClicked] = useState(false);
  const [isLoading,setIsLoading] = useState(true);
  const [loadedVideos,setLoadedVideos] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const totalVideos = 3;
  const nextVideoRef = useRef(null);

  // Mouse tracking for cursor follower
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;
          
          // Wrap around screen edges
          if (newX > window.innerWidth) newX = 0;
          if (newX < 0) newX = window.innerWidth;
          if (newY > window.innerHeight) newY = 0;
          if (newY < 0) newY = window.innerHeight;
          
          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => (prev+1));
  }

  const handleDotClick = (index) => {
    if (index !== currentIndex) {
      setHasClicked(true);
      setCurrentIndex(index);
    }
  }

  useEffect(() => {
    if(loadedVideos === totalVideos){
      setIsLoading(false);
    }
  },[loadedVideos])

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVideoRef.current.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;
  
  return (
    <div className='relative h-dvh w-screen overflow-x-hidden'>
      {/* Cursor Follower */}
      <div 
        className='cursor-follower'
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />
      
      {/* Floating Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className='particle'
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
        />
      ))}

      {isLoading && (
        <div className='flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50'>
          <div className='three-body'>
              <div className='three-body__dot'/>
              <div className='three-body__dot'/>
              <div className='three-body__dot'/>
          </div>
        </div>
      )}

      <div id="video-frame" className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
          <div>
            <video 
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id='next-video'
            className='absolute-center invisible absolute z-20 size-64 object-cover object-center'
            onLoadedData={handleVideoLoad}
            />

            <video 
            src={getVideoSrc(currentIndex)}
            autoPlay
            loop
            muted
            id="current-video"
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
            />

            {/* Preload other videos */}
            {Array.from({ length: totalVideos }, (_, i) => i + 1)
              .filter(index => index !== currentIndex)
              .map(index => (
                <video
                  key={index}
                  src={getVideoSrc(index)}
                  loop
                  muted
                  className="hidden"
                  onLoadedData={handleVideoLoad}
                />
              ))}
          </div>

          {/* Center Text Content */}
<div className='absolute inset-0 flex items-center justify-center z-40'>
  <div className='text-center px-4'>
    <p className='text-blue-100 text-sm md:text-base font-light tracking-wider mb-6 uppercase drop-shadow-lg'>
      Shubham Mahato
    </p>

    <h1 className='hero-main-text special-font text-blue-100 uppercase leading-tight mb-8'>
      <b>Thoughtfully</b><br />
      Built,<br />
      <b>Visually</b><br />
      Brilliant!
    </h1>

    {/* Button Group */}
    <div className='flex justify-center gap-4 flex-wrap'>
      <Button
        id="about-me"
        title="About Me"
        containerClass="bg-yellow-300 flex-center gap-1 px-6 py-2 rounded-md shadow-md"
      />
      <Button
        id="download-cv"
        title="Download CV"
        containerClass="bg-yellow-300 flex-center gap-1 px-6 py-2 rounded-md shadow-md"
      />
    </div>
  </div>
</div>


          {/* Navigation Dots */}
          <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50'>
            <div className='flex space-x-4'>
              {Array.from({ length: totalVideos }, (_, i) => i + 1).map((index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full border-2 border-white/50 transition-all duration-300 ease-in-out hover:scale-125 ${
                    currentIndex === index 
                      ? 'bg-blue-400 border-blue-400 shadow-lg shadow-blue-400/50 scale-110' 
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Switch to video ${index}`}
                />
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}

export default NewHero