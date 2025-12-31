
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// UI Icons (Minimalist)
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <path d="M3 9.5L12 4L21 9.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9.5Z" />
    <path d="M9 21V12H15V21" />
  </svg>
);

export const LibraryIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <path d="M4 19.5V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.4C20 16.7314 19.7314 17 19.4 17H6C4.89543 17 4 17.8954 4 19.5ZM4 19.5C4 20.3284 4.67157 21 5.5 21H19.5" />
    <path d="M9 7H15" /><path d="M9 11H15" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" />
    <path d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20" />
  </svg>
);

export const FlashIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <path d="M13 2L4.66667 13.3333H11L11 22L19.3333 10.6667H13L13 2Z" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <path d="M12 3L14.5 9L21 11.5L14.5 14L12 21L9.5 14L3 11.5L9.5 9L12 3Z" />
  </svg>
);

export const FlameIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 3.5 3 4 2.107 1.053 3 3.411 3 6a5 5 0 0 1-10 0z" />
  </svg>
);

export const SoundHighIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <path d="M11 5L6 9H2V15H6L11 19V5ZM15.54 8.46c.94.94 1.46 2.21 1.46 3.54s-.52 2.6-1.46 3.54" />
  </svg>
);

export const HeadphonesIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

// --- NEW SOFT & SQUISHY STAR PERSON BADGE ICONS ---

// Urban Rookie: Soft star bouncing on a round board
export const BadgeRookieIcon: React.FC<IconProps> = ({ size = 64, color = "#CCFF00" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Soft Body */}
    <path d="M50 15C55 15 58 28 62 32C66 36 78 35 78 40C78 45 68 50 66 55C64 60 68 72 63 75C58 78 50 68 45 68C40 68 32 78 27 75C22 72 26 60 24 55C22 50 12 45 12 40C12 35 24 36 28 32C32 28 35 15 50 15Z" fill={color} stroke="black" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Round Skateboard */}
    <rect x="25" y="75" width="50" height="8" rx="4" fill="#3B82F6" stroke="black" strokeWidth="2" />
    <circle cx="35" cy="85" r="4" fill="black" />
    <circle cx="65" cy="85" r="4" fill="black" />
    {/* Face */}
    <circle cx="42" cy="40" r="1.5" fill="black" />
    <circle cx="58" cy="40" r="1.5" fill="black" />
    <path d="M46 48C46 48 48 50 50 50C52 50 54 48 54 48" stroke="black" strokeWidth="2" strokeLinecap="round" />
    {/* Blush */}
    <circle cx="38" cy="45" r="3" fill="#FF6B4A" fillOpacity="0.4" />
    <circle cx="62" cy="45" r="3" fill="#FF6B4A" fillOpacity="0.4" />
  </svg>
);

// Urban Legend: Soft star with huge puffy headphones
export const BadgeLegendIcon: React.FC<IconProps> = ({ size = 64, color = "#CCFF00" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15C55 15 58 28 62 32C66 36 78 35 78 40C78 45 68 50 66 55C64 60 68 72 63 75C58 78 50 68 45 68C40 68 32 78 27 75C22 72 26 60 24 55C22 50 12 45 12 40C12 35 24 36 28 32C32 28 35 15 50 15Z" fill={color} stroke="black" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Puffy Headphones */}
    <path d="M30 35C30 15 70 15 70 35" stroke="#3B82F6" strokeWidth="7" strokeLinecap="round" />
    <rect x="22" y="32" width="14" height="22" rx="7" fill="#3B82F6" stroke="black" strokeWidth="2" />
    <rect x="64" y="32" width="14" height="22" rx="7" fill="#3B82F6" stroke="black" strokeWidth="2" />
    {/* Face */}
    <path d="M43 42L45 42M55 42L57 42" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M46 48C46 48 48 50 50 50C52 50 54 48 54 48" stroke="black" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Night Owl: Soft star holding a big round mug
export const BadgeOwlIcon: React.FC<IconProps> = ({ size = 64, color = "#CCFF00" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15C55 15 58 28 62 32C66 36 78 35 78 40C78 45 68 50 66 55C64 60 68 72 63 75C58 78 50 68 45 68C40 68 32 78 27 75C22 72 26 60 24 55C22 50 12 45 12 40C12 35 24 36 28 32C32 28 35 15 50 15Z" fill={color} stroke="black" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Round Mug */}
    <path d="M65 55H80V70C80 75 75 75 72.5 75H65V55Z" fill="#3B82F6" stroke="black" strokeWidth="2" />
    <path d="M80 60C84 60 85 62 85 65C85 68 84 70 80 70" stroke="black" strokeWidth="2" />
    {/* Steam */}
    <path d="M68 48C68 46 70 45 70 43" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    <path d="M74 50C74 48 76 47 76 45" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    {/* Eyes closed */}
    <path d="M40 42C40 42 42 40 45 40" stroke="black" strokeWidth="2" strokeLinecap="round" />
    <path d="M55 40C58 40 60 42 60 42" stroke="black" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Sonic Wave: Soft star stretching forward (blobby speed)
export const BadgeSonicIcon: React.FC<IconProps> = ({ size = 64, color = "#CCFF00" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 15C65 15 68 28 72 32C76 36 88 35 88 40C88 45 78 50 76 55C74 60 78 72 73 75C68 78 60 68 55 68C50 68 42 78 37 75C32 72 36 60 34 55C32 50 22 45 22 40C22 35 34 36 38 32C42 28 45 15 60 15Z" fill={color} stroke="black" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Speed blobs */}
    <circle cx="15" cy="40" r="4" fill="#3B82F6" />
    <circle cx="10" cy="52" r="6" fill="#3B82F6" />
    <circle cx="15" cy="65" r="3" fill="#3B82F6" />
    {/* Focused Face */}
    <path d="M55 42L65 42" stroke="black" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Master Mind: Soft star hugging a round golden-style trophy
export const BadgeMasterIcon: React.FC<IconProps> = ({ size = 64, color = "#CCFF00" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 35C55 35 58 48 62 52C66 56 78 55 78 60C78 65 68 70 66 75C64 80 68 92 63 95C58 98 50 88 45 88C40 88 32 98 27 95C22 92 26 80 24 75C22 70 12 65 12 60C12 55 24 56 28 52C32 48 35 35 50 35Z" fill={color} stroke="black" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Round Trophy */}
    <path d="M40 10H60V22C60 28 55 33 50 33C45 33 40 28 40 22V10Z" fill="#3B82F6" stroke="black" strokeWidth="2" />
    <circle cx="50" cy="18" r="4" fill="white" fillOpacity="0.4" />
    <path d="M35 15C32 15 30 17 30 20" stroke="black" strokeWidth="2" strokeLinecap="round" />
    <path d="M65 15C68 15 70 17 70 20" stroke="black" strokeWidth="2" strokeLinecap="round" />
    {/* Proud Face */}
    <circle cx="43" cy="60" r="1.5" fill="black" />
    <circle cx="57" cy="60" r="1.5" fill="black" />
    <path d="M46 66C46 66 48 68 50 68C52 68 54 66 54 66" stroke="black" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// District 1 Star: Soft star with a round floating speech bubble
export const BadgeSocialIcon: React.FC<IconProps> = ({ size = 64, color = "#CCFF00" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15C55 15 58 28 62 32C66 36 78 35 78 40C78 45 68 50 66 55C64 60 68 72 63 75C58 78 50 68 45 68C40 68 32 78 27 75C22 72 26 60 24 55C22 50 12 45 12 40C12 35 24 36 28 32C32 28 35 15 50 15Z" fill={color} stroke="black" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Round Phone/Bubble */}
    <rect x="70" y="45" width="18" height="28" rx="6" fill="#3B82F6" stroke="black" strokeWidth="2" />
    <circle cx="79" cy="67" r="2" fill="white" fillOpacity="0.5" />
    {/* Winking Face */}
    <path d="M40 40C40 40 42 42 45 42" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="58" cy="40" r="1.5" fill="black" />
    <path d="M48 48C48 48 49 50 50 50C51 50 52 48 52 48" stroke="black" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const MedalIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <circle cx="12" cy="9" r="6" />
    <path d="M9 14.2L7 22L12 19L17 22L15 14.2" />
  </svg>
);
