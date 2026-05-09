import { useState } from 'react';
import { AnimatedAIChat } from './animated-ai-chat';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-28 right-8 z-50 w-[400px] h-[600px] max-w-[calc(100vw-40px)] max-h-[calc(100vh-140px)] bg-surface-container-low border border-surface-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="bg-surface-container-high border-b border-surface-variant p-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
                <h3 className="font-headline-md text-headline-md text-on-surface text-base">Investify AI</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="material-symbols-outlined text-outline hover:text-white transition-colors"
              >
                close
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <AnimatedAIChat isPopover={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 bg-primary-container text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-2 group"
      >
        <span className="material-symbols-outlined">{isOpen ? 'close' : 'smart_toy'}</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-bold text-sm">
          {isOpen ? 'Close' : 'AI Chat'}
        </span>
      </button>
    </>
  );
}
