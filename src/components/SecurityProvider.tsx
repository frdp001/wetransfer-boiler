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
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // 1. Anti-Bot: Behavioral checks
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    // 2. Anti-Bot: Advanced signature checks
    const checkBot = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isBotUA = /bot|googlebot|crawler|spider|robot|crawling|headless|phantomjs|selenium|puppeteer/i.test(userAgent);
      
      // Check for common headless browser indicators
      const isHeadless = 
        navigator.webdriver || 
        !(window as any).chrome && !(window as any).safari ||
        navigator.languages.length === 0 ||
        (navigator as any).plugins.length === 0;

      // Check for inconsistent window properties
      const isInconsistent = 
        window.outerWidth === 0 && window.outerHeight === 0 ||
        navigator.platform === "" ||
        navigator.maxTouchPoints === 0 && /mobile|android|iphone|ipad/i.test(userAgent);
      
      if (isBotUA || isHeadless || isInconsistent) {
        setIsBot(true);
      }
    };

    // 3. Anti-Tamper: Check for environment modifications
    const checkTamper = () => {
      // Check for devtools detection (basic)
      const threshold = 160;
      const isDevToolsOpen = 
        window.outerWidth - window.innerWidth > threshold || 
        window.outerHeight - window.innerHeight > threshold;
      
      // Check for code injection/tampering
      const isFetchTampered = window.fetch.toString().indexOf('[native code]') === -1;
      const isXHRTampered = window.XMLHttpRequest.toString().indexOf('[native code]') === -1;
      
      if (isFetchTampered || isXHRTampered) {
        setIsTampered(true);
      }
    };

    checkBot();
    checkTamper();

    const startTime = Date.now();

    const interval = setInterval(() => {
      checkTamper();
      // If after 10 seconds no interaction, might be a bot
      if (Date.now() - startTime > 10000 && !hasInteracted) {
        // setIsBot(true); // Be careful with this, might flag slow users
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hasInteracted]);

  return (
    <SecurityContext.Provider value={{ isBot, isTampered }}>
      {children}
    </SecurityContext.Provider>
  );
};
