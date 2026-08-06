/* @ds-bundle: {"format":4,"namespace":"ITM2627DesignSystem_930e09","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"AvatarGroup","sourcePath":"components/core/Avatar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"ICON_PATHS","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"DataBar","sourcePath":"components/data/DataBar.jsx"},{"name":"Legend","sourcePath":"components/data/DataBar.jsx"},{"name":"Stat","sourcePath":"components/data/Stat.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Spinner","sourcePath":"components/feedback/Spinner.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Accordion","sourcePath":"components/navigation/Accordion.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"Stepper","sourcePath":"components/navigation/Stepper.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Connector","sourcePath":"components/slide/Connector.jsx"},{"name":"NumberBadge","sourcePath":"components/slide/NumberBadge.jsx"},{"name":"Orb","sourcePath":"components/slide/Orb.jsx"},{"name":"Ring","sourcePath":"components/slide/Orb.jsx"},{"name":"Pill","sourcePath":"components/slide/Pill.jsx"},{"name":"SectionLabel","sourcePath":"components/slide/SectionLabel.jsx"},{"name":"SPECIMENS","sourcePath":"components/slide/Specimen.jsx"},{"name":"GLYPHS","sourcePath":"components/slide/Specimen.jsx"},{"name":"Specimen","sourcePath":"components/slide/Specimen.jsx"},{"name":"SpecimenGlyph","sourcePath":"components/slide/Specimen.jsx"},{"name":"SpecimenScatter","sourcePath":"components/slide/Specimen.jsx"},{"name":"Paper","sourcePath":"components/slide/Specimen.jsx"},{"name":"Wash","sourcePath":"components/slide/Wash.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"98ff16270a82","components/core/Button.jsx":"8525854e70da","components/core/Card.jsx":"91d3a61454b0","components/core/Divider.jsx":"5b316aae73bd","components/core/Icon.jsx":"a23f3267cbc8","components/core/IconButton.jsx":"d205b56409ea","components/core/Tag.jsx":"04ee1d8b98e1","components/data/DataBar.jsx":"12aa47f604f0","components/data/Stat.jsx":"2bddda5130e4","components/data/Table.jsx":"da3b19a37d24","components/feedback/Alert.jsx":"c82a19322675","components/feedback/ProgressBar.jsx":"618deeb39170","components/feedback/Spinner.jsx":"cefb3118e17c","components/feedback/Tooltip.jsx":"a0f927fe3d49","components/forms/Checkbox.jsx":"f9c71f28013e","components/forms/Field.jsx":"b33e433611bf","components/forms/Input.jsx":"ccc988a91482","components/forms/RadioGroup.jsx":"6c0536c4857f","components/forms/Select.jsx":"d1ceb33d1ab4","components/forms/Switch.jsx":"3706a49855d7","components/forms/Textarea.jsx":"eba19bf325e7","components/navigation/Accordion.jsx":"b132c84126ce","components/navigation/Breadcrumb.jsx":"013406f1b805","components/navigation/Stepper.jsx":"d9048ccc5739","components/navigation/Tabs.jsx":"6ecf27c73dcf","components/slide/Connector.jsx":"4665c3f19f33","components/slide/NumberBadge.jsx":"52fbcd655441","components/slide/Orb.jsx":"05ac08a71616","components/slide/Pill.jsx":"a842d99e1880","components/slide/SectionLabel.jsx":"df6f5d8d033c","components/slide/Specimen.jsx":"dbfa78701e43","components/slide/Wash.jsx":"077403b98b53"},"inlinedExternals":[],"unexposedExports":[{"name":"glyphNodes","sourcePath":"components/slide/Specimen.jsx"}]} */

(() => {

const __ds_ns = (window.ITM2627DesignSystem_930e09 = window.ITM2627DesignSystem_930e09 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
const TONES = {
  coral: ['var(--coral-100)', 'var(--coral-700)'],
  violet: ['var(--violet-100)', 'var(--violet-700)'],
  sky: ['var(--sky-100)', 'var(--sky-700)'],
  moss: ['var(--moss-100)', 'var(--moss-700)'],
  neutral: ['var(--ink-100)', 'var(--ink-700)']
};
function initials(name) {
  return String(name || '').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}

/** Avatar — a circular person marker: photo when available, initials otherwise. */
function Avatar({
  name,
  src,
  size = 40,
  tone = 'coral',
  style
}) {
  const [bg, fg] = TONES[tone] || TONES.coral;
  return /*#__PURE__*/React.createElement("span", {
    title: name,
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-circle)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: bg,
      color: fg,
      overflow: 'hidden',
      flexShrink: 0,
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: Math.round(size * 0.38),
      letterSpacing: '0.02em',
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name || '',
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials(name));
}

/** AvatarGroup — overlapping avatars with an optional "+N" overflow chip. */
function AvatarGroup({
  people = [],
  size = 40,
  max = 4
}) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, shown.map((p, i) => /*#__PURE__*/React.createElement(Avatar, {
    key: i,
    name: p.name,
    src: p.src,
    size: size,
    tone: p.tone,
    style: {
      marginLeft: i ? -size * 0.28 : 0,
      boxShadow: '0 0 0 2px var(--ink-000)'
    }
  })), rest > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      marginLeft: -size * 0.28,
      borderRadius: 'var(--radius-circle)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--ink-100)',
      color: 'var(--ink-700)',
      boxShadow: '0 0 0 2px var(--ink-000)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: Math.round(size * 0.32)
    }
  }, "+", rest) : null);
}
Object.assign(__ds_scope, { Avatar, AvatarGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/**
 * Card — a flat white content container with soft neutral elevation.
 * No border, no colored left-accent — the deck's cards are plain and calm.
 */
function Card({
  children,
  padding = 24,
  hover = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      padding,
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      transition: 'box-shadow var(--duration-base) var(--ease-standard)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
/** Divider — a hairline rule, optionally interrupted by a small centred label. */
function Divider({
  label,
  orientation = 'horizontal',
  tone = 'subtle',
  style
}) {
  const color = tone === 'strong' ? 'var(--border-strong)' : tone === 'warm' ? 'var(--border-warm)' : 'var(--border-subtle)';
  if (orientation === 'vertical') {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: 1,
        alignSelf: 'stretch',
        background: color,
        ...style
      }
    });
  }
  if (!label) return /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 0,
      borderTop: '1px solid ' + color,
      margin: 0,
      ...style
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: color
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: color
    }
  }));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
/**
 * Icon — the ITM 2627 line set. 24x24 grid, 1.75px stroke, round caps
 * and joins, geometric construction. Never mix in a second icon family.
 */
const ICON_PATHS = {
  'alert': '<path d="M12 4 21.2 19.8H2.8z"/><path d="M12 10v4.4"/><path d="M12 17.3v.4"/>',
  'arrow-down': '<path d="M12 4v15"/><path d="M6 13l6 6 6-6"/>',
  'arrow-left': '<path d="M20 12H5"/><path d="M11 18l-6-6 6-6"/>',
  'arrow-right': '<path d="M4 12h15"/><path d="M13 6l6 6-6 6"/>',
  'arrow-up': '<path d="M12 20V5"/><path d="M6 11l6-6 6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  'bar-chart': '<path d="M3 20h18"/><path d="M6.5 20v-7"/><path d="M12 20V6"/><path d="M17.5 20v-10"/>',
  'bell': '<path d="M18 9.5a6 6 0 0 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5z"/><path d="M10.3 19.2a2 2 0 0 0 3.4 0"/>',
  'book': '<path d="M12 7c-1.9-1.6-4.3-2.3-7-2.1v13c2.7-.2 5.1.5 7 2.1 1.9-1.6 4.3-2.3 7-2.1v-13c-2.7-.2-5.1.5-7 2.1z"/><path d="M12 7v13"/>',
  'briefcase': '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5.6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7"/><path d="M3 12.5h18"/>',
  'calendar': '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16"/><path d="M9 3v4"/><path d="M15 3v4"/>',
  'check': '<path d="M4 12.5l5 5L20 6.5"/>',
  'check-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.8 2.8 5.4-5.6"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
  'chevron-left': '<path d="M15 6l-6 6 6 6"/>',
  'chevron-right': '<path d="M9 6l6 6-6 6"/>',
  'chevron-up': '<path d="M6 15l6-6 6 6"/>',
  'clipboard-check': '<path d="M9 4.6H7a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6.6a2 2 0 0 0-2-2h-2"/><rect x="9" y="2.8" width="6" height="3.6" rx="1.3"/><path d="M9.3 13.8l2.2 2.2 4-4"/>',
  'clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.3l3.4 2"/>',
  'close': '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
  'cloud': '<path d="M7.5 19a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18.4 11 4 4 0 0 1 17.5 19z"/>',
  'compass': '<circle cx="12" cy="12" r="8.5"/><path d="M15.6 8.4 13.5 13.5 8.4 15.6 10.5 10.5z"/>',
  'copy': '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  'cpu': '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  'database': '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  'download': '<path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/>',
  'external-link': '<path d="M14 4h6v6"/><path d="M20 4l-8.5 8.5"/><path d="M18 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5.5"/>',
  'eye': '<path d="M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  'file-text': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/>',
  'filter': '<path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/>',
  'flag': '<path d="M6 21.5V3"/><path d="M6 4h11.5l-2.3 4.2L17.5 12.5H6"/>',
  'folder': '<path d="M3 7.5a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  'globe': '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.3 2.6 3.5 5.5 3.5 8.5s-1.2 5.9-3.5 8.5c-2.3-2.6-3.5-5.5-3.5-8.5S9.7 6.1 12 3.5z"/>',
  'graduation-cap': '<path d="M12 4 22 9l-10 5L2 9z"/><path d="M6 11.3V16c0 1.9 2.7 3.3 6 3.3s6-1.4 6-3.3v-4.7"/>',
  'grid': '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  'help': '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.5v.4"/><path d="M12 16.6v.4"/>',
  'info': '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.2"/><path d="M12 7.6v.5"/>',
  'key': '<circle cx="8" cy="15" r="4"/><path d="M10.9 12.1 20 3"/><path d="M17 6l2.6 2.6"/><path d="M14.4 8.6 17 11.2"/>',
  'layers': '<path d="M12 3 3 8l9 5 9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
  'leaf': '<path d="M4 20C4 10.6 9.8 4.6 20.5 3.5 20.5 14 14.4 19.8 4 20z"/><path d="M4.5 19.5C8.4 13.6 11.6 10.9 16 8.5"/>',
  'lightbulb': '<path d="M12 3.2a6.2 6.2 0 0 0-3.5 11.3v2.3h7V14.5A6.2 6.2 0 0 0 12 3.2z"/><path d="M10 19.8h4"/>',
  'link': '<path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.4 1.4"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0L5 13.3a4 4 0 0 0 5.7 5.7l1.4-1.4"/>',
  'lock': '<rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5"/><path d="M8 10.5v-3a4 4 0 0 1 8 0v3"/>',
  'mail': '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.6 7 8.4 6 8.4-6"/>',
  'menu': '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
  'message': '<path d="M20.5 11.8a7.6 7.6 0 0 1-11.1 6.8L4 20.2l1.4-4.5a7.6 7.6 0 1 1 15.1-3.9z"/>',
  'minus': '<path d="M5 12h14"/>',
  'more': '<circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  'network': '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M11 7.3 6.2 16.6"/><path d="M13 7.3l4.8 9.3"/><path d="M7.5 19h9"/>',
  'pencil': '<path d="M4 20h4L20 8a2.83 2.83 0 0 0-4-4L4 16z"/><path d="M14.5 5.5 18.5 9.5"/>',
  'pie-chart': '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5V12h8.5"/>',
  'play': '<path d="M8 5.5 18.5 12 8 18.5z"/>',
  'plus': '<path d="M12 5v14"/><path d="M5 12h14"/>',
  'presentation': '<path d="M3 4h18"/><path d="M4.7 4v9.5a1.5 1.5 0 0 0 1.5 1.5h11.6a1.5 1.5 0 0 0 1.5-1.5V4"/><path d="M12 15v3"/><path d="M8.5 21 12 18l3.5 3"/>',
  'refresh': '<path d="M19.9 13.6A8 8 0 1 1 18.1 7.2"/><path d="M19.5 3v4.8h-4.8"/>',
  'rocket': '<path d="M12 2.8c2.7 2.6 4.2 6 4.2 9.6v3.2L12 18.1l-4.2-2.5v-3.2c0-3.6 1.5-7 4.2-9.6z"/><circle cx="12" cy="9.8" r="1.9"/><path d="M7.8 12.4 5.4 15.2v3.4l2.4-1.5"/><path d="M16.2 12.4l2.4 2.8v3.4l-2.4-1.5"/><path d="M12 19.4v2.3"/>',
  'search': '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.6-4.6"/>',
  'settings': '<path d="M4 8h9"/><path d="M17 8h3"/><path d="M4 16h3"/><path d="M11 16h9"/><circle cx="15" cy="8" r="2.2"/><circle cx="9" cy="16" r="2.2"/>',
  'share': '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8 15.8 6.7"/><path d="M8.2 13.2l7.6 4.1"/>',
  'shield': '<path d="M12 3l7.5 3v5.5c0 4.6-3.1 8.3-7.5 9.5-4.4-1.2-7.5-4.9-7.5-9.5V6z"/>',
  'sparkle': '<path d="M11 3l1.8 4.9L17.7 9.7l-4.9 1.8L11 16.4 9.2 11.5 4.3 9.7l4.9-1.8z"/><path d="M18 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  'sprout': '<path d="M12 21.2v-7.6"/><path d="M12 13.6C12 9.4 9 6.6 4.2 6.6c-.1 4.7 3 7 7.8 7z"/><path d="M12 13.6c0-3.6 2.6-6 6.7-6.4.1 4-2.6 6.4-6.7 6.4z"/>',
  'star': '<path d="M12 3.5l2.6 5.7 6.2.7-4.6 4.2 1.2 6.1L12 17.2l-5.4 3 1.2-6.1L3.2 9.9l6.2-.7z"/>',
  'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9"/>',
  'tag': '<path d="M11.6 3H4v7.6l9.4 9.4a2 2 0 0 0 2.8 0l5-5a2 2 0 0 0 0-2.8z"/><circle cx="7.9" cy="7.9" r="1.3" fill="currentColor" stroke="none"/>',
  'target': '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  'trash': '<path d="M4 6.5h16"/><path d="M9.5 6.5v-2h5v2"/><path d="M6.6 6.5 7.5 20a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l.9-13.5"/>',
  'trend-up': '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  'upload': '<path d="M12 20V9"/><path d="M7 13l5-5 5 5"/><path d="M4 4h16"/>',
  'user': '<circle cx="12" cy="8" r="3.8"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>',
  'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16.2 5.3a3.5 3.5 0 0 1 0 5.4"/><path d="M17.8 14.4c2 .8 3.7 2.5 3.7 5.6"/>',
  'x-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M9.2 9.2 14.8 14.8"/><path d="M14.8 9.2 9.2 14.8"/>',
  'zap': '<path d="M13.2 2.5 5 14h6l-1 7.5L19 10h-6.4z"/>'
};
const ICON_NAMES = Object.keys(ICON_PATHS);
function Icon({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.75,
  title,
  style
}) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: title ? 'img' : undefined,
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
    style: {
      flexShrink: 0,
      display: 'block',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: (title ? '<title>' + title + '</title>' : '') + d
    }
  });
}
Object.assign(__ds_scope, { ICON_PATHS, ICON_NAMES, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    h: 'var(--control-sm)',
    px: 14,
    fs: 'var(--text-sm)',
    gap: 6,
    icon: 16
  },
  md: {
    h: 'var(--control-md)',
    px: 20,
    fs: 'var(--text-base)',
    gap: 8,
    icon: 18
  },
  lg: {
    h: 'var(--control-lg)',
    px: 28,
    fs: 'var(--text-md)',
    gap: 10,
    icon: 20
  }
};
const VARIANTS = {
  primary: {
    bg: 'var(--coral-500)',
    bgHover: 'var(--coral-600)',
    fg: 'var(--ink-000)',
    bd: 'transparent'
  },
  secondary: {
    bg: 'var(--ink-000)',
    bgHover: 'var(--ink-050)',
    fg: 'var(--ink-900)',
    bd: 'var(--ink-200)'
  },
  soft: {
    bg: 'var(--coral-100)',
    bgHover: 'var(--coral-200)',
    fg: 'var(--coral-700)',
    bd: 'transparent'
  },
  ghost: {
    bg: 'transparent',
    bgHover: 'var(--state-hover-tint)',
    fg: 'var(--ink-800)',
    bd: 'transparent'
  }
};

/** Button — pill-shaped action. Primary coral is the single call to action per view. */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth,
  disabled,
  onClick,
  type = 'button',
  style
}) {
  const [h, setH] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      fontSize: s.fs,
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: '0.005em',
      lineHeight: 1,
      color: v.fg,
      background: h && !disabled ? v.bgHover : v.bg,
      border: '1px solid ' + v.bd,
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
      boxShadow: variant === 'secondary' ? 'var(--elevation-1)' : 'none',
      transition: 'var(--transition-color)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, iconLeft ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.icon,
    strokeWidth: 1.75
  }) : null, children, iconRight ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon,
    strokeWidth: 1.75
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
const S = {
  sm: 32,
  md: 40,
  lg: 48
};

/** IconButton — a square-footprint circular button holding a single icon. */
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  disabled,
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  const d = S[size] || S.md;
  const solid = variant === 'primary';
  const bordered = variant === 'secondary';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: d,
      height: d,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-circle)',
      border: '1px solid ' + (bordered ? 'var(--ink-200)' : 'transparent'),
      background: solid ? h ? 'var(--coral-600)' : 'var(--coral-500)' : h ? 'var(--state-hover-tint)' : bordered ? 'var(--ink-000)' : 'transparent',
      color: solid ? 'var(--ink-000)' : 'var(--ink-800)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
      transition: 'var(--transition-color)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: d <= 32 ? 16 : d <= 40 ? 20 : 22
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
const TONES = {
  neutral: ['var(--ink-100)', 'var(--ink-800)', 'var(--ink-200)'],
  coral: ['var(--coral-100)', 'var(--coral-700)', 'var(--coral-200)'],
  violet: ['var(--violet-100)', 'var(--violet-700)', 'var(--violet-200)'],
  sky: ['var(--sky-100)', 'var(--sky-700)', 'var(--sky-200)'],
  moss: ['var(--moss-100)', 'var(--moss-700)', 'var(--moss-300)'],
  amber: ['var(--amber-100)', 'var(--amber-700)', 'var(--amber-300)']
};

/** Tag — a small pill label for status, category or metadata. */
function Tag({
  children,
  tone = 'neutral',
  variant = 'soft',
  icon,
  size = 'md',
  style
}) {
  const [bg, fg, bd] = TONES[tone] || TONES.neutral;
  const sm = size === 'sm';
  const outline = variant === 'outline';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: sm ? 4 : 6,
      height: sm ? 22 : 28,
      padding: sm ? '0 9px' : '0 12px',
      fontFamily: 'var(--font-sans)',
      fontSize: sm ? 'var(--text-2xs)' : 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: '0.02em',
      color: fg,
      background: outline ? 'transparent' : bg,
      border: '1px solid ' + (outline ? bd : 'transparent'),
      borderRadius: 'var(--radius-pill)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: sm ? 12 : 14,
    strokeWidth: 1.6
  }) : null, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/DataBar.jsx
try { (() => {
const SERIES = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)'];

/** DataBar — a labelled horizontal bar chart. The system's default simple comparison. */
function DataBar({
  data = [],
  max,
  showValue = true,
  unit = '',
  barHeight = 14,
  style
}) {
  const top = max || Math.max(1, ...data.map(d => d.value || 0));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, data.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)'
    }
  }, d.label), showValue ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, d.value, unit) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      height: barHeight,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--ink-100)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: Math.max(0, Math.min(100, d.value / top * 100)) + '%',
      height: '100%',
      borderRadius: 'var(--radius-pill)',
      background: d.color || SERIES[i % SERIES.length],
      transition: 'width var(--duration-slow) var(--ease-out)'
    }
  })))));
}

/** Legend — the colour key for a chart. Matches DataBar's series order. */
function Legend({
  items = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-5)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 'var(--radius-circle)',
      background: typeof it === 'string' ? SERIES[i % SERIES.length] : it.color || SERIES[i % SERIES.length]
    }
  }), typeof it === 'string' ? it : it.label)));
}
Object.assign(__ds_scope, { DataBar, Legend });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataBar.jsx", error: String((e && e.message) || e) }); }

// components/data/Stat.jsx
try { (() => {
/** Stat — one headline number with its label. The deck's "big numbers" slide, as UI. */
function Stat({
  value,
  label,
  hint,
  delta,
  tone = 'coral',
  align = 'left',
  size = 'md',
  style
}) {
  const color = {
    coral: 'var(--coral-500)',
    violet: 'var(--violet-500)',
    moss: 'var(--moss-600)',
    sky: 'var(--sky-600)',
    ink: 'var(--ink-900)'
  }[tone] || 'var(--coral-500)';
  const fs = size === 'lg' ? 'var(--text-4xl)' : size === 'sm' ? 'var(--text-2xl)' : 'var(--text-3xl)';
  const up = typeof delta === 'number' ? delta >= 0 : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      textAlign: align,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-3)',
      justifyContent: align === 'center' ? 'center' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: fs,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 1,
      color
    }
  }, value), up !== null ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: up ? 'var(--moss-600)' : 'var(--status-danger)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: up ? 'arrow-up' : 'arrow-down',
    size: 14,
    strokeWidth: 2.2
  }), Math.abs(delta), "%") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), hint ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-faint)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Stat.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
/**
 * Table — the sessions-schedule table style: a coral first column, thin
 * dark row rules, generous cell padding, no zebra striping.
 */
function Table({
  columns,
  rows
}) {
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("tbody", null, rows.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderBottom: i < rows.length - 1 ? '1px solid var(--ink-900)' : 'none'
    }
  }, row.map((cell, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    style: {
      padding: '18px 20px',
      verticalAlign: 'top',
      fontSize: 'var(--text-small)',
      fontWeight: j === 0 ? 700 : 400,
      color: j === 0 ? 'var(--accent-primary)' : 'var(--text-primary)',
      whiteSpace: j === 0 ? 'nowrap' : 'normal'
    }
  }, cell))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
const TONES = {
  info: ['var(--status-info-soft)', 'var(--sky-700)', 'var(--sky-200)', 'info'],
  success: ['var(--status-success-soft)', 'var(--moss-700)', 'var(--moss-300)', 'check-circle'],
  warning: ['var(--status-warning-soft)', 'var(--amber-700)', 'var(--amber-300)', 'alert'],
  danger: ['var(--status-danger-soft)', '#A4302A', '#F3C4C0', 'x-circle']
};

/** Alert — an inline message block. One per view; never stack them. */
function Alert({
  tone = 'info',
  title,
  children,
  icon,
  onDismiss,
  style
}) {
  const [bg, fg, bd, defaultIcon] = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      background: bg,
      border: '1px solid ' + bd,
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: fg,
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || defaultIcon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-semibold)',
      color: fg,
      marginBottom: children ? 4 : 0
    }
  }, title) : null, children ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-normal)',
      color: 'var(--text-secondary)'
    }
  }, children) : null), onDismiss ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      background: 'none',
      border: 0,
      padding: 2,
      cursor: 'pointer',
      color: fg,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: 16
  })) : null);
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
const TONES = {
  coral: 'var(--fill-coral-bar)',
  violet: 'var(--violet-500)',
  moss: 'var(--moss-500)',
  sky: 'var(--sky-500)',
  spectrum: 'var(--fill-spectrum-bar)'
};

/** ProgressBar — completion of a known-length task, 0-100. */
function ProgressBar({
  value = 0,
  tone = 'coral',
  size = 'md',
  label,
  showValue,
  style
}) {
  const pct = Math.max(0, Math.min(100, value));
  const h = size === 'sm' ? 6 : size === 'lg' ? 16 : 10;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label || showValue ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-2)',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, label), showValue ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)'
    }
  }, Math.round(pct), "%") : null) : null, /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    style: {
      height: h,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--ink-100)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      borderRadius: 'var(--radius-pill)',
      background: TONES[tone] || TONES.coral,
      transition: 'width var(--duration-slow) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Spinner.jsx
try { (() => {
/** Spinner — indeterminate wait. Only for waits under ~10 seconds. */
function Spinner({
  size = 24,
  color = 'var(--coral-500)',
  label,
  style
}) {
  const r = size / 2 - 2;
  return /*#__PURE__*/React.createElement("span", {
    role: "status",
    "aria-label": label || 'Loading',
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: '0 0 ' + size + ' ' + size,
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: "var(--ink-200)",
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: color,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeDasharray: 2 * Math.PI * r,
    strokeDashoffset: 2 * Math.PI * r * 0.72
  }, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    from: '0 ' + size / 2 + ' ' + size / 2,
    to: '360 ' + size / 2 + ' ' + size / 2,
    dur: "0.9s",
    repeatCount: "indefinite"
  }))), label);
}
Object.assign(__ds_scope, { Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Spinner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/** Tooltip — a short hover hint. Never put essential information in one. */
function Tooltip({
  content,
  placement = 'top',
  children,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: 8
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: 8
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: 8
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: 8
    }
  }[placement];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      zIndex: 'var(--z-overlay)',
      ...pos,
      opacity: open ? 1 : 0,
      visibility: open ? 'visible' : 'hidden',
      transition: 'opacity var(--duration-fast) var(--ease-standard)',
      background: 'var(--ink-900)',
      color: 'var(--ink-000)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      lineHeight: 1.4,
      padding: '7px 10px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--elevation-3)',
      pointerEvents: 'none'
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** Checkbox — a square multi-select control with its label. */
function Checkbox({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled,
  id,
  style
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked === undefined ? inner : checked;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInner(!on);
    if (onChange) onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    onClick: toggle,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)',
      opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      flexShrink: 0,
      borderRadius: 'var(--radius-xs)',
      border: '1.5px solid ' + (on ? 'var(--coral-500)' : 'var(--ink-300)'),
      background: on ? 'var(--coral-500)' : 'var(--ink-000)',
      color: 'var(--ink-000)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-color)'
    }
  }, on ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    strokeWidth: 2.6
  }) : null), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
/** Field — label + control + hint/error wrapper. Every input belongs in one. */
function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)'
    }
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--coral-600)',
      marginLeft: 3
    }
  }, "*") : null) : null, children, error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--status-danger)'
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
/** Input — single-line text entry, with an optional leading icon. */
function Input({
  value,
  defaultValue,
  onChange,
  placeholder,
  type = 'text',
  icon,
  size = 'md',
  invalid,
  disabled,
  id,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-sm)' : size === 'lg' ? 'var(--control-lg)' : 'var(--control-md)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      color: 'var(--text-faint)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    strokeWidth: 1.6
  })) : null, /*#__PURE__*/React.createElement("input", {
    id: id,
    type: type,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...{
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-primary)',
        background: 'var(--ink-000)',
        border: '1px solid ' + (invalid ? 'var(--status-danger)' : focus ? 'var(--coral-500)' : 'var(--ink-200)'),
        borderRadius: 'var(--radius-lg)',
        boxShadow: focus ? '0 0 0 3px var(--coral-100)' : 'none',
        outline: 'none',
        transition: 'var(--transition-color), box-shadow var(--duration-fast) var(--ease-standard)'
      },
      height: h,
      padding: icon ? '0 16px 0 42px' : '0 16px'
    }
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioGroup.jsx
try { (() => {
/** RadioGroup — one choice from a short list. Use Select above ~6 options. */
function RadioGroup({
  value,
  defaultValue,
  onChange,
  options = [],
  name,
  direction = 'vertical',
  disabled,
  style
}) {
  const [inner, setInner] = React.useState(defaultValue);
  const sel = value === undefined ? inner : value;
  const pick = v => {
    if (disabled) return;
    if (value === undefined) setInner(v);
    if (onChange) onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      gap: direction === 'horizontal' ? 'var(--space-5)' : 'var(--space-3)',
      opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
      ...style
    }
  }, options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    const on = sel === val;
    return /*#__PURE__*/React.createElement("label", {
      key: val,
      onClick: () => pick(val),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-primary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 20,
        height: 20,
        flexShrink: 0,
        borderRadius: 'var(--radius-circle)',
        border: '1.5px solid ' + (on ? 'var(--coral-500)' : 'var(--ink-300)'),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'var(--transition-color)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 'var(--radius-circle)',
        background: on ? 'var(--coral-500)' : 'transparent',
        transition: 'var(--transition-color)'
      }
    })), lab, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: name,
      value: val,
      checked: on,
      readOnly: true,
      style: {
        position: 'absolute',
        opacity: 0,
        width: 0,
        height: 0
      }
    }));
  }));
}
Object.assign(__ds_scope, { RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/** Select — native single-choice dropdown with the system chevron. */
function Select({
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder,
  invalid,
  disabled,
  id,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", {
    id: id,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...{
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-primary)',
        background: 'var(--ink-000)',
        border: '1px solid ' + (invalid ? 'var(--status-danger)' : focus ? 'var(--coral-500)' : 'var(--ink-200)'),
        borderRadius: 'var(--radius-lg)',
        boxShadow: focus ? '0 0 0 3px var(--coral-100)' : 'none',
        outline: 'none',
        transition: 'var(--transition-color), box-shadow var(--duration-fast) var(--ease-standard)'
      },
      height: 'var(--control-md)',
      padding: '0 42px 0 16px',
      appearance: 'none',
      cursor: 'pointer'
    }
  }, placeholder ? /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder) : null, options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lab);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 15,
      color: 'var(--text-muted)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18,
    strokeWidth: 1.6
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** Switch — an immediate on/off toggle. Use for settings that apply at once. */
function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled,
  style
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked === undefined ? inner : checked;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInner(!on);
    if (onChange) onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: toggle,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)',
      opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    style: {
      width: 44,
      height: 26,
      flexShrink: 0,
      borderRadius: 'var(--radius-pill)',
      padding: 3,
      boxSizing: 'border-box',
      background: on ? 'var(--coral-500)' : 'var(--ink-300)',
      display: 'inline-flex',
      alignItems: 'center',
      transition: 'background-color var(--duration-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-circle)',
      background: 'var(--ink-000)',
      boxShadow: 'var(--elevation-1)',
      transform: on ? 'translateX(18px)' : 'translateX(0)',
      transition: 'transform var(--duration-base) var(--ease-out)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
/** Textarea — multi-line text entry. */
function Textarea({
  value,
  defaultValue,
  onChange,
  placeholder,
  rows = 4,
  invalid,
  disabled,
  id,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("textarea", {
    id: id,
    rows: rows,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...{
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-primary)',
        background: 'var(--ink-000)',
        border: '1px solid ' + (invalid ? 'var(--status-danger)' : focus ? 'var(--coral-500)' : 'var(--ink-200)'),
        borderRadius: 'var(--radius-lg)',
        boxShadow: focus ? '0 0 0 3px var(--coral-100)' : 'none',
        outline: 'none',
        transition: 'var(--transition-color), box-shadow var(--duration-fast) var(--ease-standard)'
      },
      padding: '12px 16px',
      lineHeight: 'var(--leading-normal)',
      resize: 'vertical',
      opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Accordion.jsx
try { (() => {
/** Accordion — collapsible sections for reference content, never for a primary flow. */
function Accordion({
  items = [],
  defaultOpen = 0,
  allowMultiple = false,
  style
}) {
  const [open, setOpen] = React.useState(defaultOpen === null ? [] : [defaultOpen]);
  const toggle = i => setOpen(o => o.includes(i) ? o.filter(x => x !== i) : allowMultiple ? o.concat(i) : [i]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      borderTop: '1px solid var(--border-subtle)',
      ...style
    }
  }, items.map((it, i) => {
    const on = open.includes(i);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => toggle(i),
      "aria-expanded": on,
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        background: 'none',
        border: 0,
        cursor: 'pointer',
        padding: '18px 0',
        textAlign: 'left',
        fontFamily: 'inherit',
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--text-primary)'
      }
    }, it.title, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--coral-500)',
        transform: on ? 'rotate(180deg)' : 'none',
        transition: 'transform var(--duration-base) var(--ease-standard)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-down",
      size: 20
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: on ? 'block' : 'none',
        paddingBottom: 'var(--space-5)',
        fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-normal)',
        color: 'var(--text-secondary)',
        maxWidth: 'var(--measure)'
      }
    }, it.content));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
/** Breadcrumb — where the current page sits in the hierarchy. */
function Breadcrumb({
  items = [],
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Breadcrumb",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      ...style
    }
  }, items.map((it, i) => {
    const label = typeof it === 'string' ? it : it.label;
    const href = typeof it === 'string' ? null : it.href;
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, i ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-300)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-right",
      size: 14,
      strokeWidth: 1.6
    })) : null, last || !href ? /*#__PURE__*/React.createElement("span", {
      "aria-current": last ? 'page' : undefined,
      style: {
        color: last ? 'var(--text-primary)' : 'var(--text-muted)',
        fontWeight: last ? 'var(--weight-semibold)' : 'var(--weight-regular)'
      }
    }, label) : /*#__PURE__*/React.createElement("a", {
      href: href,
      style: {
        color: 'var(--text-muted)',
        textDecoration: 'none'
      }
    }, label));
  }));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Stepper.jsx
try { (() => {
/** Stepper — progress through an ordered sequence. The deck's numbered-badge chain, as UI. */
function Stepper({
  steps = [],
  current = 0,
  orientation = 'horizontal',
  style
}) {
  const vertical = orientation === 'vertical';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      alignItems: vertical ? 'flex-start' : 'flex-start',
      gap: 0,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, steps.map((s, i) => {
    const label = typeof s === 'string' ? s : s.label;
    const hint = typeof s === 'string' ? null : s.hint;
    const done = i < current,
      now = i === current;
    const fill = done ? 'var(--coral-500)' : now ? 'var(--ink-000)' : 'var(--ink-000)';
    const bd = done ? 'var(--coral-500)' : now ? 'var(--coral-500)' : 'var(--ink-200)';
    const fg = done ? 'var(--ink-000)' : now ? 'var(--coral-600)' : 'var(--text-faint)';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: vertical ? 'row' : 'column',
        gap: vertical ? 'var(--space-4)' : 'var(--space-3)',
        flex: vertical ? 'none' : 1,
        alignItems: vertical ? 'flex-start' : 'stretch'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        gap: 0,
        minWidth: vertical ? 40 : undefined,
        alignSelf: vertical ? 'stretch' : undefined
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        flexShrink: 0,
        borderRadius: 'var(--radius-circle)',
        background: fill,
        border: '1.5px solid ' + bd,
        color: fg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-sm)',
        boxShadow: now ? 'var(--glow-coral)' : 'none',
        transition: 'var(--transition-color)'
      }
    }, done ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 18,
      strokeWidth: 2.4
    }) : i + 1), i < steps.length - 1 ? /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minHeight: vertical ? 28 : 0,
        minWidth: vertical ? 0 : 8,
        height: vertical ? undefined : 1.5,
        width: vertical ? 1.5 : undefined,
        background: done ? 'var(--coral-300)' : 'var(--border-subtle)',
        margin: vertical ? '6px 0' : '0 12px 0 8px'
      }
    }) : null), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: vertical ? 'var(--space-5)' : 0,
        paddingRight: vertical ? 0 : 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-base)',
        fontWeight: now ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        color: now || done ? 'var(--text-primary)' : 'var(--text-muted)'
      }
    }, label), hint ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, hint) : null));
  }));
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Stepper.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Tabs — switch between sibling views. Coral underline marks the active tab. */
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  style
}) {
  const [inner, setInner] = React.useState(defaultValue || items[0] && (items[0].value || items[0]));
  const active = value === undefined ? inner : value;
  const pick = v => {
    if (value === undefined) setInner(v);
    if (onChange) onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      borderBottom: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, items.map(it => {
    const v = it.value || it;
    const on = active === v;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": on,
      onClick: () => pick(v),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        background: 'none',
        border: 0,
        cursor: 'pointer',
        padding: '0 0 12px',
        fontFamily: 'inherit',
        fontSize: 'var(--text-base)',
        fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        color: on ? 'var(--text-primary)' : 'var(--text-muted)',
        boxShadow: on ? 'inset 0 -2.5px 0 var(--coral-500)' : 'none',
        transition: 'var(--transition-color)'
      }
    }, it.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 17,
      strokeWidth: 1.7
    }) : null, it.label || v, it.count !== undefined ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-faint)'
      }
    }, it.count) : null);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/slide/Connector.jsx
try { (() => {
/**
 * Connector — the thin coral down-arrow used to link stacked cards into a
 * vertical sequence (as in the "Was werden wir tun?" slide).
 */
function Connector({
  length = 40,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: length,
    viewBox: `0 0 16 ${length}`,
    style: {
      display: 'block',
      margin: '0 auto',
      ...style
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "0",
    x2: "8",
    y2: length - 8,
    stroke: "var(--accent-primary)",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: `8,${length} 3,${length - 9} 13,${length - 9}`,
    fill: "var(--accent-primary)"
  }));
}
Object.assign(__ds_scope, { Connector });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/slide/Connector.jsx", error: String((e && e.message) || e) }); }

// components/slide/NumberBadge.jsx
try { (() => {
/**
 * NumberBadge — a filled circular badge carrying a single number or short
 * label, used to mark sequence (trend numbers, session numbers, step
 * numbers). Pairs with a hue-matched "harmonic" glow shadow by default,
 * matching the source deck's outerShdw treatment.
 */
function NumberBadge({
  number,
  tone = 'coral',
  size = 56,
  glow = true,
  style
}) {
  const bg = tone === 'violet' ? 'var(--accent-secondary)' : tone === 'navy' ? 'var(--surface-dark)' : 'var(--accent-primary)';
  const shadow = glow ? tone === 'violet' ? 'var(--glow-violet)' : tone === 'navy' ? 'none' : 'var(--glow-coral)' : 'none';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      boxShadow: shadow,
      color: 'var(--text-on-accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: size * 0.36,
      flexShrink: 0,
      ...style
    }
  }, number);
}
Object.assign(__ds_scope, { NumberBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/slide/NumberBadge.jsx", error: String((e && e.message) || e) }); }

// components/slide/Orb.jsx
try { (() => {
const TONES = {
  coral: ['var(--orb-coral)', 'var(--glow-coral)'],
  violet: ['var(--orb-violet)', 'var(--glow-violet)'],
  sky: ['var(--orb-sky)', 'var(--glow-sky)'],
  moss: ['var(--orb-moss)', 'var(--glow-moss)']
};

/** Orb — the deck's signature decorative sphere, drawn in CSS so it scales
 *  to any size. Always carries a glow matched to its own hue. */
function Orb({
  size = 160,
  tone = 'coral',
  glow = true,
  style
}) {
  const [fill, shadow] = TONES[tone] || TONES.coral;
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: 'var(--radius-circle)',
      background: fill,
      boxShadow: glow ? shadow : 'none',
      flexShrink: 0,
      ...style
    }
  });
}

/** Ring — a hairline concentric accent. Quiet geometry behind numerals and orbs. */
function Ring({
  size = 160,
  tone = 'coral',
  width = 1.5,
  style
}) {
  const color = {
    coral: 'var(--coral-300)',
    violet: 'var(--violet-300)',
    sky: 'var(--sky-300)',
    moss: 'var(--moss-300)',
    ink: 'var(--ink-200)'
  }[tone] || 'var(--coral-300)';
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: 'var(--radius-circle)',
      border: width + 'px solid ' + color,
      flexShrink: 0,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Orb, Ring });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/slide/Orb.jsx", error: String((e && e.message) || e) }); }

// components/slide/Pill.jsx
try { (() => {
/**
 * Pill — a gradient capsule bar, optionally carrying an orb marker riding on
 * top of it (as seen in the icebreaker slide). Purely decorative / progress UI.
 */
function Pill({
  fill = 'coral',
  height = 28,
  marker,
  style
}) {
  const bg = fill === 'rainbow' ? "url('../assets/bars/bar-rainbow-spectrum.png')" : "url('../assets/bars/bar-coral.png')";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: height + (marker ? 20 : 0),
      display: 'flex',
      alignItems: 'center',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height,
      borderRadius: 'var(--radius-pill)',
      backgroundImage: bg,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }), marker && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: marker,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: height * 1.6,
      height: height * 1.6,
      borderRadius: '50%',
      background: 'var(--accent-secondary)',
      boxShadow: 'var(--glow-violet)'
    }
  }));
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/slide/Pill.jsx", error: String((e && e.message) || e) }); }

// components/slide/SectionLabel.jsx
try { (() => {
/**
 * SectionLabel — small uppercase eyebrow label ("TREND 1", "00 - Intro")
 * used above a section headline.
 */
function SectionLabel({
  children,
  tone = 'coral',
  style
}) {
  const color = tone === 'violet' ? 'var(--accent-secondary)' : 'var(--accent-primary)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-small)',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/slide/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// components/slide/Specimen.jsx
try { (() => {
/* ============================================================
   Specimen library
   Transparent-background PNG cutouts of period naturalist artwork,
   living in assets/botanical/. Register filenames here — every
   component below draws from this map. Any family left empty
   renders as a labelled placeholder disc, so layouts can be built
   before the art lands.
   Naming: <family>-<nn>.png  e.g. bloom-01.png, wing-04.png
   ============================================================ */
const SPECIMENS = {
  // single flowers, face-on or three-quarter
  bloom: ['bloom-01.png', 'bloom-02.png', 'bloom-02-b.png', 'bloom-02-c.png', 'bloom-02-d.png', 'bloom-02-e.png', 'bloom-03.png', 'bloom-04.png', 'bloom-05.png', 'bloom-06.png', 'bloom-07.png', 'bloom-08.png', 'bloom-09.png', 'bloom-10.png', 'bloom-11.png'],
  // single leaves, foliage, large blades
  leaf: ['leaf-01.png', 'leaf-01-e.png', 'leaf-02.png', 'leaf-03.png', 'leaf-04.png', 'leaf-05.png', 'leaf-06.png', 'leaf-07.png', 'leaf-08.png', 'leaf-09.png'],
  // buds, seed heads, small branches
  sprig: ['sprig-01.png', 'sprig-02.png', 'sprig-02-e.png', 'sprig-03.png', 'sprig-04.png', 'sprig-05.png', 'sprig-06.png', 'sprig-07.png', 'sprig-08.png'],
  // butterflies, moths and beetles
  wing: ['wing-01.png', 'wing-01-b.png', 'wing-01-e.png', 'wing-02.png', 'wing-03.png', 'wing-04.png', 'wing-05.png', 'wing-06.png', 'wing-07.png', 'wing-08.png', 'wing-09.png', 'wing-10.png', 'wing-11.png', 'wing-12.png']
};
const DEFAULT_BASE = 'assets/botanical/';
function assetBase(base) {
  if (base) return base;
  if (typeof window !== 'undefined' && window.ITM_BOTANICAL_BASE) return window.ITM_BOTANICAL_BASE;
  return DEFAULT_BASE;
}

/* Deterministic 0..1 from an integer — keeps a composition identical
   between renders and between exports. */
function rnd(i, salt) {
  const x = Math.sin((i + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function pool(families) {
  const out = [];
  const lists = families.map(f => (SPECIMENS[f] || []).map(n => f + '/' + n));
  // Interleave families so a glyph never runs three leaves in a row.
  for (let i = 0; i < Math.max(...lists.map(l => l.length), 0); i++) lists.forEach(l => {
    if (l[i]) out.push(l[i]);
  });
  return out;
}

/* ---- Glyph skeletons -------------------------------------------------
   Each glyph is one or more polylines on a 100x100 grid. Specimens are
   distributed along the total stroke length, so the number of pieces is
   a density setting rather than a fixed layout. ---------------------- */
function ellipse(rx, ry, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = i / n * Math.PI * 2 - Math.PI / 2;
    pts.push([50 + Math.cos(a) * rx, 50 + Math.sin(a) * ry]);
  }
  return pts;
}
const GLYPHS = {
  '0': [ellipse(32, 44, 16)],
  '1': [[[26, 24], [50, 10], [50, 90]], [[26, 93], [74, 93]]],
  '2': [[[18, 28], [32, 12], [54, 8], [73, 20], [72, 40], [52, 56], [22, 90], [80, 90]]],
  '3': [[[20, 16], [45, 8], [68, 18], [61, 40], [44, 48], [66, 57], [71, 78], [47, 92], [22, 84]]],
  '4': [[[62, 6], [14, 66]], [[8, 66], [92, 66]], [[64, 30], [64, 94]]],
  '5': [[[74, 10], [30, 10], [26, 42], [52, 37], [72, 51], [70, 78], [44, 92], [20, 83]]],
  '6': [[[70, 12], [40, 21], [24, 51], [26, 76], [46, 92], [68, 83], [73, 61], [53, 50], [30, 56]]],
  '7': [[[19, 10], [80, 10], [44, 92]]],
  '8': [[[50, 9], [70, 18], [72, 32], [50, 45], [28, 32], [30, 18], [50, 9]], [[50, 45], [74, 56], [76, 74], [50, 92], [24, 74], [26, 56], [50, 45]]],
  '9': [[[62, 50], [38, 57], [24, 40], [34, 16], [58, 8], [74, 25], [72, 57], [61, 84], [40, 92]]],
  'I': [[[26, 10], [74, 10]], [[50, 10], [50, 90]], [[26, 90], [74, 90]]],
  'T': [[[16, 10], [84, 10]], [[50, 12], [50, 92]]],
  'M': [[[16, 92], [16, 10], [50, 58], [84, 10], [84, 92]]]
};
function strokeLength(p) {
  let l = 0;
  for (let i = 1; i < p.length; i++) l += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return l;
}
function sampleStroke(p, n) {
  const total = strokeLength(p),
    out = [];
  for (let k = 0; k < n; k++) {
    let d = total * (n === 1 ? 0.5 : k / (n - 1)),
      i = 1;
    while (i < p.length - 1 && d > Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])) {
      d -= Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
      i++;
    }
    const seg = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]) || 1;
    const t = Math.min(1, d / seg);
    out.push([p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t]);
  }
  return out;
}
function glyphNodes(glyph, count) {
  const strokes = GLYPHS[String(glyph).toUpperCase()] || GLYPHS['5'];
  const lens = strokes.map(strokeLength),
    total = lens.reduce((a, b) => a + b, 0);
  const nodes = [];
  strokes.forEach((s, si) => {
    const n = Math.max(2, Math.round(count * (lens[si] / total)));
    sampleStroke(s, n).forEach(pt => nodes.push(pt));
  });
  return nodes;
}

/* ---- Components ----------------------------------------------------- */

/** One cutout. Sized by its long edge; aged artwork is never recoloured. */
function Specimen({
  name,
  family = 'bloom',
  size = 180,
  rotate = 0,
  flip = false,
  opacity = 1,
  base,
  style,
  alt = ''
}) {
  size = Number(size) || 180;
  const file = name || (SPECIMENS[family] || [])[0];
  const t = 'rotate(' + rotate + 'deg)' + (flip ? ' scaleX(-1)' : '');
  const box = {
    width: size,
    height: size,
    transform: t,
    opacity,
    flexShrink: 0,
    ...style
  };
  if (!file) {
    return /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        ...box,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 'var(--radius-circle)',
        background: 'repeating-linear-gradient(135deg, rgba(51,48,42,.10) 0 5px, rgba(51,48,42,0) 5px 10px)',
        border: '1px dashed rgba(51,48,42,.28)',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: Math.max(7, Math.min(11, size * 0.11)),
        color: 'var(--paper-ink-muted)',
        letterSpacing: '.04em'
      }
    }, family));
  }
  const src = file.indexOf('/') > -1 ? assetBase(base) + file.split('/').pop() : assetBase(base) + file;
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    "aria-hidden": alt ? undefined : 'true',
    style: {
      ...box,
      objectFit: 'contain',
      display: 'block'
    }
  });
}

/** A numeral or letter built from specimens strung along its stroke —
 *  the title-slide device. Digits 0-9 plus I, T, M. */
function SpecimenGlyph({
  glyph = '5',
  size = 620,
  count = 14,
  families = ['bloom', 'leaf', 'sprig'],
  piece,
  jitter = 1,
  seed = 3,
  base,
  style,
  children
}) {
  size = Number(size) || 620;
  count = Number(count) || 14;
  jitter = Number(jitter);
  if (!isFinite(jitter)) jitter = 1;
  const nodes = glyphNodes(glyph, count);
  const items = pool(families);
  const unit = piece || size * 0.24;
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'relative',
      width: size * 0.8,
      height: size,
      ...style
    }
  }, nodes.map(([x, y], i) => {
    const r1 = rnd(i, seed),
      r2 = rnd(i, seed + 7),
      r3 = rnd(i, seed + 13);
    const s = unit * (0.6 + r1 * 0.7);
    const file = items.length ? items[i % items.length] : null;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: 'absolute',
        left: x + (r2 - 0.5) * 5 * jitter + '%',
        top: y + (r3 - 0.5) * 4 * jitter + '%',
        transform: 'translate(-50%,-50%)',
        zIndex: Math.round(s)
      }
    }, /*#__PURE__*/React.createElement(Specimen, {
      name: file ? file.split('/').pop() : null,
      family: file ? file.split('/')[0] : families[i % families.length],
      size: s,
      rotate: (r2 - 0.5) * 34 * jitter,
      flip: r3 > 0.62,
      base: base
    }));
  }), children);
}

/** Low-opacity specimens drifting behind a text block. Fills its
 *  positioned parent; never sits inside the text column. */
function SpecimenScatter({
  count = 6,
  size = 280,
  families = ['leaf', 'sprig', 'wing'],
  opacity = 'var(--specimen-scatter-opacity)',
  seed = 11,
  base,
  style
}) {
  count = Number(count) || 6;
  size = Number(size) || 280;
  const items = pool(families);
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      opacity,
      ...style
    }
  }, Array.from({
    length: count
  }, (_, i) => {
    const r1 = rnd(i, seed),
      r2 = rnd(i, seed + 5),
      r3 = rnd(i, seed + 9),
      r4 = rnd(i, seed + 17);
    const file = items.length ? items[i % items.length] : null;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: 'absolute',
        left: 4 + r1 * 88 + '%',
        top: 4 + r2 * 86 + '%',
        transform: 'translate(-50%,-50%)'
      }
    }, /*#__PURE__*/React.createElement(Specimen, {
      name: file ? file.split('/').pop() : null,
      family: file ? file.split('/')[0] : families[i % families.length],
      size: size * (0.5 + r3 * 0.8),
      rotate: (r4 - 0.5) * 40,
      flip: r3 > 0.5,
      base: base
    }));
  }));
}

/** An aged-paper ground with optional grain. The only surface a
 *  specimen may sit on. */
function Paper({
  tone = 'cream',
  grain = true,
  radius = 0,
  children,
  style
}) {
  const bg = {
    cream: 'var(--paper-cream)',
    sage: 'var(--paper-sage)',
    tan: 'var(--paper-tan)'
  }[tone] || 'var(--paper-cream)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: bg,
      color: 'var(--paper-ink)',
      borderRadius: radius,
      overflow: 'hidden',
      ...style
    }
  }, grain && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--grain)',
      opacity: 'var(--grain-opacity)',
      mixBlendMode: 'var(--grain-blend)',
      pointerEvents: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { SPECIMENS, GLYPHS, glyphNodes, Specimen, SpecimenGlyph, SpecimenScatter, Paper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/slide/Specimen.jsx", error: String((e && e.message) || e) }); }

// components/slide/Wash.jsx
try { (() => {
const WASHES = {
  cream: 'var(--wash-cream)',
  'violet-sky': 'var(--wash-violet-sky)',
  'cool-pale': 'var(--wash-cool-pale)',
  spectrum: 'var(--wash-spectrum)',
  dark: 'var(--wash-dark)'
};

/** Wash — a full-bleed gradient panel for section-break slides and hero
 *  cards. Replaces the rasterised gradient PNGs from the source deck. */
function Wash({
  variant = 'cream',
  radius = 0,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: WASHES[variant] || WASHES.cream,
      borderRadius: radius,
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Wash });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/slide/Wash.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.AvatarGroup = __ds_scope.AvatarGroup;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.ICON_PATHS = __ds_scope.ICON_PATHS;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.DataBar = __ds_scope.DataBar;

__ds_ns.Legend = __ds_scope.Legend;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Connector = __ds_scope.Connector;

__ds_ns.NumberBadge = __ds_scope.NumberBadge;

__ds_ns.Orb = __ds_scope.Orb;

__ds_ns.Ring = __ds_scope.Ring;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.SPECIMENS = __ds_scope.SPECIMENS;

__ds_ns.GLYPHS = __ds_scope.GLYPHS;

__ds_ns.Specimen = __ds_scope.Specimen;

__ds_ns.SpecimenGlyph = __ds_scope.SpecimenGlyph;

__ds_ns.SpecimenScatter = __ds_scope.SpecimenScatter;

__ds_ns.Paper = __ds_scope.Paper;

__ds_ns.Wash = __ds_scope.Wash;

})();
