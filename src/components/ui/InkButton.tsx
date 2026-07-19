// src/components/ui/InkButton.tsx
// 水墨按钮组件

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './InkButton.module.css';

export type InkButtonVariant = 'primary' | 'secondary' | 'ghost';
export type InkButtonSize = 'small' | 'medium' | 'large';

export interface InkButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: InkButtonVariant;
  size?: InkButtonSize;
  loading?: boolean;
  /** 左侧装饰（如图标、印章） */
  leftAdornment?: ReactNode;
  /** 右侧装饰 */
  rightAdornment?: ReactNode;
  /** 按钮文字 */
  children: ReactNode;
}

export const InkButton = forwardRef<HTMLButtonElement, InkButtonProps>(
  function InkButton(
    {
      variant = 'secondary',
      size = 'medium',
      loading = false,
      disabled = false,
      leftAdornment,
      rightAdornment,
      children,
      className,
      type = 'button',
      'aria-busy': ariaBusyProp,
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;
    const classes = [
      styles.btn,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      loading ? styles.loading : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || ariaBusyProp}
        className={classes}
        {...rest}
      >
        {loading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : leftAdornment ? (
          <span className={styles.adornment}>{leftAdornment}</span>
        ) : null}
        <span className={styles.label}>{children}</span>
        {rightAdornment && !loading ? (
          <span className={styles.adornment}>{rightAdornment}</span>
        ) : null}
      </button>
    );
  },
);