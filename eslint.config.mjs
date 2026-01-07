import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import pluginPrettier from "eslint-plugin-prettier";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import pluginUnusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore patterns
  {
    ignores: [
      ".git/",
      ".next/",
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      "*.min.js",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "*.d.ts",
      ".pnpm-store/",
      "pnpm-lock.yaml",
    ],
  },
  // Extends Next.js configs (includes React, TypeScript, and Core Web Vitals)
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Custom configuration
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "unused-imports": pluginUnusedImports,
      "simple-import-sort": pluginSimpleImportSort,
      prettier: pluginPrettier,
    },
    rules: {
      // Prettier integration
      "prettier/prettier": "error",

      // TypeScript specific
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/no-unused-vars": "off", // Handled by unused-imports
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": false,
          "ts-ignore": false,
          "ts-nocheck": true,
          "ts-check": false,
        },
      ],

      // Import management
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "no-duplicate-imports": "off", // Conflicts with type imports

      // React specific (minimal, as Next.js config handles most)
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],

      // Best practices
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",

      // Disabled rules that are too strict or handled by Prettier
      "padding-line-between-statements": "off",
      quotes: "off", // Handled by Prettier
      "template-curly-spacing": "off", // Handled by Prettier,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
