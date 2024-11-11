// src/components/AnimatedBackground.js
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div style={{
      zIndex: -200,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img src="/img/moon.png" alt="Moon" className='bg-image'/>
      </div>
    </div>
  );
};

export default AnimatedBackground;
