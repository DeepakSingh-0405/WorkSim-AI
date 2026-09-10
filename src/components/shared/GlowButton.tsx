'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function GlowButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: GlowButtonProps) {
  const sizeStyles = {
    sm: 'h-8 px-3 text-xs font-medium gap-1.5 rounded-md',
    md: 'h-10 px-5 text-sm font-medium gap-2 rounded-lg',
    lg: 'h-12 px-7 text-base font-semibold gap-2.5 rounded-lg',
  };

  const variantStyles = {
    primary:
      'bg-[#c40505] text-white border border-[#c40505] shadow-[0_0_15px_rgba(196,5,5,0.25)] hover:bg-[#a50404] hover:border-[#a50404] hover:shadow-[0_0_24px_rgba(196,5,5,0.4)]',
    secondary:
      'bg-[#1a1a1a] text-[#fafafa] border border-white/10 hover:bg-[#222222] hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]',
    outline:
      'bg-transparent text-[#fafafa] border border-white/15 hover:bg-white/5 hover:border-white/25',
    ghost:
      'bg-transparent text-[#a1a1a1] hover:text-white hover:bg-white/5 border border-transparent',
  };

  const isPrimary = variant === 'primary';

  return (
    <motion.button
      whileHover={
        disabled || loading
          ? undefined
          : {
              y: -2,
              boxShadow: isPrimary
                ? '0 0 24px rgba(196, 5, 5, 0.4)'
                : '0 0 15px rgba(255, 255, 255, 0.08)',
            }
      }
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', bounce: 0.05, duration: 0.3 }}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center font-sans select-none cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />}
      {children}
    </motion.button>
  );
}
