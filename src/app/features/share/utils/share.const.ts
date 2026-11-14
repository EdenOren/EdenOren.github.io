export const SHARE_URL = 'https://edenoren.github.io/EdenOren.github.io/';
export const SHARE_TITLE = 'Eden Oren — Frontend Developer';
export const SHARE_TEXT = "Check out Eden Oren's portfolio";

export const SHARE_WHATSAPP_URL = `https://api.whatsapp.com/send?text=${encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL)}`;
export const SHARE_EMAIL_URL = `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(SHARE_URL)}`;
