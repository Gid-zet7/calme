'use client'
import React from 'react';
import Link from 'next/link';
import Threads from '../threads';
import { Button } from '@/components/ui/button';
import AvatarUsers from '@/components/avatar-users';

const Hero: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-3xl text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Your Mental Health Is Our Priority
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Calme provides accessible mental health resources, professional support, and community programs to help you navigate life's challenges an thrive
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/book-appointment" className="pointer-events-auto">
                <Button size="lg">Book appointment</Button>
              </Link>
              <Link href="/resources" className="pointer-events-auto">
                <Button size="lg" variant="outline">Explore resources</Button>
              </Link>
            </div>
            <div className="flex items-center justify-center pt-2">
              <AvatarUsers />
            </div>
          </div>
        </div>
      </div>
  );
};

export default Hero;