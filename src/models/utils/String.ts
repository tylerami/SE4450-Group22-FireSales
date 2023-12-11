function levenshteinDistance(s: string, t: string): number {
  if (s === t) {
    return 0;
  }
  if (s.length === 0) {
    return t.length;
  }
  if (t.length === 0) {
    return s.length;
  }

  const matrix: number[][] = [];

  // Increment along the first column of each row
  for (let i = 0; i <= s.length; i++) {
    matrix[i] = [i];
  }

  // Increment each column in the first row
  for (let j = 0; j <= t.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      if (s.charAt(i - 1) === t.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Substitution
          Math.min(
            matrix[i][j - 1] + 1, // Insertion
            matrix[i - 1][j] + 1
          )
        ); // Deletion
      }
    }
  }

  return matrix[s.length][t.length];
}

export function percentageDifference(s: string, t: string): number {
  const levenshtein = levenshteinDistance(s, t);
  const percentage = levenshtein / Math.max(s.length, t.length);
  return percentage;
}

export function findClosestMatch<T>(
  keyword: string,
  options: T[],
  getOptionString: (T) => string,
  differenceThreshold: number = 0.3
): T | null {
  for (const option of options) {
    const optionString = getOptionString(option);
    if (
      optionString
        .toLowerCase()
        .replaceAll(" ", "")
        .includes(keyword.toLowerCase().replaceAll(" ", ""))
    ) {
      return option;
    }
  }

  const optionsWithScores = options.map((option) => {
    return {
      option,
      score: percentageDifference(
        keyword.toLowerCase().replaceAll(" ", ""),
        getOptionString(option).toLowerCase().replaceAll(" ", "")
      ),
    };
  });

  const sortedOptions = optionsWithScores.sort((a, b) => {
    return a.score - b.score;
  });

  if (sortedOptions[0].score < differenceThreshold) {
    return sortedOptions[0].option;
  } else {
    console.log("No match found", keyword, sortedOptions, differenceThreshold);
    return null;
  }
}

export function capitalizeEachWordFirstLetter(string: string): string {
  let words = string.split(" ");
  words = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return words.join(" ");
}
