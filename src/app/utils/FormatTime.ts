export function formatTime(timeString: string) {
  const dateObject = new Date(timeString);
  const hours = dateObject.getUTCHours().toString().padStart(2, '0');
  const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');

  const formattedTime = hours + ':' + minutes;

  return formattedTime;
}
