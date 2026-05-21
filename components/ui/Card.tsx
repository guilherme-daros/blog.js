import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`${styles.card} ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = '' }: CardProps) => (
  <div className={`${styles.header} ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }: CardProps) => (
  <div className={`${styles.body} ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }: CardProps) => (
  <div className={`${styles.footer} ${className}`}>{children}</div>
);
