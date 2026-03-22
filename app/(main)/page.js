import Hero from '@/app/components/Hero';
import About from '@/app/components/About';
import Features from '@/app/components/Features';
import Showcase from '@/app/components/Showcase';
import Benefits from '@/app/components/Benefits';
import LauncherPromo from '@/app/components/LauncherPromo';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <LauncherPromo />
      <Showcase />
      <Benefits />
    </>
  );
}
