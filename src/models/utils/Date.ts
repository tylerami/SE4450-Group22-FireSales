export function formatDateString(date: Date | undefined) {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
}

export function formatDateStringWithTime(date: Date | undefined) {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const ampm = date.getHours() < 12 ? "AM" : "PM";
  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  } ${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  } ${ampm}`;
}

export function parseDateString(
  dateStr: string,
  format: "yyyy-mm-dd" | "yyyy-dd-mm"
): Date | null {
  if (!dateStr || dateStr.trim() === "") {
    return null;
  }

  // Split the date string into parts
  const parts = dateStr.split("-");

  // Validate parts length
  if (parts.length !== 3) {
    return null;
  }

  let year: number, month: number, day: number;

  // Extract year, month, and day based on the format
  if (format === "yyyy-mm-dd") {
    [year, month, day] = parts.map((part) => parseInt(part, 10));
  } else {
    // format is 'yyyy-dd-mm'
    [year, day, month] = parts.map((part) => parseInt(part, 10));
  }

  // JavaScript months are 0-indexed, so subtract 1
  month -= 1;

  // Create and return the date object
  return new Date(year, month, day);
}

export function firstDayOfCurrentMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
