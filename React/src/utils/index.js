import moment from "moment";

export function strTimeRangeToMomentRange(str) {
  return str.split(/ ?- ?/).map((timeStr) => moment(timeStr));
}

export function todayAtTimeMoment(hoursMinutesString) {
  // Expects this format: hh:mm a
  let { hours, minutes, period } = hoursMinutesString.match(
    /(?<hours>^\d\d?) ?: ?(?<minutes>\d\d) ?(?<period>[AaPp][Mm])/
  ).groups;

  hours = Number(hours);

  if (/[Aa]/.test(period) && hours === 12) {
    // If the time is 12 am
    hours = 0;
  }

  if (/[Pp]/.test(period) && hours !== 12) {
    // If the time is PM
    hours += 12;
  }

  return moment().hour(hours).minutes(minutes);
}

export function timeIsInRangeMoment(queryTime, timeRange) {
  return queryTime > timeRange[0] && queryTime < timeRange[1];
}

export function createDummyPassword() {
  return generateRandomString();
}

function generateRandomString() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function renderUSD(storageFormat) {
  const fixed = Number(storageFormat).toFixed(2);

  return "$" + fixed.toString();
}

export function toMilitaryTime(hourString) {
  // expects a string in the format
  //    hh:mm pp

  let { hours, minutes, period } = hourString.match(
    /(?<hours>^\d\d?) ?: ?(?<minutes>\d\d) ?(?<period>[AaPp][Mm])/
  ).groups;

  hours = Number(hours);

  if (/[Aa]/.test(period) && hours === 12) {
    // If the time is 12 am
    hours = 0;
  }

  if (/[Pp]/.test(period) && hours !== 12) {
    // If the time is PM
    hours += 12;
  }
  return `${hours}:${minutes}`;
}

export const capitalize = (word) =>
  word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();

export const toTitleCase = (str) => str.split(/[ _]/).map(capitalize).join(" ");

export const addMinutes = (momentDt, numMinutes) =>
  momentDt.clone().add(numMinutes, "minutes");

export const formatDate = (momentDt, formatString) =>
  momentDt.clone().format(formatString);
