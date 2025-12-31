
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <path d="M3 9.5L12 4L21 9.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9.5Z" />
    <path d="M9 21V12H15V21" />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.4C20 16.7314 19.7314 17 19.4 17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20" />
    <path d="M8 7H16" />
    <path d="M8 11H16" />
  </svg>
);

export const FlashIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <path d="M13 2L4.66667 13.3333H11L11 22L19.3333 10.6667H13L13 2Z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" />
    <path d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20" />
  </svg>
);

export const MoreIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);
