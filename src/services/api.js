// Simulated api helper to handle asynchronous transactions with delays
export const apiRequest = async (data, delay = 600) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};
