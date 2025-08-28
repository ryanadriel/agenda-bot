function parseDateTime(date, time) {
  const dateTimeString = `${date}T${time}:00`;
  const dateTime = new Date(dateTimeString);
  if (isNaN(dateTime)) return null;
  return dateTime;
}

module.exports = { parseDateTime };