import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'active';
  href?: string;
  className?: string;
}

export const Button = ({ 
  variant = 'primary', 
  href, 
  className = '', 
  children, 
  ...props 
}: ButtonProps) => {
  const combinedClassName = `${styles.btn} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
