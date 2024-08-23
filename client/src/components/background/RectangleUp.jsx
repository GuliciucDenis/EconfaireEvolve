import React from 'react';

const CustomShape = () => {
  return (
    <svg className="rectangle-up" width="4312" height="705" viewBox="0 0 4312 705" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_153_100)">
        <path
          d="M4 0H2069.5H4308V438.5L1470.02 685.435C968.3 729.09 463.734 644.102 4 438.5V438.5V0Z"
          fill="#6195CF"
        />
        <path
          d="M4 0H2069.5H4308V438.5L1470.02 685.435C968.3 729.09 463.734 644.102 4 438.5V438.5V0Z"
          fill="url(#paint0_linear_153_100)"
        />
        <path
          d="M1469.98 684.937C968.449 728.575 464.077 643.647 4.5 438.176V0.5H2069.5H4307.5V438.042L1469.98 684.937Z"
          stroke="black"
        />
      </g>
      <defs>
        <filter id="filter0_d_153_100" x="0" y="0" width="4312" height="704.585" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_153_100" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_153_100" result="shape" />
        </filter>
        <linearGradient id="paint0_linear_153_100" x1="4" y1="-10.0001" x2="4308" y2="-10.0001" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AED225" stopOpacity="0" />
          <stop offset="0.945" stopColor="#AED225" stopOpacity="0.73" />
          <stop offset="1" stopColor="#AED225" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CustomShape;
