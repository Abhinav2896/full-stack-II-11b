# Redux Toolkit Posts & Platforms App

A modern React application that demonstrates centralized state management using **Redux Toolkit** and a striking **Material UI (MUI)** interface featuring a hybrid Glassmorphism and Neumorphism design system.

## 🚀 Features

*   **Redux Toolkit (RTK)**: State management is handled entirely with RTK.
*   **Normalized State**: Uses `createEntityAdapter` to maintain a flat, predictable state shape (`{ ids: [], entities: {} }`), preventing data duplication and ensuring O(1) lookups for both posts and platforms.
*   **Asynchronous Data Flows**: Handles simulated backend API requests gracefully using `createAsyncThunk` to manage `idle`, `loading`, `succeeded`, and `failed` lifecycles without boilerplate.
*   **Material UI (MUI) v5**: Component-driven architecture using robust MUI components.
*   **Glassmorphism & Neumorphism Hybrid UI**:
    *   **Glass Surfaces**: Panels and cards render as translucent, blurred elements sitting above a dynamic ambient background utilizing real platform brand colors (LinkedIn, Twitter, Instagram, Dev.to).
    *   **Neumorphic Controls**: Buttons, inputs, and chips feature extruded/pressed tactile shadows that react organically to clicks and hovers.

## 🛠️ Technologies Used

*   **React 18** (bootstrapped with Vite)
*   **Redux Toolkit** (`@reduxjs/toolkit`)
*   **React-Redux**
*   **Material UI** (`@mui/material`, `@emotion/react`, `@emotion/styled`)
*   **Icons**: `@mui/icons-material` & `react-icons`

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed.

### Installation & Running Locally

1. Navigate to the project directory:
   ```bash
   cd redux-posts-platform
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/`.

## 📂 Project Structure

```
src/
├── app/
│   └── store.js                  # Redux store configuration
├── features/
│   ├── platforms/
│   │   ├── platformsAPI.js       # Mock API for fetching platforms
│   │   ├── platformsSlice.js     # Redux slice with createEntityAdapter
│   │   ├── PlatformForm.jsx      # Neumorphic Add Platform input
│   │   └── PlatformList.jsx      # Filter by wire using interactive chips
│   └── posts/
│       ├── postsAPI.js           # Mock API for fetching posts
│       ├── postsSlice.js         # Redux slice (EntityAdapter + AsyncThunk)
│       ├── PostForm.jsx          # Glassmorphism composer panel
│       ├── PostItem.jsx          # Individual post card with tactile actions
│       └── PostList.jsx          # Grid layout rendering all active posts
├── utils/
│   └── platformMap.jsx           # Mapping of platform names to brand colors/icons
├── App.jsx                       # Main application shell and layout
├── main.jsx                      # App entry point (Providers, Theme)
├── theme.js                      # Custom MUI theme (Glass + Neumorphism recipes)
└── index.css                     # Global styles and ambient background blobs
```
