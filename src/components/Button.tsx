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
  const dynamicClasses = pressed
    ? 'bg-indigo-400 text-white'
    : 'bg-indigo-100 hover:bg-indigo-200';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={ariaDisabled}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onMouseDown={onMouseDown}
      className={`${buttonCommonClasses} ${actionButtonClasses} ${dynamicClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}
