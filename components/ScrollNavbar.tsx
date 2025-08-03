"use client";

import { useEffect, useState } from 'react';

interface ScrollNavbarProps {
  children: React.ReactNode;
}

const ScrollNavbar = ({ children }: ScrollNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        isScrolled 
          ? 'border-gray-600/50 backdrop-blur-md bg-gray-900/80 shadow-lg' 
          : 'border-gray-700/50 backdrop-blur-sm bg-gray-900/20'
      }`}
    >
      {children}
    </nav>
  );
};

export default ScrollNavbar; 