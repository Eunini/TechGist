import React, { useRef, useEffect } from 'react';

const SparklingDotsCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const count = 1000; // Number of dots
    const dots = [];

    // Set up dots with random positions, colors, and transparency
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random(), // Initial alpha value
        fadeDirection: Math.random() > 0.5 ? 0.01 : -0.01 // Random fade in or out
      });
    }

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach(dot => {
        // Update transparency to create fade in/out effect
        dot.alpha += dot.fadeDirection;
        if (dot.alpha <= 0 || dot.alpha >= 1) {
          dot.fadeDirection *= -1; // Reverse fade direction at boundaries
        }

        // Draw the dot
        context.beginPath();
        context.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${dot.color.match(/\d+/g).join(',')}, ${dot.alpha})`; // Apply transparency
        context.fill();

        // Slight movement to create a subtle sparkle effect
        dot.x += (Math.random() - 0.5) * 0.5;
        dot.y += (Math.random() - 0.5) * 0.5;
      });

      requestAnimationFrame(draw);
    };

    draw();

    // Resize canvas when window resizes
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default SparklingDotsCanvas;