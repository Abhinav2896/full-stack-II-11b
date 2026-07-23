// Mock API to simulate fetching platforms from a backend
const initialPlatforms = [
  { id: 'pf1', name: 'Dev.to' },
  { id: 'pf2', name: 'Twitter' },
  { id: 'pf3', name: 'LinkedIn' },
];

export const fetchPlatformsFromAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialPlatforms);
    }, 500); // Simulate network latency
  });
};
