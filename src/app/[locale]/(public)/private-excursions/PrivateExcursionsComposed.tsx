'use client';
import { useRef } from 'react';
import VipHero from '@/components/private/VipHero';
import WhyPrivate from '@/components/private/WhyPrivate';
import VipPackages from '@/components/private/VipPackages';
import PrivateExcursionClient from './PrivateExcursionClient';

export default function PrivateExcursionsComposed() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <VipHero onStartForm={scrollToForm} />
      <WhyPrivate />
      <VipPackages onSelect={() => scrollToForm()} />
      <div ref={formRef}>
        <PrivateExcursionClient />
      </div>
    </>
  );
}
