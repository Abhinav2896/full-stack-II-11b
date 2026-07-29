# Redux Toolkit Posts & Platforms App

A modern React application that demonstrates centralized, normalized state management using **Redux Toolkit** and a striking, custom **Material UI (MUI)** interface featuring a hybrid **Glassmorphism** and **Neumorphism** design system.

## 🚀 Key Features

*   **Redux Toolkit (RTK)**: State management is handled entirely with RTK.
*   **Normalized State**: Uses `createEntityAdapter` to maintain a flat, predictable state shape (`{ ids: [], entities: {} }`), preventing data duplication and ensuring O(1) lookups for both posts and platforms.
*   **Asynchronous Data Flows**: Handles simulated backend API requests gracefully using `createAsyncThunk` to manage `idle`, `loading`, `succeeded`, and `failed` lifecycles without boilerplate.
*   **Material UI (MUI) v9**: Component-driven architecture using robust MUI components and custom theme overrides.
*   **Glassmorphism & Neumorphism Hybrid UI**:
    *   **Glass Surfaces**: Panels and cards render as translucent, blurred elements sitting above a dynamic ambient background utilizing real platform brand colors (LinkedIn, Twitter, Instagram, Dev.to).
    *   **Neumorphic Controls**: Buttons, inputs, and chips feature extruded/pressed tactile shadows that react organically to clicks and hovers.

## 🛠️ Tech Stack & Libraries Used

The project is built using a modern, fast, and light web application stack:

### Core Frameworks & Bundlers
- **React 19** (`react` & `react-dom` `^19.2.7`): Leveraging React 19's rendering optimizations and modern component patterns.
- **Vite 8** (`vite` `^8.1.1`): Next-generation frontend tooling providing lightning-fast Hot Module Replacement (HMR) and optimized build times.

### State Management
- **Redux Toolkit** (`@reduxjs/toolkit` `^2.12.0`): The official, opinionated, batteries-included toolset for efficient Redux development. Key RTK APIs utilized include:
  - `createSlice`: Defines slice state, reducers, and extra-reducers.
  - `createAsyncThunk`: Handles asynchronous operations and actions dispatching.
  - `createEntityAdapter`: Normalizes states for O(1) data fetching.
- **React Redux** (`react-redux` `^9.3.0`): Official bindings for React to subscribe and dispatch to the Redux store.

### UI Library & Styling
- **Material UI v9** (`@mui/material` `^9.2.0`): Component framework that drives our responsive layout grid, form controls, cards, dialogs, and navigation elements.
- **Emotion** (`@emotion/react` `^11.14.0`, `@emotion/styled` `^11.14.1`): CSS-in-JS library powering MUI's customizable style engine.
- **React Icons & MUI Icons** (`react-icons` `^5.7.0`, `@mui/icons-material` `^9.2.0`): Crisp, high-fidelity SVGs for social media brand logos (such as Dev.to) and standard action buttons.

### Dev Tools & Linters
- **Oxlint** (`oxlint` `^1.71.0`): An ultra-fast JavaScript/TypeScript linter written in Rust, running in milliseconds to ensure high code quality.

---

## 🎨 UI/UX Design System Details

The visual system is engineered to look premium, dynamic, and highly tactile. It merges two modern aesthetics:

### 1. Dynamic Ambient Background
- The background utilizes a multi-layered absolute wrapper (`.ambient-wrapper`) with large, blurred colored blobs that map to real social media brand colors.
- These blur elements create a warm glowing depth effect:
  - **LinkedIn Blob**: `#0A66C2` (60vw size, top-left blur)
  - **Twitter Blob**: `#1DA1F2` (50vw size, top-right blur)
  - **Instagram Blob**: `linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)` (55vw size, bottom-right blur)
  - **Dev.to Blob**: `#0A0A0A` (40vw size, bottom-left blur)

### 2. Glassmorphic Surface Recipe
Frosted glass styling is implemented for container panels (`MuiPaper`) and post cards (`MuiCard`) through custom theme overrides in `theme.js`:
- **Background**: Translucent white fill (`rgba(255, 255, 255, 0.55)`)
- **Blur Filter**: `backdrop-filter: blur(20px)` and `-webkit-backdrop-filter: blur(20px)`
- **Outline**: Thin, crisp boundary (`1px solid rgba(255, 255, 255, 0.6)`)
- **Shadow**: Subtle floating drop-shadow (`rgba(31, 38, 135, 0.15)`)

### 3. Neumorphic Interaction Physics
Inputs, buttons, and chips use light/dark inset or raised shadow offsets (`--neu-light` and `--neu-dark` variables) to convey physical dimension:
- **Raised Controls (Default)**: Use dual-shadow offsets simulating extruded physical buttons:
  - Small: `3px 3px 6px var(--neu-dark), -3px -3px 6px var(--neu-light)`
  - Medium: `4px 4px 8px var(--neu-dark), -4px -4px 8px var(--neu-light)`
  - Large: `6px 6px 12px var(--neu-dark), -6px -6px 12px var(--neu-light)`
- **Inset Controls (Active/Focused)**: Use internal shadows to look "pressed in":
  - Small: `inset 2px 2px 4px var(--neu-dark), inset -2px -2px 4px var(--neu-light)`
  - Medium: `inset 2px 2px 5px var(--neu-dark), inset -2px -2px 5px var(--neu-light)`
  - Large: `inset 4px 4px 8px var(--neu-dark), inset -4px -4px 8px var(--neu-light)`
- **Vibrant Active States**: Active filters or selected platforms apply dynamic color overlays (e.g., `10% opacity hex` of brand colors) matching their social network profiles.

### 4. Micro-Animations & Motion Design
- **Hover Lifting**: Cards translate upward slightly (`transform: translateY(-2px)`) and increase shadow dispersion (`box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2)`) on pointer hover.
- **Staggered Entrance**: Card grid items animate on mount with staggered `Fade` component timers (`index * 50ms` delay) for an organic flow.
- **Organic Deletion**: When deleting a post, a React-coordinated `Collapse` transition animates the item fading and sliding up before the Redux action is dispatched, avoiding sudden UI layout jumps.
- **Tactile Inputs**: Inputs and buttons shrink slightly (`transform: scale(0.98)`) and toggle to inset shadow styles on click.

### 5. Accessibility & Performance
- **Reduced Motion**: Media queries (`@media (prefers-reduced-motion)`) disable all transitions/animations for users with motion sensitivity.
- **Focus Rings**: Standardizes focus outlines with a distinct 2px offset border styling (`:focus-visible`).
- **Aria Labels**: Proper labels are attached on action triggers (e.g., `aria-label="Delete this post"`).

---

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

---

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
