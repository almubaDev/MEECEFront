import React, { useEffect, useRef } from 'react';

const HeroSection = () => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current && videoRef.current) {
                const scrollPosition = window.pageYOffset;
                const speed = 0.3;
                videoRef.current.style.transform = `translateY(${scrollPosition * speed}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="mceee-hero" ref={containerRef}>
            <div className="mceee-hero__container">
                <video
                    ref={videoRef}
                    className="mceee-hero__video"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/vbanner.mp4" type="video/mp4" />
                </video>
                <div className="mceee-hero__overlay">
                    <h1 className="mceee-hero__title">
                        Magíster en Educación Emocional y Convivencia Escolar
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;