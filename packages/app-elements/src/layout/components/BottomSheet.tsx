import { useState, useEffect, useCallback, type FC, type ReactNode } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  noOverlay?: boolean;
  dark?: boolean;
}

export const BottomSheet: FC<BottomSheetProps> = ({ open, onClose, title, children, noOverlay, dark }) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (visible && !noOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visible, noOverlay]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!visible) return null;

  const animClass = closing ? 'bottom-sheet--closing' : '';

  if (noOverlay) {
    return (
      <div className={`bottom-sheet bottom-sheet--no-overlay ${animClass}`} data-theme={dark ? 'dark' : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet__header">
          <div className="bottom-sheet__handle" />
          <span className="bottom-sheet__title">{title}</span>
          <button className="bottom-sheet__close" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="bottom-sheet__body">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`bottom-sheet__overlay ${closing ? 'bottom-sheet__overlay--closing' : ''}`} onClick={handleClose}>
      <div className={`bottom-sheet ${animClass}`} data-theme={dark ? 'dark' : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet__header">
          <div className="bottom-sheet__handle" />
          <span className="bottom-sheet__title">{title}</span>
          <button className="bottom-sheet__close" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="bottom-sheet__body">
          {children}
        </div>
      </div>
    </div>
  );
};
