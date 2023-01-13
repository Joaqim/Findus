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
    // eslint-disable-next-line prettier/prettier
  };

  // U-0650 - Arabic Kasra: https://unicodeplus.com/U+0650
  return description
    .replace(/u650/, "")
    .replace("ö", "ö") // Imposter ö, a small 'o' with an umlaut
    .replace(/[[\]^{|}~·ö–]/g, (c) => replacement[c]);
};

export default sanitizeTextForFortnox;
