import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, subtitle, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ?
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-line bg-base-850 shadow-2xl"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}>
          
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-100">{title}</h2>
                {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200">
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto px-5 py-4">{children}</div>
            {footer ? <div className="border-t border-line px-5 py-3">{footer}</div> : null}
          </motion.div>
        </div> :
      null}
    </AnimatePresence>);

}