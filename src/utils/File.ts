export async function getCsvFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if the file is a CSV file
    if (!file.name.endsWith(".csv")) {
      reject("The provided file is not a CSV file.");
      return;
    }

    const reader = new FileReader();

    // Handle file reading success
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string" && result.length > 0) {
        resolve(result);
      } else {
        reject("The file is empty or couldn't be read as text.");
      }
    };

    // Handle file reading errors
    reader.onerror = () => {
      reject(`Error reading file: ${reader.error?.message}`);
    };

    // Start reading the file
    reader.readAsText(file);
  });
}

export function filterCsvHeaders({
  csvContent,
  keywordMatchThreshold = 3,
  expectedHeaders,
}: {
  csvContent: string;
  keywordMatchThreshold?: number;
  expectedHeaders: string[];
}): string {
  // Split the CSV content into lines
  const lines = csvContent.split("\n");

  // Count the number of keyword matches in the first line
  const matchCount = expectedHeaders.reduce(
    (count, keyword) =>
      lines[0].toLowerCase().includes(keyword.toLowerCase())
        ? count + 1
        : count,
    0
  );

  // If the match count meets or exceeds the threshold, assume it's the header and remove it
  if (matchCount >= keywordMatchThreshold) {
    return lines.slice(1).join("\n");
  }

  // If not, return the original content
  return csvContent;
}
