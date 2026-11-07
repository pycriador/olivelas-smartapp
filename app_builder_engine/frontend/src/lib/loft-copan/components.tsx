import React from 'react';
import {
  Button as AntButton,
  Card as AntCard,
  Checkbox as AntCheckbox,
  Input as AntInput,
  Alert as AntAlert,
  Tag as AntTag,
  Spin as AntSpin,
} from 'antd';
import { color, spacing } from './tokens';

const resolveSpace = (token?: string | number): string | number | undefined => {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return (spacing as Record<string, string>)[token] || token;
};

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  flexDirection?: React.CSSProperties['flexDirection'];
  alignItems?: React.CSSProperties['alignItems'];
  justifyContent?: React.CSSProperties['justifyContent'];
  flexWrap?: React.CSSProperties['flexWrap'];
  gap?: string | number;
  p?: string | number;
}

export const Flex: React.FC<FlexProps> = ({
  as: Component = 'div',
  flexDirection = 'row',
  alignItems,
  justifyContent,
  flexWrap,
  gap,
  p,
  style,
  children,
  ...rest
}) => (
  <Component
    style={{
      display: 'flex',
      flexDirection,
      alignItems,
      justifyContent,
      flexWrap,
      gap: resolveSpace(gap),
      padding: resolveSpace(p),
      ...style,
    }}
    {...rest}
  >
    {children}
  </Component>
);

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthMap: Record<string, number> = {
  xs: 460,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const Container: React.FC<ContainerProps> = ({ maxWidth = 'lg', style, children, ...rest }) => (
  <div
    style={{
      width: '100%',
      maxWidth: maxWidthMap[maxWidth] || 1024,
      margin: '0 auto',
      padding: '0 16px',
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

export const UISpacer: React.FC<{ xs?: string | number }> = ({ xs = 'base04' }) => (
  <div style={{ height: resolveSpace(xs), width: '100%' }} />
);

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  textStyle?: string;
  variant?: 'primary' | 'secondary' | 'muted' | 'brand';
}

export const Typography: React.FC<TypographyProps> = ({
  as: Component = 'span',
  textStyle = 'paragraph-md',
  variant = 'primary',
  style,
  children,
  ...rest
}) => {
  const fontMap: Record<string, React.CSSProperties> = {
    hero: { fontSize: 36, fontWeight: 800, lineHeight: 1.2 },
    h1: { fontSize: 28, fontWeight: 700, lineHeight: 1.25 },
    h2: { fontSize: 24, fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: 20, fontWeight: 600, lineHeight: 1.35 },
    h4: { fontSize: 16, fontWeight: 600, lineHeight: 1.4 },
    subtitle: { fontSize: 15, fontWeight: 500, lineHeight: 1.45 },
    'paragraph-lg': { fontSize: 16, fontWeight: 400, lineHeight: 1.5 },
    'paragraph-md': { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
    'paragraph-sm': { fontSize: 13, fontWeight: 400, lineHeight: 1.45 },
    'label-md': { fontSize: 14, fontWeight: 600, lineHeight: 1.4 },
    'label-sm': { fontSize: 12, fontWeight: 600, lineHeight: 1.4 },
    caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.4 },
  };
  const colorMap: Record<string, string> = {
    primary: color.text.primary,
    secondary: color.text.secondary,
    muted: color.text.muted,
    brand: color.text.brand,
  };
  return (
    <Component
      style={{
        margin: 0,
        color: colorMap[variant] || color.text.primary,
        ...(fontMap[textStyle] || fontMap['paragraph-md']),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export interface CardProps {
  id?: string;
  title?: React.ReactNode;
  overline?: React.ReactNode;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ id, title, style, children }) => (
  <AntCard
    id={id}
    title={title}
    style={{
      borderRadius: 12,
      border: `1px solid ${color.separator.main}`,
      boxShadow: '0 8px 24px rgba(18, 22, 25, 0.06)',
      ...style,
    }}
  >
    {children}
  </AntCard>
);

export const FeedbackBanner: React.FC<{
  state?: 'positive' | 'negative' | 'warning' | 'informative';
  children?: React.ReactNode;
}> = ({ state = 'informative', children }) => {
  const typeMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
    positive: 'success',
    negative: 'error',
    warning: 'warning',
    informative: 'info',
  };
  return <AntAlert type={typeMap[state] || 'info'} message={children} showIcon style={{ borderRadius: 8 }} />;
};

export interface TextFieldProps {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addonBefore?: React.ReactNode;
  error?: boolean;
  helperText?: React.ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  name,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  addonBefore,
  error,
  helperText,
  required,
  fullWidth,
  disabled,
}) => {
  const InputComp = type === 'password' ? AntInput.Password : AntInput;
  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: color.text.primary,
          }}
        >
          {label}
          {required && <span style={{ color: color.feedback.negative.main, marginLeft: 4 }}>*</span>}
        </label>
      )}
      <InputComp
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        prefix={addonBefore}
        status={error ? 'error' : undefined}
        disabled={disabled}
        size="large"
        style={{ borderRadius: 8, width: fullWidth ? '100%' : undefined }}
      />
      {helperText && (
        <div style={{ marginTop: 4, fontSize: 12, color: error ? color.feedback.negative.main : color.text.secondary }}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export interface CheckboxProps {
  id?: string;
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (event: { target: { checked: boolean } }) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => (
  <AntCheckbox
    id={id}
    checked={checked}
    onChange={(e) => onChange?.({ target: { checked: e.target.checked } })}
  >
    {label}
  </AntCheckbox>
);

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  type = 'button',
  loading,
  disabled,
  fullWidth,
  icon,
  onClick,
  children,
}) => {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  return (
    <AntButton
      type={isPrimary ? 'primary' : 'default'}
      danger={isDanger}
      htmlType={type}
      loading={loading}
      disabled={disabled}
      icon={icon}
      block={fullWidth}
      onClick={onClick}
      size="large"
      style={{
        borderRadius: 8,
        height: 44,
        fontWeight: 600,
        ...(isPrimary
          ? { background: color.background.brand, borderColor: color.background.brand, color: '#FFFFFF' }
          : {}),
      }}
    >
      {children}
    </AntButton>
  );
};

export const Link: React.FC<{
  href?: string;
  variant?: string;
  textStyle?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  children?: React.ReactNode;
}> = ({ href = '#', onClick, children }) => (
  <a
    href={href}
    onClick={onClick}
    style={{
      color: color.background.brand,
      fontWeight: 600,
      fontSize: 13,
      textDecoration: 'none',
    }}
  >
    {children}
  </a>
);

export const Logo: React.FC = () => (
  <div
    style={{
      width: 48,
      height: 48,
      background: color.background.brand,
      borderRadius: 12,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
      fontWeight: 800,
      fontSize: 24,
      boxShadow: '0 6px 16px rgba(255, 119, 74, 0.28)',
    }}
  >
    O
  </div>
);

export const Tag: React.FC<{ state?: string; children?: React.ReactNode }> = ({ state, children }) => (
  <AntTag color={state === 'positive' ? 'success' : 'default'}>{children}</AntTag>
);

export const CircularLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => (
  <AntSpin size={size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'default'} />
);
