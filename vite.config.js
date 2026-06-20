import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// NOTE: `base` must match your GitHub repo name for GitHub Pages.
// If your repo is github.com/<user>/itgc-interview-prep, leave this as-is.
// If you name the repo something else, change "/itgc-interview-prep/" to "/<your-repo-name>/".
export default defineConfig({
  plugins: [react()],
  base: "/itgc-prep/",
});
