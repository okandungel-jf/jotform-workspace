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
  aiHref?: string;
  templatesHref?: string;
  upgradeHref?: string;
  label?: string;
}

interface PromptSuggestion {
  label: string;
  prompt: string;
}

const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  { label: 'Online store', prompt: 'An online store for selling handmade products with cart and checkout' },
  { label: 'Event signup', prompt: 'A signup form for an upcoming workshop with date and capacity' },
  { label: 'Lead capture', prompt: 'A lead capture form for new customers with email and phone' },
  { label: 'Booking app', prompt: 'A booking app for a service business with calendar and time slots' },
];

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

const JotformAiLogo: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`attribution-modal__brand-logo${className ? ` ${className}` : ''}`}
    viewBox="0 0 98 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Jotform AI"
  >
    <path
      d="M0.4 14.74L3.06 14.26V15.56C3.07333 16.2933 3.26 16.8333 3.62 17.18C3.99333 17.5133 4.46 17.68 5.02 17.68C5.60667 17.68 6.06667 17.4933 6.4 17.12C6.73333 16.7467 6.9 16.2467 6.9 15.62V5.82H9.66V15.62C9.66 16.26 9.54667 16.8667 9.32 17.44C9.10667 18 8.79333 18.4933 8.38 18.92C7.98 19.3467 7.49333 19.6867 6.92 19.94C6.36 20.18 5.73333 20.3 5.04 20.3C4.33333 20.3 3.69333 20.1933 3.12 19.98C2.56 19.7533 2.07333 19.44 1.66 19.04C1.26 18.6267 0.946667 18.14 0.72 17.58C0.506667 17.0067 0.4 16.3733 0.4 15.68V14.74ZM16.8752 17.88C17.1952 17.88 17.5085 17.82 17.8152 17.7C18.1218 17.58 18.3885 17.4067 18.6152 17.18C18.8418 16.94 19.0218 16.6467 19.1552 16.3C19.3018 15.9533 19.3752 15.5467 19.3752 15.08C19.3752 14.6133 19.3018 14.2067 19.1552 13.86C19.0218 13.5133 18.8418 13.2267 18.6152 13C18.3885 12.76 18.1218 12.58 17.8152 12.46C17.5085 12.34 17.1952 12.28 16.8752 12.28C16.5552 12.28 16.2418 12.34 15.9352 12.46C15.6285 12.58 15.3618 12.76 15.1352 13C14.9085 13.2267 14.7218 13.5133 14.5752 13.86C14.4418 14.2067 14.3752 14.6133 14.3752 15.08C14.3752 15.5467 14.4418 15.9533 14.5752 16.3C14.7218 16.6467 14.9085 16.94 15.1352 17.18C15.3618 17.4067 15.6285 17.58 15.9352 17.7C16.2418 17.82 16.5552 17.88 16.8752 17.88ZM16.8752 9.86C17.6085 9.86 18.2885 9.99333 18.9152 10.26C19.5552 10.5133 20.1018 10.8733 20.5552 11.34C21.0218 11.7933 21.3818 12.34 21.6352 12.98C21.9018 13.62 22.0352 14.32 22.0352 15.08C22.0352 15.84 21.9018 16.54 21.6352 17.18C21.3818 17.8067 21.0218 18.3533 20.5552 18.82C20.1018 19.2867 19.5552 19.6533 18.9152 19.92C18.2885 20.1733 17.6085 20.3 16.8752 20.3C16.1418 20.3 15.4552 20.1733 14.8152 19.92C14.1885 19.6533 13.6418 19.2867 13.1752 18.82C12.7218 18.3533 12.3618 17.8067 12.0952 17.18C11.8418 16.54 11.7152 15.84 11.7152 15.08C11.7152 14.32 11.8418 13.62 12.0952 12.98C12.3618 12.34 12.7218 11.7933 13.1752 11.34C13.6418 10.8733 14.1885 10.5133 14.8152 10.26C15.4552 9.99333 16.1418 9.86 16.8752 9.86ZM27.3758 10.16H29.3558V12.52H27.3758V16.64C27.3758 17.0667 27.4691 17.3667 27.6558 17.54C27.8558 17.7 28.1491 17.78 28.5358 17.78C28.6958 17.78 28.8558 17.7733 29.0158 17.76C29.1758 17.7467 29.2891 17.7267 29.3558 17.7V19.9C29.2358 19.9533 29.0491 20.0067 28.7958 20.06C28.5558 20.1133 28.2424 20.14 27.8558 20.14C26.8958 20.14 26.1358 19.8733 25.5758 19.34C25.0158 18.8067 24.7358 18.06 24.7358 17.1V12.52H22.9558V10.16H23.4558C23.9758 10.16 24.3558 10.0133 24.5958 9.72C24.8491 9.41333 24.9758 9.04 24.9758 8.6V7.22H27.3758V10.16ZM36.1167 7.72C35.9701 7.72 35.8101 7.74 35.6367 7.78C35.4767 7.82 35.3301 7.89333 35.1967 8C35.0634 8.09333 34.9501 8.22667 34.8567 8.4C34.7767 8.57333 34.7367 8.8 34.7367 9.08V10.16H36.9567V12.44H34.7367V20H32.0567V12.44H30.4167V10.16H32.0567V9.04C32.0567 8.48 32.1367 7.98 32.2967 7.54C32.4701 7.08667 32.7101 6.7 33.0167 6.38C33.3367 6.06 33.7167 5.81333 34.1567 5.64C34.5967 5.46667 35.0901 5.38 35.6367 5.38C35.9167 5.38 36.1767 5.4 36.4167 5.44C36.6701 5.48 36.8501 5.52667 36.9567 5.58V7.82C36.8901 7.79333 36.7901 7.77333 36.6567 7.76C36.5234 7.73333 36.3434 7.72 36.1167 7.72ZM42.8908 17.88C43.2108 17.88 43.5241 17.82 43.8308 17.7C44.1374 17.58 44.4041 17.4067 44.6308 17.18C44.8574 16.94 45.0374 16.6467 45.1708 16.3C45.3174 15.9533 45.3908 15.5467 45.3908 15.08C45.3908 14.6133 45.3174 14.2067 45.1708 13.86C45.0374 13.5133 44.8574 13.2267 44.6308 13C44.4041 12.76 44.1374 12.58 43.8308 12.46C43.5241 12.34 43.2108 12.28 42.8908 12.28C42.5708 12.28 42.2574 12.34 41.9508 12.46C41.6441 12.58 41.3774 12.76 41.1508 13C40.9241 13.2267 40.7374 13.5133 40.5908 13.86C40.4574 14.2067 40.3908 14.6133 40.3908 15.08C40.3908 15.5467 40.4574 15.9533 40.5908 16.3C40.7374 16.6467 40.9241 16.94 41.1508 17.18C41.3774 17.4067 41.6441 17.58 41.9508 17.7C42.2574 17.82 42.5708 17.88 42.8908 17.88ZM42.8908 9.86C43.6241 9.86 44.3041 9.99333 44.9308 10.26C45.5708 10.5133 46.1174 10.8733 46.5708 11.34C47.0374 11.7933 47.3974 12.34 47.6508 12.98C47.9174 13.62 48.0508 14.32 48.0508 15.08C48.0508 15.84 47.9174 16.54 47.6508 17.18C47.3974 17.8067 47.0374 18.3533 46.5708 18.82C46.1174 19.2867 45.5708 19.6533 44.9308 19.92C44.3041 20.1733 43.6241 20.3 42.8908 20.3C42.1574 20.3 41.4708 20.1733 40.8308 19.92C40.2041 19.6533 39.6574 19.2867 39.1908 18.82C38.7374 18.3533 38.3774 17.8067 38.1108 17.18C37.8574 16.54 37.7308 15.84 37.7308 15.08C37.7308 14.32 37.8574 13.62 38.1108 12.98C38.3774 12.34 38.7374 11.7933 39.1908 11.34C39.6574 10.8733 40.2041 10.5133 40.8308 10.26C41.4708 9.99333 42.1574 9.86 42.8908 9.86ZM56.1505 12.8C55.8838 12.7467 55.6171 12.72 55.3505 12.72C55.0038 12.72 54.6771 12.7667 54.3705 12.86C54.0638 12.9533 53.7971 13.1067 53.5705 13.32C53.3438 13.5333 53.1571 13.82 53.0105 14.18C52.8771 14.5267 52.8105 14.9667 52.8105 15.5V20H50.1505V10.16H52.7305V11.62C52.8771 11.3 53.0638 11.04 53.2905 10.84C53.5305 10.6267 53.7771 10.4667 54.0305 10.36C54.2971 10.2533 54.5571 10.18 54.8105 10.14C55.0771 10.1 55.3171 10.08 55.5305 10.08C55.6371 10.08 55.7371 10.0867 55.8305 10.1C55.9371 10.1 56.0438 10.1067 56.1505 10.12V12.8ZM58.0216 20V10.16H60.5616V11.36C60.6949 11.12 60.8682 10.9067 61.0816 10.72C61.2949 10.5333 61.5282 10.38 61.7816 10.26C62.0482 10.14 62.3216 10.0467 62.6016 9.98C62.8949 9.91333 63.1749 9.88 63.4416 9.88C64.1216 9.88 64.7149 10.02 65.2216 10.3C65.7282 10.58 66.1082 10.9867 66.3616 11.52C66.7482 10.92 67.2016 10.5 67.7216 10.26C68.2416 10.0067 68.8282 9.88 69.4816 9.88C69.9349 9.88 70.3749 9.95333 70.8016 10.1C71.2282 10.2333 71.6082 10.4533 71.9416 10.76C72.2749 11.0667 72.5416 11.46 72.7416 11.94C72.9416 12.4067 73.0416 12.9667 73.0416 13.62V20H70.4616V14.16C70.4616 13.6267 70.3216 13.1867 70.0416 12.84C69.7749 12.48 69.3349 12.3 68.7216 12.3C68.1482 12.3 67.7016 12.4933 67.3816 12.88C67.0616 13.2533 66.9016 13.7067 66.9016 14.24V20H64.2616V14.16C64.2616 13.6267 64.1216 13.1867 63.8416 12.84C63.5616 12.48 63.1216 12.3 62.5216 12.3C61.9349 12.3 61.4816 12.4867 61.1616 12.86C60.8416 13.2333 60.6816 13.6933 60.6816 14.24V20H58.0216Z"
      fill="var(--fg-primary)"
    />
    <path
      d="M79 10.5C79 7.18629 81.6863 4.5 85 4.5H92C95.3137 4.5 98 7.18629 98 10.5V14.5C98 17.8137 95.3137 20.5 92 20.5H81C79.8954 20.5 79 19.6046 79 18.5V10.5Z"
      fill="var(--bg-fill-brand)"
    />
    <path
      d="M90.6973 17.2275H88.4307L87.8555 15.3945H84.8408L84.2666 17.2275H82L84.9443 8.5H87.7529L90.6973 17.2275ZM93.627 17.2275H91.5176V8.5H93.627V17.2275ZM85.3428 13.793H87.3525L86.3809 10.6992H86.3125L85.3428 13.793Z"
      fill="var(--fg-inverse)"
    />
  </svg>
);

interface AttributionModalProps {
  open: boolean;
  onClose: () => void;
  aiHref: string;
  templatesHref: string;
  anchorRef: RefObject<HTMLElement | null>;
}

interface RemoveBrandingModalProps {
  open: boolean;
  onClose: () => void;
  upgradeHref: string;
  anchorRef: RefObject<HTMLElement | null>;
}

const RemoveBrandingModal: FC<RemoveBrandingModalProps> = ({ open, onClose, upgradeHref, anchorRef }) => {
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
        <h2 className="attribution-modal__title">
          Remove Jotform branding?
        </h2>
        <p className="attribution-modal__subtitle">
          Upgrade your account to remove it.
        </p>
        <div className="attribution-modal__actions">
          <Button
            variant="Default"
            size="Small"
            fullWidth
            leftIcon="none"
            rightIcon="none"
            label="Upgrade your account"
            onClick={() => openExternal(upgradeHref)}
          />
          <Button
            variant="Outlined"
            size="Small"
            fullWidth
            leftIcon="none"
            rightIcon="none"
            label="No, thanks"
            onClick={onClose}
          />
        </div>
      </div>
    </div>,
    target.container,
  );
};

const AttributionModal: FC<AttributionModalProps> = ({ open, onClose, aiHref, templatesHref, anchorRef }) => {
  const [target, setTarget] = useState<{ container: HTMLElement; mode: PreviewMode } | null>(null);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (!open) {
      setTarget(null);
      setPrompt('');
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

  const handleGenerate = () => {
    openExternal(aiHref);
  };

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
          <JotformAiLogo />
        </div>
        <h2 className="attribution-modal__title">
          Make your own app <span className="attribution-modal__title-accent">with AI</span>
        </h2>
        <p className="attribution-modal__subtitle">
          Turn ideas into apps in minutes — no coding needed.
        </p>
        <textarea
          className="attribution-modal__prompt"
          placeholder="e.g. A booking app for my yoga studio with calendar and payments…"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="attribution-modal__suggestions">
          {PROMPT_SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              className="attribution-modal__chip"
              onClick={() => setPrompt(s.prompt)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="attribution-modal__actions">
          <Button
            variant="Default"
            size="Small"
            fullWidth
            leftIcon="Sparkles"
            rightIcon="none"
            label="Generate with AI"
            onClick={handleGenerate}
          />
          <Button
            variant="Outlined"
            size="Small"
            fullWidth
            leftIcon="none"
            rightIcon="none"
            label="See Templates"
            onClick={() => openExternal(templatesHref)}
          />
        </div>
      </div>
    </div>,
    target.container,
  );
};

export const AttributionBar: FC<AttributionBarProps> = ({
  aiHref = 'https://www.jotform.com/ai/app-generator/?utm_source=app-builder&utm_medium=attribution&utm_campaign=ai-prompt',
  templatesHref = 'https://www.jotform.com/app-templates/?utm_source=app-builder&utm_medium=attribution&utm_campaign=templates',
  upgradeHref = 'https://www.jotform.com/pricing/?utm_source=app-builder&utm_medium=attribution&utm_campaign=remove-branding',
  label = 'Built with Jotform',
}) => {
  const [open, setOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="attribution-bar" ref={wrapperRef}>
        <div className="attribution-bar__pill-wrap">
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
          <button
            type="button"
            className="attribution-bar__remove"
            onClick={(e) => {
              e.stopPropagation();
              setRemoveOpen(true);
            }}
            aria-label="Remove Jotform branding"
          >
            <Icon name="X" size={12} />
          </button>
        </div>
      </div>
      <AttributionModal
        open={open}
        onClose={() => setOpen(false)}
        aiHref={aiHref}
        templatesHref={templatesHref}
        anchorRef={wrapperRef}
      />
      <RemoveBrandingModal
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        upgradeHref={upgradeHref}
        anchorRef={wrapperRef}
      />
    </>
  );
};
