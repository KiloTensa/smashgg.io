import React, { useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import KTBLANCO from '@/components/img/KTBLANCO.png';

const SMASH_LOGO = 'https://cdn2.steamgriddb.com/logo_thumb/0498cae30ceca924f76c2b0832c14f34.png';

export default function Intro({ onFinish }) {
  useEffect(() => {
    const tl = anime.timeline({
      easing: 'cubicBezier(.2,.9,.2,1)',
    });

    tl
      .add({
        targets: '#intro-overlay',
        opacity: [0, 1],
        duration: 350,
      })
      // progress fills linearly while intro plays
      .add({
        targets: '#intro-progress',
        width: ['0%', '100%'],
        duration: 1000,
        easing: 'linear'
      }, 0)
      .add({
        targets: '#intro-ring',
        scale: [0.85, 1.05],
        opacity: [0, 0.16],
        rotate: '1turn',
        duration: 1100,
      }, '-=200')
      .add({
        targets: ['#intro-logo-left', '#intro-logo-right'],
        scale: [0.72, 1],
        opacity: [0, 1],
        filter: ['blur(8px)', 'blur(0px)'],
        duration: 900,
        delay: anime.stagger(120)
      }, '-=900')
      .add({
        targets: '#intro-divider',
        width: ['0px', '56px'],
        opacity: [0, 0.7],
        duration: 500,
      }, '-=700')
      .add({
        targets: '#intro-title',
        translateY: [18, 0],
        opacity: [0, 1],
        letterSpacing: ['0.2em', '0.05em'],
        duration: 600,
      }, '-=450')
      .add({
        targets: ['#intro-logo-left', '#intro-logo-right'],
        scale: [1, 1.04, 1],
        duration: 600,
        easing: 'easeInOutSine'
      }, '+=120')
      .add({
        targets: '#intro-overlay',
        opacity: [1, 0],
        duration: 700,
        delay: 700,
        complete: () => {
          if (onFinish) onFinish();
        }
      });

    // Morph the progress bar into the background just before overlay fades
    tl.add({
      targets: '#intro-progress',
      height: ['6px', '100vh'],
      bottom: ['24px', '0px'],
      width: ['100%', '100%'],
      borderRadius: [999, 0],
      background: ['linear-gradient(90deg, rgba(59,185,255,0.95), rgba(120,90,255,0.85))', 'radial-gradient(1200px 400px at 50% 40%, rgba(255,255,255,0.02), transparent 20%), linear-gradient(180deg,#071029 0%,#03040a 100%)'],
      duration: 600,
      easing: 'easeInOutCubic'
    }, '-=900');

    return () => anime.remove('#intro-overlay');
  }, [onFinish]);

  return (
    <div id="intro-overlay" style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(1200px 400px at 50% 40%, rgba(255,255,255,0.02), transparent 20%), linear-gradient(180deg,#071029 0%,#03040a 100%)',
      zIndex: 9999,
      opacity: 0,
      pointerEvents: 'auto',
      willChange: 'opacity, transform'
    }}>
      <div style={{ textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div id="intro-ring" style={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            boxShadow: '0 0 60px rgba(59,185,255,0.06), inset 0 0 40px rgba(255,255,255,0.02)',
            opacity: 0,
            transform: 'scale(0.9)'
          }} />

          <img id="intro-logo-left" src={KTBLANCO} alt="KT" style={{ width: 96, height: 'auto', borderRadius: 8, opacity: 0, transform: 'scale(0.9)', filter: 'grayscale(1) drop-shadow(0 6px 18px rgba(0,0,0,0.6))' }} />

          <div id="intro-divider" style={{ height: 2, width: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))', opacity: 0 }} />

          <img id="intro-logo-right" src={SMASH_LOGO} alt="Smash" style={{ width: 96, height: 'auto', borderRadius: 8, opacity: 0, transform: 'scale(0.9)', filter: 'grayscale(1) drop-shadow(0 6px 18px rgba(0,0,0,0.6))' }} />
        </div>

        <h1 id="intro-title" style={{ margin: 0, fontSize: 22, fontWeight: 600, color: 'rgba(255,255,255,0.95)', opacity: 0 }}>SMASH GG</h1>
      </div>

      {/* Progress bar container */}
      <div id="intro-progress-wrap" style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 28,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <div id="intro-progress" style={{
          width: '0%',
          height: 1,
          borderRadius: 999,
          background: 'linear-gradient(90deg, rgba(59,185,255,0.95), rgba(120,90,255,0.85))',
          boxShadow: '0 6px 18px rgba(59,185,255,0.06), 0 2px 6px rgba(0,0,0,0.5)'
        }} />
      </div>
    </div>
  );
}
