import React, { createContext, useContext, useEffect, useState } from 'react';

interface SecurityContextType {
  isBot: boolean;
  isTampered: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within a SecurityProvider');
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBot, setIsBot] = useState(false);
  const [isTampered, setIsTampered] = useState(false);

  useEffect(() => {
    // 1. Anti-Bot: Simple behavioral checks
    let mouseMoved = false;
    const handleMouseMove = () => {
      mouseMoved = true;
      window.removeEventListener('mousemove', handleMouseMove);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 2. Anti-Bot: Check for common bot signatures
    const checkBot = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isBotUA = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);
      const isHeadless = (navigator as any).webdriver || !(window as any).chrome && !(window as any).safari;
      
      if (isBotUA || isHeadless) {
        setIsBot(true);
      }
    };

    // 3. Anti-Tamper: Check for environment modifications
    const checkTamper = () => {
      // Check if common global variables are modified or if devtools is open (basic check)
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // This is a very basic devtools detection, can be noisy
        // setIsTampered(true);
      }

      // Check for code injection/tampering (e.g., checking if certain functions are native)
      if (window.fetch.toString().indexOf('[native code]') === -1) {
        setIsTampered(true);
      }
    };

    checkBot();
    checkTamper();

    const interval = setInterval(() => {
      checkTamper();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SecurityContext.Provider value={{ isBot, isTampered }}>
      {children}
    </SecurityContext.Provider>
  );
};
