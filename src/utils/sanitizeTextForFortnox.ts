const sanitizeTextForFortnox = (description: string): string => {
  const replacement: Record<string, string> = {
    "–": "-",
    "~": "-",
    "{": "(",
    "}": ")",
    "[": "(",
    "]": ")",
    "^": " ",
    "|": "-",
    "·": "-",
  };
  // U-0650 - Arabic Kasra: https://unicodeplus.com/U+0650
  // TODO: '·' can't seem to get replaced with a '-', removing it completely for now.
  return description
    .replace(/u650|·/, "")
    .replace(/[[\]^{|}~–]/g, (c) => replacement[c]);
};

export default sanitizeTextForFortnox;
