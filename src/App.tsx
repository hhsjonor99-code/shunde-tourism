import { useEffect, useState } from 'react';
import { Footer, NavBar } from './components/layout';
import {
  AboutSection,
  DrawSection,
  HeroSection,
  ImpressionSection,
  IntroSection,
  RoutesSection,
} from './components/sections';
import './App.css';

function App() {
  const [scrolled, setScrolled] = useState(false);

  // 监听滚动：超过 64px 时切换 NavBar 背景
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 64);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <NavBar scrolled={scrolled} />

      <main>
        <HeroSection />
        <IntroSection />
        <RoutesSection />
        <DrawSection />
        <ImpressionSection />
        <AboutSection />
      </main>

      <Footer />
    </>
  );
}

export default App;