import { buttonCommonClasses, actionButtonClasses } from '../customStyle/style';
import type { ButtonProps } from '../typescript/interface';

export default function Button({
  children,
  onClick,
  disabled = false,
  ariaDisabled = false,
  pressed,
  className = '',
  ariaLabel,
  onMouseDown,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={ariaDisabled}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onMouseDown={onMouseDown}
      className={`${buttonCommonClasses} ${actionButtonClasses} ${className}`}
    >
      {children}
    </button>
  );
}
