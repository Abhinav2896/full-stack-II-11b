import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import platformsReducer from '../features/platforms/platformsSlice';

// configureStore sets up the Redux store with good defaults:
// 1. Automatically combines slices/reducers.
// 2. Adds default middleware like redux-thunk for async operations.
// 3. Enables Redux DevTools extension integration.
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
  },
});
