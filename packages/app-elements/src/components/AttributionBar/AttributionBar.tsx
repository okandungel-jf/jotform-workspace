import { useEffect, useRef, useState, type FC, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button';
import './AttributionBar.scss';

const openExternal = (href: string) => {
  window.open(href, '_blank', 'noopener,noreferrer');
};

type PreviewMode = 'phone' | 'tablet' | 'desktop';

const CONTAINER_MODE_MAP: Record<string, PreviewMode> = {
  'live-preview__phone-screen': 'phone',
  'live-preview__tablet-screen': 'tablet',
  'app-preview-screen__desktop': 'desktop',
};

const findPreviewContainer = (
  start: HTMLElement | null,
): { container: HTMLElement; mode: PreviewMode } | null => {
  let el: HTMLElement | null = start;
  while (el) {
    for (const cls of Object.keys(CONTAINER_MODE_MAP)) {
      if (el.classList.contains(cls)) {
        return { container: el, mode: CONTAINER_MODE_MAP[cls] };
      }
    }
    el = el.parentElement;
  }
  return null;
};

export interface AttributionBarProps {
  ctaHref?: string;
  templatesHref?: string;
  label?: string;
}

const JotformLogomark: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M3.66683 12.3112C2.67356 11.3244 2.67356 9.7245 3.66683 8.7377L9.69954 2.7401C10.6928 1.7533 12.3032 1.7533 13.2965 2.7401C14.2898 3.7269 14.2898 5.32682 13.2965 6.31362L7.26379 12.3112C6.27052 13.298 4.6601 13.298 3.66683 12.3112Z" />
    <path d="M7.46654 22.0002C8.00273 22.0002 8.26957 21.373 7.89197 21.0069L3.93471 17.1707C3.55711 16.8046 2.91016 17.0633 2.91016 17.5831V20.8361C2.91016 21.4779 3.44887 22.0002 4.11093 22.0002H7.46654Z" />
    <path d="M8.59847 13.0123C7.6052 13.9991 7.6052 15.5991 8.59847 16.5859C9.59174 17.5727 11.2022 17.5727 12.1954 16.5859L20.3467 8.48769C21.34 7.50089 21.34 5.90097 20.3467 4.91417C19.3534 3.92737 17.743 3.92737 16.7498 4.91417L8.59847 13.0123Z" />
    <path d="M13.1375 17.6862C12.1443 18.673 12.1443 20.2729 13.1375 21.2597C14.1308 22.2465 15.7412 22.2465 16.7345 21.2597L20.3192 17.6984C21.3125 16.7116 21.3125 15.1117 20.3192 14.1249C19.3259 13.1381 17.7155 13.1381 16.7222 14.1249L13.1375 17.6862Z" />
  </svg>
);

interface AttributionModalProps {
  open: boolean;
  onClose: () => void;
  ctaHref: string;
  templatesHref: string;
  anchorRef: RefObject<HTMLElement | null>;
}

const AttributionModal: FC<AttributionModalProps> = ({ open, onClose, ctaHref, templatesHref, anchorRef }) => {
  const [target, setTarget] = useState<{ container: HTMLElement; mode: PreviewMode } | null>(null);

  useEffect(() => {
    if (!open) {
      setTarget(null);
      return;
    }
    setTarget(findPreviewContainer(anchorRef.current));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, anchorRef]);

  if (!open || !target) return null;

  const isSheet = target.mode === 'phone' || target.mode === 'tablet';
  const overlayClass = `attribution-modal-overlay${isSheet ? ' attribution-modal-overlay--sheet' : ''}`;
  const modalClass = `attribution-modal${isSheet ? ' attribution-modal--sheet' : ''}`;

  return createPortal(
    <div className={overlayClass} onClick={onClose} role="dialog" aria-modal="true">
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="attribution-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="X" size={20} />
        </button>
        <div className="attribution-modal__brand">
          <JotformLogomark className="attribution-modal__brand-logo" />
          <span className="attribution-modal__brand-name">Jotform</span>
        </div>
        <h2 className="attribution-modal__title">
          Build apps like this <span className="attribution-modal__title-accent">in minutes</span>.
        </h2>
        <p className="attribution-modal__subtitle">
          No code, no setup. Drag, drop, and publish your own app — for your business, your team, or your community.
        </p>
        <div className="attribution-modal__actions">
          <Button
            variant="Default"
            fullWidth
            leftIcon="none"
            rightIcon="none"
            label="Try it now — It’s Free"
            onClick={() => openExternal(ctaHref)}
          />
          <Button
            variant="Outlined"
            fullWidth
            leftIcon="none"
            rightIcon="none"
            label="Browse templates"
            onClick={() => openExternal(templatesHref)}
          />
        </div>
      </div>
    </div>,
    target.container,
  );
};

export const AttributionBar: FC<AttributionBarProps> = ({
  ctaHref = 'https://www.jotform.com/products/app-builder/?utm_source=app-builder&utm_medium=attribution&utm_campaign=signup',
  templatesHref = 'https://www.jotform.com/app-templates/?utm_source=app-builder&utm_medium=attribution&utm_campaign=templates',
  label = 'Built with Jotform',
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="attribution-bar" ref={wrapperRef}>
        <button
          type="button"
          className="attribution-bar__pill"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <JotformLogomark className="attribution-bar__logo" />
          <span className="attribution-bar__label">{label}</span>
        </button>
      </div>
      <AttributionModal
        open={open}
        onClose={() => setOpen(false)}
        ctaHref={ctaHref}
        templatesHref={templatesHref}
        anchorRef={wrapperRef}
      />
    </>
  );
};
