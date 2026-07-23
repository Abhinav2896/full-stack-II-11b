import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { fetchPlatformsFromAPI } from './platformsAPI';

// Normalized state structure for platforms
const platformsAdapter = createEntityAdapter();

const initialState = platformsAdapter.getInitialState({
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  selectedPlatformId: null, // Tracks the currently active platform filter
});

// Async thunk for fetching platforms
export const fetchPlatforms = createAsyncThunk('platforms/fetchPlatforms', async () => {
  const response = await fetchPlatformsFromAPI();
  return response;
});

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    addPlatform: platformsAdapter.addOne,
    removePlatform: platformsAdapter.removeOne,
    selectPlatform(state, action) {
      state.selectedPlatformId = action.payload; // action.payload should be the platform id (or null to clear)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatforms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        platformsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { addPlatform, removePlatform, selectPlatform } = platformsSlice.actions;

export default platformsSlice.reducer;

// Adapter Selectors
export const {
  selectAll: selectAllPlatforms,
  selectById: selectPlatformById,
} = platformsAdapter.getSelectors((state) => state.platforms);

// Custom selector to get the currently selected platform ID
export const selectSelectedPlatformId = (state) => state.platforms.selectedPlatformId;

// Derived memoized selector: get only posts that match the selected platform (or all if none selected)
// This imports selectAllPosts from postsSlice, combining data from two slices.
// We'll define this inside the components or here. To avoid circular dependencies, 
// sometimes it's better to keep it in a separate selectors file, but defining it here is okay if we import posts selectors dynamically or just do it in the component.
// We'll leave the combining to the component or a dedicated selector layer.
