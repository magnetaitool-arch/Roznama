/* @ds-bundle: {"format":3,"namespace":"MagnetDesignSystem_862266","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"SectionLabel","sourcePath":"components/core/SectionLabel.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Divider","sourcePath":"components/surfaces/Divider.jsx"},{"name":"Stat","sourcePath":"components/surfaces/Stat.jsx"}],"sourceHashes":{"components/brand/Logo.jsx":"7bad2fd7e4e5","components/core/Badge.jsx":"9fdf5653f026","components/core/Button.jsx":"e64ac1af09fc","components/core/SectionLabel.jsx":"e4bdf814459a","components/core/Tag.jsx":"92ef2dcaacf2","components/forms/Input.jsx":"2925e499c91f","components/surfaces/Card.jsx":"ac0f233d9742","components/surfaces/Divider.jsx":"9fc596b89c94","components/surfaces/Stat.jsx":"5769c6c27f14","ui_kits/website/Contact.jsx":"f4915521cc21","ui_kits/website/Footer.jsx":"ce7d3d0ca963","ui_kits/website/Hero.jsx":"200af70c3734","ui_kits/website/Nav.jsx":"475e02c7e780","ui_kits/website/Proof.jsx":"c9130930c5c0","ui_kits/website/Services.jsx":"fdac8613c456"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MagnetDesignSystem_862266 = window.MagnetDesignSystem_862266 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Magnet wordmark lockup. Renders the brand logo image.
 *
 * Because the design-system bundle can be loaded from anywhere, pass `src`
 * pointing at wherever you copied the logo asset. Defaults assume the assets
 * live at `assets/` relative to the page.
 *
 *   variant="light" → white wordmark (for dark/black backgrounds)
 *   variant="dark"  → ink wordmark  (for paper/white backgrounds)
 */
function Logo({
  variant = 'light',
  height = 40,
  src,
  alt = 'Magnet',
  style = {},
  ...rest
}) {
  const defaults = {
    light: 'assets/magnet-logo.png',
    dark: 'assets/magnet-logo-dark.png'
  };
  return /*#__PURE__*/React.createElement("img", _extends({
    src: src || defaults[variant],
    alt: alt,
    style: {
      height: typeof height === 'number' ? `${height}px` : height,
      width: 'auto',
      display: 'block',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Small uppercase badge/label. Lime fill + black text, or solid/outline.
 */
function Badge({
  variant = 'lime',
  children,
  style = {},
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    lineHeight: 1,
    padding: '6px 12px',
    borderRadius: 'var(--radius-badge)',
    border: '1px solid transparent',
    whiteSpace: 'nowrap'
  };
  const variants = {
    lime: {
      background: 'var(--lime)',
      color: 'var(--magnet-black)'
    },
    dark: {
      background: 'var(--ink-700)',
      color: 'var(--lime)',
      borderColor: 'var(--ink-500)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-strong)',
      borderColor: 'currentColor'
    },
    paper: {
      background: 'var(--magnet-black)',
      color: 'var(--lime)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Magnet Button — bold, uppercase, confident.
 * Primary = lime fill + black text. Secondary = bordered. Ghost = text-only.
 */
function Button({
  variant = 'primary',
  size = 'md',
  as = 'button',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  fullWidth = false,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '10px 18px',
      fontSize: '12px',
      gap: '8px'
    },
    md: {
      padding: '15px 30px',
      fontSize: '13px',
      gap: '10px'
    },
    lg: {
      padding: '19px 40px',
      fontSize: '15px',
      gap: '12px'
    }
  };
  const base = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    lineHeight: 1,
    border: '2px solid transparent',
    borderRadius: 'var(--radius-button)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--on-accent)',
      borderColor: 'var(--accent)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-strong)',
      borderColor: 'currentColor'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-strong)',
      borderColor: 'transparent'
    },
    accentOutline: {
      background: 'transparent',
      color: 'var(--accent)',
      borderColor: 'var(--accent)'
    }
  };
  const Tag = as;
  const onEnter = e => {
    if (disabled) return;
    e.currentTarget.style.transform = 'translateY(-2px)';
    if (variant === 'primary') e.currentTarget.style.background = 'var(--white)';
    if (variant === 'secondary' || variant === 'ghost') e.currentTarget.style.background = 'rgba(255,255,255,.08)';
    if (variant === 'accentOutline') {
      e.currentTarget.style.background = 'var(--accent)';
      e.currentTarget.style.color = 'var(--on-accent)';
    }
  };
  const onLeave = e => {
    if (disabled) return;
    e.currentTarget.style.transform = 'translateY(0)';
    Object.assign(e.currentTarget.style, variants[variant]);
  };
  const onDown = e => {
    if (!disabled) e.currentTarget.style.transform = 'translateY(0) scale(.97)';
  };
  const onUp = e => {
    if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)';
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    disabled: as === 'button' ? disabled : undefined,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onMouseDown: onDown,
    onMouseUp: onUp
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionLabel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Section eyebrow — the small lime uppercase label that sits above a headline,
 * optionally with a leading lime tick/bracket. A Magnet signature.
 */
function SectionLabel({
  children,
  marker = true,
  tone = 'lime',
  style = {},
  ...rest
}) {
  const color = tone === 'lime' ? 'var(--lime)' : 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color,
      ...style
    }
  }, rest), marker && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: '28px',
      height: '2px',
      background: 'currentColor',
      display: 'inline-block'
    }
  }), children);
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag / chip — pill outline for filters, categories, tech labels.
 */
function Tag({
  active = false,
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      fontWeight: 500,
      letterSpacing: '0.01em',
      padding: '8px 16px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid',
      borderColor: active ? 'var(--lime)' : 'var(--border-dark)',
      background: active ? 'var(--lime)' : 'transparent',
      color: active ? 'var(--magnet-black)' : 'var(--text-body)',
      cursor: 'pointer',
      transition: 'all var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Magnet text input — dark field on black, lime focus ring.
 * Supports a label and optional leading/trailing adornment.
 */
function Input({
  label,
  hint,
  invalid = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '0 14px',
      background: 'var(--ink-700)',
      border: '1px solid',
      borderColor: invalid ? '#FF5C5C' : focus ? 'var(--lime)' : 'var(--border-dark)',
      borderRadius: 'var(--radius-input)',
      boxShadow: focus ? '0 0 0 3px rgba(196,255,61,.18)' : 'none',
      transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)'
    }
  }, iconLeft, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      background: 'transparent',
      border: 0,
      outline: 'none',
      padding: '13px 0',
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      color: 'var(--text-strong)'
    }
  }, rest)), iconRight), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '12px',
      color: invalid ? '#FF5C5C' : 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Magnet Card — ink surface on black, or white surface on paper.
 * Set `accent` to draw the eye (one accented card per grid).
 */
function Card({
  accent = false,
  interactive = false,
  padding = 'var(--space-4)',
  children,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    borderRadius: 'var(--radius-card)',
    padding,
    transition: 'transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
    border: '1px solid var(--border-dark)',
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    transform: interactive && hover ? 'translateY(-4px)' : 'translateY(0)'
  };
  const accentStyle = accent ? {
    background: 'var(--lime)',
    color: 'var(--magnet-black)',
    borderColor: 'var(--lime)'
  } : {};
  const hoverBorder = interactive && hover && !accent ? {
    borderColor: 'var(--ink-500)',
    background: 'var(--surface-raised)'
  } : {};
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...base,
      ...accentStyle,
      ...hoverBorder,
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Divider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Divider — thin 1px line. Optionally a short lime accent rule.
 */
function Divider({
  accent = false,
  vertical = false,
  length = '100%',
  style = {},
  ...rest
}) {
  if (vertical) {
    return /*#__PURE__*/React.createElement("span", _extends({
      "aria-hidden": "true",
      style: {
        display: 'inline-block',
        width: accent ? '2px' : '1px',
        height: length,
        background: accent ? 'var(--lime)' : 'var(--border-dark)',
        ...style
      }
    }, rest));
  }
  return /*#__PURE__*/React.createElement("hr", _extends({
    style: {
      border: 0,
      height: accent ? '2px' : '1px',
      width: accent ? '48px' : length,
      background: accent ? 'var(--lime)' : 'var(--border-dark)',
      margin: 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Divider.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Big bold stat. Archivo Black number + muted label underneath.
 * One number per group can be lime.
 */
function Stat({
  value,
  label,
  accent = false,
  align = 'left',
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(40px, 6vw, 72px)',
      lineHeight: 0.95,
      letterSpacing: '-0.03em',
      color: accent ? 'var(--lime)' : 'var(--text-strong)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '10px',
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--text-muted)'
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Stat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
// Magnet website — contact CTA band with working form state
function Contact() {
  const {
    Button,
    Input,
    SectionLabel
  } = window.MagnetDesignSystem_862266;
  const [sent, setSent] = React.useState(false);
  const [email, setEmail] = React.useState('');
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      border: '1px solid var(--ink-500)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--ink-700)',
      padding: '56px',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: '48px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Let's build"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '-0.02em',
      lineHeight: 0.98,
      fontSize: 'clamp(34px,4.5vw,56px)',
      margin: '18px 0 0',
      color: 'var(--white)'
    }
  }, "Ready to ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--lime)'
    }
  }, "matter"), "?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '20px 0 0',
      fontSize: '17px',
      lineHeight: 1.6,
      color: 'var(--text-body)',
      maxWidth: '40ch'
    }
  }, "Tell us where you want to go. We'll show you how to pull there.")), /*#__PURE__*/React.createElement("div", null, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: '28px',
      textTransform: 'uppercase',
      color: 'var(--lime)'
    }
  }, "Got it."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)',
      marginTop: '10px'
    }
  }, "We'll be in touch within one business day.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    type: "email",
    required: true,
    placeholder: "you@company.com",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "What do you need?",
    placeholder: "Rebrand, growth, both\u2026"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    as: "button",
    type: "submit"
  }, "Send brief")))));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// Magnet website — footer
function Footer() {
  const {
    Logo
  } = window.MagnetDesignSystem_862266;
  const cols = [{
    h: 'Studio',
    items: ['Work', 'Services', 'About', 'Careers']
  }, {
    h: 'Connect',
    items: ['Instagram', 'LinkedIn', 'Behance', 'X']
  }, {
    h: 'Contact',
    items: ['hello@magnet.studio', 'Cairo · Dubai']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--ink-500)',
      padding: '64px 48px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: '40px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    variant: "light",
    height: 34,
    src: "../../assets/magnet-logo.png"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '18px',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '.04em',
      fontSize: '13px',
      color: 'var(--grey-400)'
    }
  }, "Made to matter")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 14px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--lime)'
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--text-body)',
      textDecoration: 'none',
      fontSize: '14px'
    }
  }, i))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '40px auto 0',
      paddingTop: '24px',
      borderTop: '1px solid var(--ink-500)',
      display: 'flex',
      justifyContent: 'space-between',
      color: 'var(--grey-400)',
      fontSize: '13px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Magnet Studio"), /*#__PURE__*/React.createElement("span", null, "Privacy \xB7 Terms")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
// Magnet website — hero
function Hero() {
  const {
    Button,
    SectionLabel,
    Stat
  } = window.MagnetDesignSystem_862266;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      padding: '110px 48px 90px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: '-40px',
      top: '40px',
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: '520px',
      lineHeight: 1,
      color: 'var(--ink-700)',
      userSelect: 'none',
      pointerEvents: 'none'
    }
  }, "]"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--content-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, null, "Brand & growth studio"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '-0.03em',
      lineHeight: 0.95,
      fontSize: 'clamp(56px, 8vw, 104px)',
      margin: '22px 0 0',
      color: 'var(--white)',
      maxWidth: '14ch'
    }
  }, "We make brands ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--lime)'
    }
  }, "matter"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '28px 0 0',
      maxWidth: '46ch',
      fontSize: '20px',
      lineHeight: 1.6,
      color: 'var(--text-body)'
    }
  }, "Strategy, identity, and performance \u2014 built to pull. No fluff, no filler, just work that moves the numbers."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '14px',
      marginTop: '36px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Start a project"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement("span", null, "\u2192")
  }, "See the work")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '64px',
      marginTop: '72px',
      paddingTop: '36px',
      borderTop: '1px solid var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "240%",
    label: "Avg. ROAS lift",
    accent: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "98",
    label: "Brands launched"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "12M+",
    label: "Monthly reach"
  }))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Nav.jsx
try { (() => {
// Magnet website — top navigation
function Nav() {
  const {
    Button,
    Logo
  } = window.MagnetDesignSystem_862266;
  const links = ['Work', 'Services', 'Studio', 'Journal'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 48px',
      background: 'rgba(10,10,10,.72)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "light",
    height: 30,
    src: "../../assets/magnet-logo.png"
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: '36px'
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: 'var(--text-body)',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: 500,
      letterSpacing: '.01em',
      transition: 'color var(--dur-base) var(--ease-out)'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--lime)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-body)'
  }, l))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Start a project"));
}
window.Nav = Nav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Proof.jsx
try { (() => {
// Magnet website — proof: light section with case study + client wall
function Proof() {
  const {
    Badge,
    Button
  } = window.MagnetDesignSystem_862266;
  const clients = ['NOVA', 'Halcyon', 'PULSE', 'Atlas&Co', 'VERT', 'Mirae'];
  return /*#__PURE__*/React.createElement("section", {
    "data-theme": "light",
    style: {
      background: 'var(--paper)',
      color: 'var(--magnet-black)',
      padding: '90px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: '56px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    variant: "paper"
  }, "Case study"), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '-0.02em',
      lineHeight: 1.04,
      fontSize: 'clamp(30px,4vw,46px)',
      margin: '20px 0 0'
    }
  }, "From quiet to ", /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--lime)',
      padding: '0 8px'
    }
  }, "category\xA0leader"), " in nine months."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '22px 0 28px',
      fontSize: '17px',
      lineHeight: 1.6,
      color: '#3A3A3A',
      maxWidth: '44ch'
    }
  }, "A full rebrand and always-on growth engine for Nova \u2014 new identity, new site, and paid media that turned heads and revenue alike."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Read the case")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1px',
      background: 'var(--grey-200)',
      border: '1px solid var(--grey-200)'
    }
  }, [['+240%', 'ROAS'], ['3.1x', 'Pipeline'], ['9 mo', 'To launch'], ['#1', 'Share of voice']].map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: 'var(--white)',
      padding: '30px 26px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: '40px',
      letterSpacing: '-0.03em',
      lineHeight: 1
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '8px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--grey-400)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '64px',
      paddingTop: '32px',
      borderTop: '1px solid var(--grey-200)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px'
    }
  }, clients.map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '22px',
      letterSpacing: '0.02em',
      color: '#B5B5B0',
      textTransform: 'uppercase'
    }
  }, c)))));
}
window.Proof = Proof;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Proof.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
// Magnet website — services bento with category filter
function Services() {
  const {
    Card,
    Tag,
    SectionLabel
  } = window.MagnetDesignSystem_862266;
  const cats = ['All', 'Brand', 'Growth', 'Content'];
  const [active, setActive] = React.useState('All');
  const services = [{
    n: '01',
    t: 'Brand strategy',
    d: 'Positioning, naming, and the story that sets you apart.',
    cat: 'Brand'
  }, {
    n: '02',
    t: 'Identity design',
    d: 'Logo systems, type, and visual language built to last.',
    cat: 'Brand',
    accent: true
  }, {
    n: '03',
    t: 'Performance media',
    d: 'Paid social and search that compounds, not just spends.',
    cat: 'Growth'
  }, {
    n: '04',
    t: 'Content studio',
    d: 'Photo, video, and motion that stop the scroll.',
    cat: 'Content'
  }, {
    n: '05',
    t: 'Web & landing',
    d: 'Fast, sharp pages engineered to convert.',
    cat: 'Growth'
  }, {
    n: '06',
    t: 'Social',
    d: 'Always-on creative that keeps the brand magnetic.',
    cat: 'Content'
  }];
  const shown = services.filter(s => active === 'All' || s.cat === active);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '24px',
      marginBottom: '40px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "What we do"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '-0.02em',
      fontSize: 'clamp(34px,5vw,52px)',
      margin: '18px 0 0',
      color: 'var(--white)'
    }
  }, "Full-stack ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--lime)'
    }
  }, "firepower"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px'
    }
  }, cats.map(c => /*#__PURE__*/React.createElement(Tag, {
    key: c,
    active: active === c,
    onClick: () => setActive(c)
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px'
    }
  }, shown.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.n,
    interactive: true,
    accent: s.accent,
    padding: "28px",
    style: {
      minHeight: '190px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: '14px',
      letterSpacing: '.04em',
      color: s.accent ? 'var(--magnet-black)' : 'var(--grey-400)'
    }
  }, s.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '-0.01em',
      fontSize: '23px',
      margin: '14px 0 10px',
      color: s.accent ? 'var(--magnet-black)' : 'var(--white)'
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '14.5px',
      lineHeight: 1.55,
      color: s.accent ? 'rgba(10,10,10,.78)' : 'var(--text-body)'
    }
  }, s.d), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 'auto',
      paddingTop: '18px',
      fontSize: '13px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.05em',
      color: s.accent ? 'var(--magnet-black)' : 'var(--lime)'
    }
  }, "Explore \u2192"))))));
}
window.Services = Services;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.Stat = __ds_scope.Stat;

})();
