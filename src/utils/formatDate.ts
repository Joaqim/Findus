const formatDate = (date: Date, timezoneOffset?: number): string => {
  const offset = timezoneOffset ?? date.getTimezoneOffset();
  date = new Date(new Date(date).getTime() - offset * 60 * 1000);
  return date.toISOString().split("T")[0];
};
export default formatDate;
