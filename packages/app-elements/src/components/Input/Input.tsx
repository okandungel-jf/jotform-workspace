import { type FC, type KeyboardEvent, type ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import './Input.scss';

export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  /** Render a textarea instead of a single-line input (e.g. a message composer). */
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  /** Leading icon name (app-elements Icon). */
  leftIcon?: string;
  /** Trailing node — e.g. a send Button in the composer. */
  rightSlot?: ReactNode;
  ariaLabel?: string;
  className?: string;
  onChange?: (value: string) => void;
  /** Fires on Enter for single-line inputs (Shift+Enter newlines in multiline). */
  onSubmit?: () => void;
}

export const Input: FC<InputProps> = ({
  value,
  defaultValue,
  placeholder,
  multiline = false,
  rows = 1,
  disabled = false,
  leftIcon,
  rightSlot,
  ariaLabel,
  className,
  onChange,
  onSubmit,
}) => {
  const classes = [
    'jf-input',
    multiline && 'jf-input--multiline',
    disabled && 'jf-input--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;
    // Multiline: Enter newlines, Cmd/Ctrl+Enter submits. Single-line: Enter submits.
    if (multiline ? e.metaKey || e.ctrlKey : !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  const shared = {
    className: 'jf-input__control',
    placeholder,
    disabled,
    'aria-label': ariaLabel,
    value,
    defaultValue,
    onKeyDown: onSubmit ? handleKeyDown : undefined,
    onChange: (e: { target: { value: string } }) => onChange?.(e.target.value),
  };

  return (
    <div className={classes}>
      {leftIcon && <Icon name={leftIcon} size={18} className="jf-input__left-icon" />}
      {multiline ? (
        <textarea {...shared} rows={rows} />
      ) : (
        <input {...shared} type="text" />
      )}
      {rightSlot && <div className="jf-input__right-slot">{rightSlot}</div>}
    </div>
  );
};

export default Input;
