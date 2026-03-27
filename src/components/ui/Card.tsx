import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = ({ hover = false, className = '', children, ...props }: CardProps) => {
  const hoverClass = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';

  return (
    <div
      className={`bg-white rounded-lg shadow-md ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
