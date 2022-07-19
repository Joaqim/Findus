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
  };
  return description.replace(/[[\]^{|}~–]/g, (c) => replacement[c]);
};

export default sanitizeTextForFortnox;
