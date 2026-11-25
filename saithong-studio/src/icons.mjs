// Original line icons inherit the colour of their containing control.
const paths = {
  pen: '<path d="m4 20 3.5-9.5L16 2l6 6-8.5 8.5L4 20Zm3.5-9.5 6 6M4 20l5-5m5-11 6 6"/>',
  film: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="m3 8-1-4 17-3 1 4L3 8Zm3-5 3 3m3-4 3 3m-5 7 5 3-5 3Z"/>',
  cube: '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10 9-5M3 7l9 5v10m-4.5-17.5 9 5"/>',
  space: '<path d="M2 20h20M4 20V8l12-5 5 3v14M4 8l8 3 9-5M12 11v9m-5-7v4m10-6v5"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  play: '<path fill="currentColor" stroke="none" d="M7 3.8v16.4L20 12Z"/>',
  menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  search: '<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
  bulb: '<path d="M8 16c0-2-3-3-3-7a7 7 0 0 1 14 0c0 4-3 5-3 7H8Zm1 3h6m-5 3h4"/>',
  review: '<path d="M20 11a8 8 0 1 0-2 6M20 4v7h-7"/><path d="m8 12 3 3 5-6"/>',
  box: '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10 9-5M3 7l9 5v10"/>',
  expand: '<path d="M4 9V4h5m6 0h5v5M4 15v5h5m11-5v5h-5"/>',
  previous: '<path d="m14 6-6 6 6 6"/>',
  next: '<path d="m10 6 6 6-6 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  brief: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12c6 3 12 3 18 0m-9 0v3"/>'
};
export function icon(name, cls = '') {
  return `<svg class="icon ${cls}" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

