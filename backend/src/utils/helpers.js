import { URL } from 'url';
import validUrl from 'valid-url';

export const isValidUrl = (url) => {
  return validUrl.isUri(url);
};

export const generateShortCode = () => {
  // This is already handled by shortid in our routes
  return null;
};