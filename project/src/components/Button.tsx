import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'gold' | 'outline' | 'light';

type ButtonProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  type?: 'button' | 'submit';
  ariaLabel?: string;
};

const variantMap: Record<Variant, string> = {
  primary: 'btn-primary',
  gold: 'btn-gold',
  outline: 'btn-outline',
  light:
    'btn bg-white text-mint-dark shadow-luxe-sm hover:bg-mint-dark hover:text-white hover:shadow-luxe',
};

export default function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  className = '',
  arrow = false,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  const classes = `${variantMap[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <motion.span
          className="inline-flex"
          initial={false}
          whileHover={{ x: 4 }}
        >
          <ArrowRight size={16} strokeWidth={2.2} />
        </motion.span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.97 }}
    >
      {content}
    </motion.button>
  );
}
