import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

/**
 * Premium slide-in notification for reservation confirmation.
 */
export default function ReservationConfirmedPopup({ reservation, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entry animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-dismiss after 8 seconds
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation before unmounting
    setTimeout(onClose, 500);
  };

  if (!reservation) return null;

  return (
    <div 
      className={`fixed top-6 right-6 z-[9999] w-96 transform transition-all duration-500 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
      }`}
    >
      <div className="bg-gray-900 dark:bg-black border-2 border-brand-gold/50 rounded-2xl p-5 shadow-2xl shadow-brand-gold/20 backdrop-blur-xl relative overflow-hidden group">
        {/* Animated Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent pointer-events-none" />
        
        <div className="flex gap-4 relative z-10">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 ring-1 ring-green-500/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-black text-lg tracking-tight mb-1">
              Your Reservation is Confirmed!
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Table <span className="text-brand-gold font-bold">{reservation.tableNumber || reservation.tableId}</span> is reserved for you on 
              <span className="text-white font-medium"> {reservation.reservationDate}</span> at 
              <span className="text-white font-medium"> {reservation.startTime}</span>. See you soon!
            </p>
            
            <button
              onClick={handleClose}
              className="px-4 py-1.5 bg-brand-gold text-black text-xs font-black uppercase tracking-widest rounded-lg hover:bg-white transition-colors"
            >
              Got it!
            </button>
          </div>

          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CSS Animation for sliding from top-right */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slideIn {
            from { transform: translateX(100%) translateY(-20px); opacity: 0; }
            to { transform: translateX(0) translateY(0); opacity: 1; }
          }
        `}} />
      </div>
    </div>
  );
}
