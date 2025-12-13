'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import placeholderData from '@/lib/placeholder-images.json';
import { Logo } from './icons/logo';
import { useEffect, useState } from 'react';

const words = ['Athlete', 'Baller', 'Hooper', 'You'];

export function LandingHero() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);

  // Typing effect
  useEffect(() => {
    if (index === words.length) return; // Stop after the last word

    if (
      subIndex === words[index].length + 1 &&
      index !== words.length - 1 &&
      !reverse
    ) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex(prev => prev + 1);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex(prev => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? 1000 : 150, Math.random() * 350));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  // Cursor blinking
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  const heroImage = placeholderData.placeholderImages.find(
    p => p.id === 'onboarding-1'
  );

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="absolute top-0 left-0 right-0 p-4">
        <Logo className="h-24 w-full max-w-sm" />
      </header>
      <div className="flex flex-1">
        <div className="flex w-full flex-col items-center justify-center space-y-8 p-8 text-center md:w-1/2 md:text-left md:items-start">
          <div className="typing-container">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Become a better
              <span className="animated-text-gradient ml-4">
                {`${words[index].substring(0, subIndex)}${
                  subIndex === words[index].length ? '' : ''
                }`}
                <span className="input-cursor"></span>
              </span>
            </h1>
          </div>
          <p className="max-w-md text-lg text-muted-foreground">
            Unlock your potential with personalized training programs, progress
            tracking, and expert-designed meal plans. Stop guessing, start
            improving.
          </p>
          <div className="flex w-full max-w-sm flex-col space-y-2 md:max-w-xs">
            <Button asChild size="lg">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">I Already Have an Account</Link>
            </Button>
          </div>
        </div>
        <div className="relative hidden md:block md:w-1/2">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Basketball player training"
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
