// Mock API to simulate fetching posts from a backend
const initialPosts = [
  { id: 'p1', title: 'Understanding Redux Toolkit', content: 'RTK simplifies Redux development significantly by reducing boilerplate.', platformId: 'pf1', likes: 10 },
  { id: 'p2', title: 'Why normalized state matters', content: 'Normalization helps maintain a flat state shape, making updates O(1) and reducing bugs.', platformId: 'pf2', likes: 5 },
];

export const fetchPostsFromAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialPosts);
    }, 1000); // Simulate 1 second network latency
  });
};
