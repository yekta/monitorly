import type { TMonitor } from './monitor.types.js';

export const monitors: TMonitor[] = [
  // Example monitors
  // Remove the examples and add your own below. ID, title and functionToRun are required.
  {
    id: 'website',
    title: 'Website',
    // Simple example to check if a website is up
    functionToRun: async () => {
      const res = await fetch('https://example.com');
      if (res.status !== 200) {
        return false;
      }
      return true;
    }
  },
  {
    id: 'api',
    title: 'API',
    // An example with multiple async processes
    functionToRun: async () => {
      function waitAndGetRandomNumber() {
        return new Promise<number>((resolve) => {
          setTimeout(() => {
            const randomNumber = Math.random();
            resolve(randomNumber);
          }, 1000);
        });
      }

      const randomNumberPromise1 = waitAndGetRandomNumber();
      const randomNumberPromise2 = waitAndGetRandomNumber();

      const result = await Promise.all([randomNumberPromise1, randomNumberPromise2]);
      const isAllGood = result.every((number) => number > 0.01);

      return isAllGood;
    }
  },
  {
    id: 'docs',
    title: 'Docs',
    // An example with the bare minimum
    functionToRun: async () => {
      return true;
    }
  }
];
