import React from 'react';

const ProfessionalAnimatedBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-gradient-xy"></div>
      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-size: 400% 400%;
            background-position: 0% 50%;
          }
          50% {
            background-size: 200% 200%;
            background-position: 100% 50%;
          }
        }
        .animate-gradient-xy {
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ProfessionalAnimatedBackground;
