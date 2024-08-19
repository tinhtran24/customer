export const stringCleaner = (input: string): any => {
  const afterTrim = input?.trim();
  const afterRemoveRedundantSpaces = afterTrim?.replace(/ {2,}/g, ' ');

  return afterRemoveRedundantSpaces || '';
};
