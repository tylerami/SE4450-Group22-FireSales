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

export function parseDateString(
  dateStr: string,
  format: "yyyy-mm-dd" | "yyyy-dd-mm"
): Date {
  // Split the date string into parts
  const parts = dateStr.split("-");

  // Validate parts length
  if (parts.length !== 3) {
    throw new Error("Invalid date format");
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
