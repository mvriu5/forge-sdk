# Forge SDK
Lean React + TypeScript starter for building reusable widgets with Vite.

## Quickstart
1. Install dependencies: `npm install`
2. Build the SDK bundles: `npm run build` (outputs ESM, CJS, and type declarations in `dist/`).

# How to build a widget
- Define your widget with `defineWidget` from `src/runtime.tsx`; type props with the interfaces in `src/types.ts`.
- Your React component receives `widget`, `editMode`, and optionally `config` plus `updateConfig` for persisting changes.
- Provide preview metadata (title, description, image, tags, sizes) directly in `defineWidget` for gallery-like listings.
- Optionally set `defaultConfig`, `integration` (e.g., `"github" | "google"`), or `onConfigChange` for handling updates.

```tsx
import { defineWidget } from "@forge/sdk" // adjust path or alias as needed

export const WeatherWidget = defineWidget({
  name: "Weather",
  component: WeatherWidget,
  description: "Current weather",
  image: "/previews/weather.png",
  tags: ["info", "weather"],
  sizes: {
    desktop: { width: 2, height: 1 },
    tablet: { width: 1, height: 1 },
    mobile: { width: 1, height: 1 }
  },
  defaultConfig: { city: "Berlin" }
})
````

## What’s included
- React 19 + TypeScript
- Vite build for ESM/CJS with type exports (`src/index.ts`)