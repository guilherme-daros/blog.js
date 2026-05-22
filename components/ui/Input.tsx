import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={className}>
        {label && <label className={styles.label} htmlFor={props.id}>{label}</label>}
        <input ref={ref} className={styles.input} {...props} />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
