import { parseDateString } from "./Date";
import { ReferralLinkType } from "models/enums/ReferralLinkType";
import { findClosestMatch } from "./String";
import { Client } from "models/Client";
import { AffiliateDeal } from "models/AffiliateDeal";
import { AffiliateLink } from "models/AffiliateLink";
import { Customer } from "models/Customer";
import { Conversion } from "models/Conversion";
import { ConversionType } from "models/enums/ConversionType";

type RawCsvRowData = {
  dateString: string;
  sportsbookName: string;
  typeString: string;
  betSizeString: string;
  commissionString: string;
  customerName: string;
  affiliateName: string;
};

const parseRowValues = (csvRow: string[]): RawCsvRowData => {
  // remove empty cells from the front and back of the row:
  let rawValues = csvRow.slice();
  while (rawValues[0] === "") {
    rawValues.shift();
  }
  while (rawValues[rawValues.length - 1] === "") {
    rawValues.pop();
  }

  const firstColumnIsNumber = !isNaN(Number(rawValues[0]));

  let i = firstColumnIsNumber ? 1 : 0;

  return {
    dateString: rawValues[i++]?.replaceAll("/", "-").replaceAll(" ", "") ?? "",
    sportsbookName: rawValues[i++] ?? "",
    typeString: rawValues[i++] ?? "",
    betSizeString: rawValues[i++]?.replaceAll("$", "") ?? "",
    commissionString: rawValues[i++]?.replaceAll("$", "") ?? "",
    customerName: rawValues[i++] ?? "",
    affiliateName: rawValues[i++] ?? "",
  };
};

// CSV ROW MAPPING
export const mapCsvRowToConversion = ({
  csvRow,
  clients,
}: {
  csvRow: string[];
  clients: Client[];
}): Conversion | null => {
  const rawValues: RawCsvRowData = parseRowValues(csvRow);

  // Parse date
  let dateOccurred: Date | null;
  try {
    dateOccurred = parseDateString(rawValues.dateString, "yyyy-mm-dd");
    if (dateOccurred === null) {
      console.log("Invalid date");
      return null;
    }
  } catch (e: any) {
    console.log(e, rawValues.dateString, csvRow);
    return null;
  }

  // Parse referral type
  let referralType: ReferralLinkType | null = null;
  if (rawValues.typeString.trim().toLowerCase().includes("sports")) {
    referralType = ReferralLinkType.sports;
  }
  if (rawValues.typeString.trim().toLowerCase().includes("casino")) {
    referralType = ReferralLinkType.casino;
  }

  // Find client
  const matchedClient: Client | null = findClosestMatch<Client>(
    rawValues.sportsbookName,
    clients,
    (client) => client.name
  );
  if (matchedClient === null) {
    console.log("No client match");
    return null;
  }

  // Parse bet size and commission
  const betSize = Number(rawValues.betSizeString);
  const commission = Number(rawValues.commissionString);

  // Parse customer name
  const customerName = rawValues.customerName;

  // Find affiliate deal
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

  // Create affiliate link
  const affiliateLink: AffiliateLink = new AffiliateLink({
    clientId: matchedClient.id,
    clientName: matchedClient.name,
    type: referralType,
    link: matchedAffiliateDeal.link,
    commission,
    minBetSize: betSize,
    cpa: matchedAffiliateDeal.cpa,
  });

  // Create assignment code
  const assignmentCode = rawValues.affiliateName
    .toUpperCase()
    .trim()
    .replaceAll(" ", "-");

  console.log("creating conversion with assignment code", assignmentCode);

  const conversion: Conversion = new Conversion({
    type: ConversionType.freeBet,
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

export async function getCsvFileContent(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    // Check if the file is a CSV file
    if (!file.name.endsWith(".csv")) {
      reject("The provided file is not a CSV file.");
      return;
    }

    const reader = new FileReader();

    // Handle file reading success
    reader.onload = (event) => {
      let result = event.target?.result;
      if (typeof result === "string" && result.length > 0) {
        let rawRows = result.split("\n");
        rawRows = rawRows.filter(
          (row) => row.replaceAll(",", "").trim() !== ""
        );
        let rows: string[][] = rawRows.map((row) => row.split(","));
        resolve(rows);
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
  csvContentRows,
  keywordMatchThreshold = 3,
  expectedHeaders,
}: {
  csvContentRows: string[][];
  keywordMatchThreshold?: number;
  expectedHeaders: string[];
}): string[][] {
  // Count the number of keyword matches in the first line
  const matchCount = expectedHeaders.reduce(
    (count, keyword) =>
      csvContentRows[0].join(" ").toLowerCase().includes(keyword.toLowerCase())
        ? count + 1
        : count,
    0
  );

  // If the match count meets or exceeds the threshold, assume it's the header and remove it
  if (matchCount >= keywordMatchThreshold) {
    return csvContentRows.slice(1);
  }

  // If not, return the original content
  return csvContentRows;
}
