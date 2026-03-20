import React, { createContext, useContext, useEffect, useState } from 'react';

interface SecurityContextType {
  isBot: boolean;
  isTampered: boolean;
  reportPhishing: (data: any) => Promise<void>;
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
  const [startTime] = useState(Date.now());

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

  const reportPhishing = async (data: any) => {
    // In a real app, this would send to a backend API
    console.log('Phishing report submitted:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // You could send this to a Discord webhook or a dedicated security endpoint
    try {
      await fetch('/api/security/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PHISHING_REPORT',
          timestamp: new Date().toISOString(),
          ...data,
          securityContext: {
            isBot,
            isTampered,
            userAgent: navigator.userAgent,
            timeOnPage: (Date.now() - startTime) / 1000
          }
        })
      });
    } catch (error) {
      console.error('Failed to submit phishing report:', error);
    }
  };

  return (
    <SecurityContext.Provider value={{ isBot, isTampered, reportPhishing }}>
      {isTampered && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-1 z-[9999] text-xs font-bold uppercase tracking-widest">
          Security Alert: Application Integrity Compromised
        </div>
      )}
      {children}
    </SecurityContext.Provider>
  );
};
