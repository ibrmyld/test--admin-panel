import ReactGA from 'react-ga4';

// Google Analytics konfigürasyonu
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID, {
    debug: import.meta.env.DEV,
    testMode: import.meta.env.DEV,
  });
};

export const trackPageView = (path) => {
  ReactGA.send({ 
    hitType: "pageview", 
    page: path,
    title: document.title 
  });
};

export const trackEvent = (action, category = 'User Interaction', label = '', value = 0) => {
  ReactGA.event({
    action,
    category,
    label,
    value
  });
};

export const trackCustomEvent = (eventName, parameters = {}) => {
  ReactGA.gtag('event', eventName, parameters);
};

// Admin spesifik event'ler
export const trackAdminAction = (action, details = {}) => {
  trackCustomEvent('admin_action', {
    action_type: action,
    ...details,
    user_type: 'admin'
  });
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackCustomEvent,
  trackAdminAction
};
