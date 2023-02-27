export const prettify = (object: any): string => {
  return JSON.stringify(object, null, '\t');
};
