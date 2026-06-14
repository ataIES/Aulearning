const isDev = import.meta.env.DEV;

export const logger = {
  info: (message, data = null) => {
    if (isDev) {
      console.info(`[INFO] ${message}`, data);
    }
  },

  error: (message, data = null) => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, data);
    }
  },

  warn: (message, data = null) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, data);
    }
  },
};