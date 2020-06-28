/**
 * Interval time 1 hour (60 * 60 * 1000 ms)
 * Up to 5000 requests per ip
 */
export const API_REQUEST_RATE_LIMIT = {
  windowMs: 60 * 60 * 1000,
  max: 5000,
};
