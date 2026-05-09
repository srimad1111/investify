import { useState } from 'react';

export function StockLogo({ symbol, className = "w-8 h-8 rounded-full" }) {
  const [error, setError] = useState(false);
  const token = "pk_VLNuAPHhTy24yiqXhqvkAg"; // Logo.dev API key
  
  // Clean symbol for Logo.dev (sometimes requires just the ticker, but we will pass it as is first)
  const logoUrl = `https://img.logo.dev/ticker/${symbol}?token=${token}`;
  
  if (error) {
    // Fallback to initial letter avatar
    return (
      <div className={`${className} bg-primary-container/20 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase`}>
        {symbol.charAt(0)}
      </div>
    );
  }
  
  return (
    <img 
      src={logoUrl} 
      alt={`${symbol} logo`} 
      onError={() => setError(true)}
      className={`${className} object-cover bg-surface-container-lowest shrink-0 border border-surface-variant`}
    />
  );
}
