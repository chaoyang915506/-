export function sleep(wait) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("ok");
    }, wait);
  });
}