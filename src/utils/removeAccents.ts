const accents: Record<string, string> = {
  'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
  'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
  'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
  'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
  'ã': 'a', 'õ': 'o', 'ñ': 'n',
  'ç': 'c',
};

export default function removeAccents(value: string): string {
  return Array
    .from(value)
    .map((char) => char.replace(/[^\u0000-\u007E]/g, (c) => accents[c] || c))
    .join("");
}
