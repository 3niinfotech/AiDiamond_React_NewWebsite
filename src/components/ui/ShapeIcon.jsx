import React from 'react';
import './ShapeIcon.css';

const ShapeIcon = ({ 
  name, 
  size = 30, 
  color = 'currentColor',
  className = '',
  onClick,
  ...props 
}) => {
  const iconClass = `icon-${name}`;
  
  return (
    <span 
      className={`diamond_icon ${iconClass} ${className}`}
      style={{ 
        fontSize: size, 
        color: color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      {...props}
    />
  );
};

export default ShapeIcon;