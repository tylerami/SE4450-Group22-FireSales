import { parseDateString } from "./Date";
import { ReferralLinkType } from "models/enums/ReferralLinkType";
import { findClosestMatch } from "./String";
import { Client } from "models/Client";
import { AffiliateDeal } from "models/AffiliateDeal";
import { AffiliateLink } from "models/AffiliateLink";
import { Customer } from "models/Customer";
import { Conversion } from "models/Conversion";

// CSV ROW MAPPING
export const mapCsvRowToConversion = ({
  csvRow,
  clients,
  assignmentCode,
}: {
  csvRow: string;
  clients: Client[];
  assignmentCode: string;
}): Conversion | null => {
  const columnCount = csvRow
    .split(",")
    .filter((item) => item.trim() !== "").length;

  const values: string[] = csvRow.split(",");

  const dateString: string = values[columnCount - 6];
  let dateOccurred: Date | null;

  try {
    dateOccurred = parseDateString(dateString, "yyyy-mm-dd");
    if (dateOccurred === null) {
      console.log("Invalid date");
      return null;
    }
  } catch (e: any) {
    console.log(e, dateString, csvRow);
    return null;
  }

  const sportsbookName: string = values[columnCount - 5];
  const typeString: string = values[columnCount - 4]?.toLowerCase();
  const referralType: ReferralLinkType = typeString.includes("sports")
    ? ReferralLinkType.sports
    : ReferralLinkType.casino;

  const matchedClient: Client | null = findClosestMatch<Client>(
    sportsbookName,
    clients,
    (client) => client.name
  );
  if (matchedClient === null) {
    console.log("No client match");
    return null;
  }

  const betSize = Number(values[columnCount - 3].replaceAll("$", ""));
  const commission = Number(values[columnCount - 2].replaceAll("$", ""));
  const customerName = values[columnCount - 1];

  const matchedAffiliateDeal: AffiliateDeal | undefined = Object.values(
    matchedClient.affiliateDeals
  ).find(
    (deal) =>
      deal.clientId === matchedClient.id &&
      (deal.type === referralType || deal.type === null)
  );
  if (matchedAffiliateDeal === undefined) {
    console.log("No affiliate deal match");
    return null;
  }

  const affiliateLink: AffiliateLink = new AffiliateLink({
    clientId: matchedClient.id,
    clientName: matchedClient.name,
    type: referralType,
    link: matchedAffiliateDeal.link,
    commission,
    minBetSize: betSize,
    cpa: matchedAffiliateDeal.cpa,
  });

  console.log("creating conversion with assignment code", assignmentCode);

  const conversion: Conversion = new Conversion({
    dateOccurred,
    assignmentCode,
    affiliateLink,
    amount: betSize,
    customer: new Customer({
      fullName: customerName,
    }),
  });

  console.log("created conversion", conversion);
  return conversion;
};

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
