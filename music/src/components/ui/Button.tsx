import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  // Base style - consistent across all buttons
  const baseStyles ='font-bold rounded-lg transition-colors cursor-pointer shadow-lg inline-flex items-center justify-center'

  // Size variants - (unifies typography and padding)
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // 3. Color variants
  const variantStyles = {
    primary:
      'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-slate-900/20',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};