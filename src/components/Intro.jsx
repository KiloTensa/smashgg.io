import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

export default function Intro({ onFinish }) {
  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const paths = document.querySelectorAll('.smash-path');
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.fill = 'rgba(255, 255, 255, 0)';
      path.style.stroke = '#ffffff';
      path.style.strokeWidth = '3px';
    });

    if (textRef.current) {
      textRef.current.style.opacity = 0;
      textRef.current.style.transform = 'translateY(10px)';
    }

    const tl = anime.timeline({
      easing: 'cubicBezier(.2,.9,.2,1)',
      complete: () => {
        if (onFinish) onFinish();
      }
    });

    tl
      .add({
        targets: overlayRef.current,
        opacity: [0, 1],
        duration: 200,
      })
      .add({
        targets: '.smash-path',
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 1400,
        easing: 'easeInOutSine',
        delay: anime.stagger(120, { start: 150 })
      })
      .add({
        targets: svgRef.current,
        filter: [
          'drop-shadow(0px 0px 0px rgba(255,255,255,0))',
          'drop-shadow(0px 0px 25px rgba(255,255,255,0.9)) drop-shadow(0px 0px 50px rgba(255,255,255,0.4))'
        ],
        scale: [1, 1.05],
        duration: 400,
        easing: 'easeOutQuad'
      }, '-=200')
      .add({
        targets: '.smash-path',
        fill: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
        strokeWidth: [3, 0],
        duration: 500,
        easing: 'easeOutExpo'
      }, '-=250')
      .add({
        targets: textRef.current,
        opacity: [0, 1],
        translateY: ['10px', '0px'],
        duration: 700,
        easing: 'easeOutCubic'
      }, '-=300')
      .add({
        targets: {},
        duration: 600 
      })
      .add({
        targets: svgRef.current,
        scale: [1.05, 0.22],
        translateY: ['0vh', '-40vh'], 
        translateX: ['0vw', '-40vw'], 
        opacity: [1, 0],
        duration: 900,
        easing: 'easeInOutExpo'
      }, '-=0')
      .add({
        targets: textRef.current,
        opacity: [1, 0],
        translateY: ['0px', '-15px'],
        duration: 600,
        easing: 'linear'
      }, '-=900')
      .add({
        targets: overlayRef.current,
        opacity: [1, 0],
        duration: 550,
        easing: 'linear'
      }, '-=650');

    return () => {
      tl.pause();
      anime.remove('.smash-path');
      if (svgRef.current) anime.remove(svgRef.current);
      if (textRef.current) anime.remove(textRef.current);
      if (overlayRef.current) anime.remove(overlayRef.current);
    };
  }, [onFinish]);

  return (
    <div 
      ref={overlayRef}
      id="intro-overlay" 
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        zIndex: 9999,
        opacity: 0,
        pointerEvents: 'auto',
        willChange: 'opacity'
      }}
    >
      <div 
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        <svg 
          ref={svgRef}
          id="smash-svg" 
          viewBox="0 0 200 200" 
          style={{ width: '220px', height: '220px', willChange: 'transform, filter, opacity' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g strokeLinecap="round" strokeLinejoin="round">
            <path className="smash-path" d="M 70 15.2 A 90 90 0 0 0 11.3 115 L 70 115 Z" />
            <path className="smash-path" d="M 15.2 130 A 90 90 0 0 0 70 184.8 L 70 130 Z" />
            <path className="smash-path" d="M 85 11.3 A 90 90 0 0 1 188.7 115 L 85 115 Z" />
            <path className="smash-path" d="M 184.8 130 A 90 90 0 0 1 85 188.7 L 85 130 Z" />
          </g>
        </svg>

        <h1 
          ref={textRef}
          style={{
            margin: 0,
            color: '#FFFFFF',
            fontSize: '32px',
            fontWeight: '900',
            fontFamily: 'sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textShadow: '0px 0px 15px rgba(255,255,255,0.7)',
            willChange: 'opacity, transform'
          }}
        >
          SMASH GG
        </h1>
      </div>
    </div>
  );
}