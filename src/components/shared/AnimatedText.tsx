'use client';

import React from 'react';
import { motion, Variants } from 'motion/react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  el?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  staggerDelay?: number;
  initialDelay?: number;
  highlightWords?: string[];
  highlightClassName?: string;
}

export function AnimatedText({
  text,
  className,
  el: Wrapper = 'h1',
  staggerDelay = 0.08,
  initialDelay = 0.1,
  highlightWords = [],
  highlightClassName = 'text-[#c40505]',
}: AnimatedTextProps) {
  const words = text.split(' ');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.05,
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('inline-block', className)}
    >
      <Wrapper className="inline flex-wrap">
        {words.map((word, index) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
          const isHighlight = highlightWords.some(
            (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
          );

          return (
            <motion.span
              key={`${word}-${index}`}
              variants={wordVariants}
              className={cn('inline-block mr-[0.25em]', isHighlight && highlightClassName)}
            >
              {word}
            </motion.span>
          );
        })}
      </Wrapper>
    </motion.div>
  );
}
