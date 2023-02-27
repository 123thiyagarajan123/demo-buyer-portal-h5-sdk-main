export function delay(milliseconds: number, value: boolean) {
  return new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      resolve(value);
    }, milliseconds);
  });
}
