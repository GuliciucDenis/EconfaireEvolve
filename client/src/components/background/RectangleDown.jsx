import React from 'react';

const WaveShape = () => {
  return (
    <svg className="wave-shape" width="4304" height="490" viewBox="0 0 4304 490" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 221.431L3432.75 3.81142C3738.69 -15.5837 4043.11 60.4536 4304 221.431V221.431V489.5H0V221.431Z"
        fill="url(#paint0_linear_148_66)"
      />
      <path
        d="M0 221.431L3432.75 3.81142C3738.69 -15.5837 4043.11 60.4536 4304 221.431V221.431V489.5H0V221.431Z"
        fill="url(#paint1_linear_148_66)"
      />
      <defs>
        <linearGradient id="paint0_linear_148_66" x1="0" y1="137.856" x2="4304" y2="137.856" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ABD02A" />
          <stop offset="0.375" stopColor="#576A15" />
        </linearGradient>
        <linearGradient id="paint1_linear_148_66" x1="0" y1="137.856" x2="4304" y2="137.856" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6296CC" stopOpacity="0" />
          <stop offset="0.63" stopColor="#6296CC" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default WaveShape;
