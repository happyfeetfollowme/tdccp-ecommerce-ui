// Custom Avatar for user initials
import React from "react";

export interface UserInitialAvatarProps {
  userName: string;
  size?: number;
  className?: string;
}

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getBackgroundColor = (name: string) => {
  const colors = [
    '#673AB7', // Deep Purple
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#F44336', // Red
    '#FF9800', // Orange
    '#FFC107', // Amber
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#03A9F4', // Light Blue
    '#00BCD4', // Cyan
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

const UserInitialAvatar: React.FC<UserInitialAvatarProps> = ({ userName, size = 80, className = "" }) => {
  const initials = getInitials(userName);
  const backgroundColor = getBackgroundColor(userName);
  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-bold select-none ${className}`}
      style={{ backgroundColor, width: size, height: size, fontSize: size * 0.4 }}
    >
      <span>{initials}</span>
    </div>
  );
};

export default UserInitialAvatar;

