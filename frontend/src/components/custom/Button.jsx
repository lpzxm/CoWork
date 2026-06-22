import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SIZES, CONTROL_SIZES } from '../ui/utils/constant';
import Spinner from '../ui/Spinner';

/* -------------------------------------------------------------
|  Dictionaries
| ------------------------------------------------------------ */
const SIZE_CLASS = {
  [SIZES.XL]:  [`h-${CONTROL_SIZES.xl}`,  'px-3  py-3  text-xl'],
  [SIZES.LG]:  [`h-${CONTROL_SIZES.lg}`,  'px-3  py-2  text-base'],
  [SIZES.MD]:  [`h-${CONTROL_SIZES.md}`,  'px-3  py-2'],
  [SIZES.SM]:  [`h-${CONTROL_SIZES.sm}`,  'px-2  py-2  text-sm'],
  [SIZES.XS]:  [`h-${CONTROL_SIZES.xs}`,  'px-1  py-1  text-xs'],
};

const SIZE_ICON = {
  [SIZES.XL]:  'text-xl',
  [SIZES.LG]:  'text-xl',
  [SIZES.MD]:  'text-xl',
  [SIZES.SM]:  'text-lg',
  [SIZES.XS]:  'text-lg',
};

const SHAPE_CLASS = {
  round : 'rounded-md',
  circle: 'rounded-full',
  none  : '',
};

const COLOR_VAR = {
  primary  : '--c-primary',
  success  : '--c-success',
  warning  : '--c-warning',
  danger   : '--c-danger',
  info     : '--c-info',
  secondary: '--c-secondary',
  default  : '--c-surface-dark',
};

/* -------------------------------------------------------------
|  Variant helpers (all static → safe for Tailwind purge)
| ------------------------------------------------------------ */
const variantClasses = (colorKey, variant, active) => {
  const v = COLOR_VAR[colorKey] ?? '--c-primary';
  const base = {
    solid: [
      `bg-[var(${v})] text-white`,
      colorKey === 'secondary' && 'dark:text-black',
      active ? '' : 'hover:opacity-75',
      'active:opacity-100',
    ],
    twoTone: [
      `bg-[var(${v})] bg-opacity-10 text-[var(${v})]`,
      active
        ? ''
        : [`hover:bg-[var(${v})]`, 'hover:bg-opacity-25'],
      [`active:bg-[var(${v})]`, 'active:bg-opacity-50'],
    ],
    plain: [
      `text-[var(${v})] border border-[var(${v})]`,
      active ? '' : [`hover:bg-[var(${v})]`, 'hover:bg-opacity-10', 'hover:text-[var(--c-surface)]'], 
      ['active:opacity-25'],
    ],
    default: [
      'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600',
      active ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-600',
      'active:bg-gray-100 dark:active:bg-gray-500',
      'text-gray-700 dark:text-gray-100',
    ],
  };
  return base[variant] ?? base.default;
};

/* -------------------------------------------------------------
|  Component
| ------------------------------------------------------------ */
const Button = React.forwardRef(
  (
    {
      type          = 'button',
      children,
      size          = SIZES.MD,
      color         = 'primary',
      twColor       = null,
      shape         = 'round',
      variant       = 'default',
      block         = false,
      icon,
      className     = '',
      disabled      = false,
      loading       = false,
      active        = false,
      onClick,
      ...rest
    },
    ref,
  ) => {

    /* ------- compose classes -------------------------------- */
    const sizeClass   = SIZE_CLASS[size] ?? SIZE_CLASS[SIZES.MD];
    const shapeClass  = SHAPE_CLASS[shape];
    const variantCls  = twColor ? variantClassesRaw(twColor, variant, active) : variantClasses(color,   variant, active);
    const disabledCls = disabled || loading ? 'opacity-30 cursor-not-allowed' : '';
    
    /* -------------------------------------------------------------
    |  Raw-Tailwind colour helper (twColor)
    |  ------------------------------------------------------------ */
    function variantClassesRaw(twColor, variant, active) {
      const [hue, shade] = twColor.split('-');
      const toNum = n => parseInt(n, 10);

      const adjust = (s, step) =>
        Math.min(900, Math.max(50, toNum(s) + step)).toString();

      const base = {
        solid: [
          `bg-${hue}-${shade} text-white`,
          active ? '' : `hover:bg-${hue}-${adjust(shade, 100)}`,
          `active:bg-${hue}-${adjust(shade, 200)}`,
        ],
        twoTone: [
          `bg-${hue}-${adjust(shade, -400)} text-${hue}-${shade}`,
          active ? '' : `hover:bg-${hue}-${adjust(shade, -300)}`,
          `active:bg-${hue}-${adjust(shade, -200)}`,
        ],
        plain: [
          `text-${hue}-${shade}`,
          active ? '' : [
            `hover:bg-${hue}-${adjust(shade, -450)}`,
            'hover:bg-opacity-10',
          ],
          [
            `active:bg-${hue}-${adjust(shade, -400)}`,
            'active:bg-opacity-15',
          ],
        ],
        default: [
          'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600',
          active ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-600',
          'active:bg-gray-100 dark:active:bg-gray-500',
          'text-gray-700 dark:text-gray-100',
        ],
      };
      return base[variant] ?? base.default;
    }

    const classes = classNames(
      'inline-flex items-center justify-center font-medium transition focus:outline-none font-semibold',
      sizeClass,
      shapeClass,
      variantCls,
      disabledCls,
      block && 'w-full',
      className,
    );

    /* ------- event guard ------------------------------------ */
    const triggerButtonAction = e => {
      if (disabled || loading) return e.preventDefault();
      onClick?.(e);
    };

    /* ------- content ---------------------------------------- */
    let buttonContent = children;

    if (loading) {
      buttonContent = children ? (
        <span className="flex items-center gap-2">
          <Spinner enableTheme={false} />
          {children}
        </span>
      ) : (
        <Spinner enableTheme={false} />
      );
    } else if (icon && !children) {
      buttonContent = <span className={SIZE_ICON[size]}>{icon}</span>;
    } else if (icon && children) {
      buttonContent = (
        <span className="flex items-center gap-2">
          <span className="text-md">{icon}</span>
          <span className="">{children}</span>
        </span>
      );
    }

    /* ------- render ----------------------------------------- */
    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        onClick={triggerButtonAction}
        {...rest}
      >
        {buttonContent}
      </button>
    );
  },
);

/* -------------------------------------------------------------
|  PropTypes
| ------------------------------------------------------------ */
Button.propTypes = {
  type     : PropTypes.string,
  disabled : PropTypes.bool,
  loading  : PropTypes.bool,
  block    : PropTypes.bool,
  shape    : PropTypes.oneOf(['round', 'circle', 'none']),
  className: PropTypes.string,
  size     : PropTypes.oneOf([SIZES.XL, SIZES.LG, SIZES.MD, SIZES.SM, SIZES.XS]),
  color    : PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info', 'secondary','default']),
  twColor  : PropTypes.string,
  variant  : PropTypes.oneOf(['solid', 'twoTone', 'plain', 'default']),
  icon     : PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  active   : PropTypes.bool,
  onClick  : PropTypes.func,
};

export default Button;