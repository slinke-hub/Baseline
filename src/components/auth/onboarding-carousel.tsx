'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import placeholderData from '@/lib/placeholder-images.json';
import { Logo } from '../icons/logo';

const onboardingSlides = [
  {
    id: 'train-smart',
    title: 'Train Smart',
    description: 'Access a library of drills from pro trainers to elevate your game.',
    imageId: 'onboarding-1',
  },
  {
    id: 'track-progress',
    title: 'Track Progress',
    description: 'Monitor your stats, see your improvement, and stay motivated.',
    imageId: 'onboarding-2',
  },
  {
    id: 'meal-planner',
    title: 'Meal Planner',
    description: 'Fuel your body for peak performance with personalized meal plans.',
    imageId: 'onboarding-3',
  },
];

export function OnboardingCarousel() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-8">
        <div className="flex items-center gap-2">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">HoopsCoach</h1>
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {onboardingSlides.map((slide) => {
              const slideImage = placeholderData.placeholderImages.find(p => p.id === slide.imageId);
              return (
                <CarouselItem key={slide.id}>
                  <div className="p-1">
                    <Card className="border-none bg-transparent shadow-none">
                      <CardContent className="flex aspect-[4/3] flex-col items-center justify-center p-6 text-center">
                        {slideImage && (
                          <Image
                            src={slideImage.imageUrl}
                            alt={slide.title}
                            width={300}
                            height={225}
                            data-ai-hint={slideImage.imageHint}
                            className="mb-6 rounded-lg object-cover"
                          />
                        )}
                        <h2 className="text-2xl font-bold text-primary">{slide.title}</h2>
                        <p className="mt-2 text-muted-foreground">{slide.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-[-16px]" />
          <CarouselNext className="right-[-16px]" />
        </Carousel>
        <div className="flex w-full flex-col space-y-2">
          <Button asChild size="lg" className="w-full">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/login">I already have an account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
