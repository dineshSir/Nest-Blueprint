export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//usage

// const randomId = getRandomInt(1000, 9999);
// console.log(randomId); // e.g. 4738
