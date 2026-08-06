import React from 'react';

/**
 * Icon — the ITM 2627 line set. 24x24 grid, 1.75px stroke, round caps
 * and joins, geometric construction. Never mix in a second icon family.
 */
export const ICON_PATHS = {
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
  'zap': '<path d="M13.2 2.5 5 14h6l-1 7.5L19 10h-6.4z"/>',
};

export const ICON_NAMES = Object.keys(ICON_PATHS);

export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.75, title, style }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ flexShrink: 0, display: 'block', ...style }}
      dangerouslySetInnerHTML={{ __html: (title ? '<title>' + title + '</title>' : '') + d }}
    />
  );
}
