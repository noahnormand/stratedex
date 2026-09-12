import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base = nom du repo GitHub (https://github.com/noahnormand/stratedex)
export default defineConfig({
  plugins: [react()],
  base: "/stratedex/",
});
