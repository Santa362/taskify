import React from 'react';

const base = {
  width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
};
const make = (children) => (props) => <svg {...base} {...props}>{children}</svg>;

export const HomeIcon = make(<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>);
export const ClockIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const CheckCircleIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>);
export const PlusCircleIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>);
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />);
export const ClipboardIcon = make(<><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9z" /><path d="M9 12l2 2 4-4" /></>);
export const CalendarIcon = make(<><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M16 3v4M8 3v4M4 11h16" /></>);
export const PencilIcon = make(<><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13 7l4 4" /></>);
export const TrashIcon = make(<><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></>);
export const SunIcon = make(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></>);
export const MoonIcon = make(<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" />);
export const CloseIcon = make(<path d="M6 6l12 12M18 6L6 18" />);
export const CheckIcon = make(<path d="M5 12l5 5 9-10" />);
