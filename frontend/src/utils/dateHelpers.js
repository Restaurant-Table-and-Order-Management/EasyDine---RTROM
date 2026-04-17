/**
 * Format a date string (YYYY-MM-DD) to a readable format
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a time string (HH:mm:ss) to 12-hour format
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Format a time range
 */
export function formatTimeRange(startTime, endTime) {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getTodayDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Get current time as HH:mm:ss
 */
export function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}

/**
 * Get a date relative to today
 */
export function getRelativeDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

/**
 * Check if a date is in the past
 */
export function isDatePast(dateStr) {
  const today = getTodayDate();
  return dateStr < today;
}

/**
 * Check if a date is today
 */
export function isToday(dateStr) {
  return dateStr === getTodayDate();
}

/**
 * Calculate hours until a reservation
 */
export function hoursUntil(dateStr, timeStr) {
  const target = new Date(`${dateStr}T${timeStr}`);
  const now = new Date();
  const diff = target - now;
  return Math.floor(diff / (1000 * 60 * 60));
}
