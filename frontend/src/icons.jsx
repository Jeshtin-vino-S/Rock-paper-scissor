import React from 'react';

// Common stroke props: 3px stroke, round caps, round joins
const commonStroke = {
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
};

// Rock: Custom geometric clenched fist
export const RockIcon = ({ size = 48, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    stroke={color}
    className={className}
    {...commonStroke}
  >
    {/* Fist outer contour */}
    <path d="M18 48V32C18 29.8 19.8 28 22 28H44C46.2 28 48 29.8 48 32V48C48 51.3 45.3 54 42 54H24C20.7 54 18 51.3 18 48Z" />
    {/* Four fingers / knuckles */}
    <path d="M22 28V16C22 14.3 23.3 13 25 13C26.7 13 28 14.3 28 16V28" />
    <path d="M28 28V13C28 11.3 29.3 10 31 10C32.7 10 34 11.3 34 13V28" />
    <path d="M34 28V14C34 12.3 35.3 11 37 11C38.7 11 40 12.3 40 14V28" />
    <path d="M40 28V18C40 16.3 41.3 15 43 15C44.7 15 46 16.3 46 18V32" />
    {/* Thumb wrapped across */}
    <path d="M18 36C22 36 28 38 34 38C36.2 38 38 39.8 38 42C38 44.2 36.2 46 34 46H20" />
    {/* Wrist base */}
    <path d="M24 54V60" />
    <path d="M42 54V60" />
  </svg>
);

// Paper: Custom open hand with spread fingers
export const PaperIcon = ({ size = 48, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    stroke={color}
    className={className}
    {...commonStroke}
  >
    {/* Palm and wrist base */}
    <path d="M24 56V60" />
    <path d="M40 56V60" />
    <path d="M22 45C17 40 12 36 12 32C12 29.8 13.8 28 16 28C18.5 28 22 32 23 35" />
    {/* 4 Fingers extended */}
    <path d="M23 35V15C23 13.3 24.3 12 26 12C27.7 12 29 13.3 29 15V32" />
    <path d="M29 27V11C29 9.3 30.3 8 32 8C33.7 8 35 9.3 35 11V27" />
    <path d="M35 28V14C35 12.3 36.3 11 38 11C39.7 11 41 12.3 41 14V30" />
    <path d="M41 31V20C41 18.3 42.3 17 44 17C45.7 17 47 18.3 47 20V42C47 50 43 56 36 56H26C21 56 19 50 19 45" />
  </svg>
);

// Scissors: Custom crossing blades with pivot and handles
export const ScissorsIcon = ({ size = 48, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    stroke={color}
    className={className}
    {...commonStroke}
  >
    {/* Blades crossing */}
    <path d="M48 10L28 32" />
    <path d="M16 10L36 32" />
    {/* Center pivot */}
    <circle cx="32" cy="28" r="3" fill="none" strokeWidth="3" />
    {/* Handles connecting from pivot to finger rings */}
    <path d="M28 32L22 40" />
    <path d="M36 32L42 40" />
    {/* Left finger ring */}
    <ellipse cx="19" cy="48" rx="8" ry="7" />
    {/* Right finger ring */}
    <ellipse cx="45" cy="48" rx="8" ry="7" />
  </svg>
);

// Tilted Fist: For countdown tall cards
export const TiltedFistIcon = ({ size = 64, color = 'currentColor', flip = false, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    stroke={color}
    className={className}
    style={{ transform: flip ? 'scaleX(-1) rotate(-15deg)' : 'rotate(-15deg)' }}
    {...commonStroke}
  >
    <path d="M14 44V30C14 28 16 26 18 26H38C40 26 42 28 42 30V44C42 47 39 50 36 50H20C17 50 14 47 14 44Z" />
    <path d="M18 26V18C18 16 19.5 15 21 15C22.5 15 24 16 24 18V26" />
    <path d="M24 26V15C24 13.5 25.5 12 27 12C28.5 12 30 13.5 30 15V26" />
    <path d="M30 26V16C30 14.5 31.5 13 33 13C34.5 13 36 14.5 36 16V26" />
    <path d="M36 26V20C36 18.5 37.5 17 39 17C40.5 17 42 18.5 42 20V32" />
    <path d="M14 34C18 34 24 36 29 36C31 36 33 37.5 33 39.5C33 41.5 31 43 29 43H16" />
    <path d="M20 50V56" />
    <path d="M36 50V56" />
  </svg>
);

// Star Outline: 5-point star
export const StarOutlineIcon = ({ size = 64, color = '#FFD84D', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    stroke={color}
    className={className}
    {...commonStroke}
  >
    <polygon points="32,6 39.8,22.4 58,24.8 44.5,37.6 48,56 32,46.8 16,56 19.5,37.6 6,24.8 24.2,22.4" />
  </svg>
);

// Trophy outline for Win
export const TrophyIcon = ({ size = 28, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    stroke={color}
    className={className}
    {...commonStroke}
  >
    <path d="M9 6H23V14C23 18 19.8 21 16 21C12.2 21 9 18 9 14V6Z" />
    <path d="M9 9H5C3.9 9 3 9.9 3 11V12C3 14.8 5.2 17 8 17H9" />
    <path d="M23 9H27C28.1 9 29 9.9 29 11V12C29 14.8 26.8 17 24 17H23" />
    <path d="M16 21V26" />
    <path d="M11 26H21" />
  </svg>
);

// Cross outline for Lose
export const DefeatCrossIcon = ({ size = 28, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    stroke={color}
    className={className}
    {...commonStroke}
  >
    <circle cx="16" cy="16" r="12" />
    <path d="M11 11L21 21" />
    <path d="M21 11L11 21" />
  </svg>
);

// Equal / Scales for Draw
export const DrawEqualIcon = ({ size = 28, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    stroke={color}
    className={className}
    {...commonStroke}
  >
    <circle cx="16" cy="16" r="12" />
    <path d="M10 13H22" />
    <path d="M10 19H22" />
  </svg>
);

// Question mark for CPU hidden card
export const QuestionIcon = ({ size = 48, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    stroke={color}
    className={className}
    {...commonStroke}
  >
    <circle cx="32" cy="32" r="26" />
    <path d="M26 25C26 21.7 28.7 19 32 19C35.3 19 38 21.7 38 25C38 28.3 35.3 30 32 33V37" />
    <circle cx="32" cy="45" r="1.5" fill={color} />
  </svg>
);

// Sound icon
export const SoundIcon = ({ size = 18, muted = false, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    {...commonStroke}
  >
    <path d="M11 5L6 9H3C2.4 9 2 9.4 2 10V14C2 14.6 2.4 15 3 15H6L11 19V5Z" />
    {!muted ? (
      <>
        <path d="M15.5 8.5C16.8 9.8 17.5 11.5 17.5 13C17.5 14.5 16.8 16.2 15.5 17.5" />
        <path d="M18.5 5.5C20.8 7.8 22 10.5 22 13C22 15.5 20.8 18.2 18.5 20.5" />
      </>
    ) : (
      <path d="M17 10L22 15M22 10L17 15" />
    )}
  </svg>
);

// Stats icon
export const StatsIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    {...commonStroke}
  >
    <path d="M4 20H20" />
    <path d="M7 20V12" />
    <path d="M12 20V6" />
    <path d="M17 20V15" />
  </svg>
);

// How to / Info icon
export const InfoIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    {...commonStroke}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16V11" />
    <circle cx="12" cy="8" r="1" fill={color} />
  </svg>
);

// Pause icon
export const PauseIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    {...commonStroke}
  >
    <rect x="6" y="5" width="4" height="14" rx="2" />
    <rect x="14" y="5" width="4" height="14" rx="2" />
  </svg>
);

// Play icon
export const PlayIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    {...commonStroke}
  >
    <polygon points="6,4 20,12 6,20" />
  </svg>
);

// Home icon
export const HomeIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    {...commonStroke}
  >
    <path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" />
  </svg>
);

// Close / X icon
export const CloseIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    {...commonStroke}
  >
    <path d="M18 6L6 18" />
    <path d="M6 6L18 18" />
  </svg>
);
