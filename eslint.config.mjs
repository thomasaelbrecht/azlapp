import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import next from "@next/eslint-plugin-next";
import prettier from "eslint-plugin-prettier/recommended";
import stylistic from "@stylistic/eslint-plugin";

export default [
  { ignores: ["src/components/ui"] },
  { files: ["src/**/*.{js,jsx,mjs,cjs,ts,tsx}"] },
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: { react: { version: "19.0" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "@next/next": next,
      "@stylistic": stylistic,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
      "react/prop-types": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "react/no-unknown-property": [
        "error",
        {
          ignore: ["jsx", "global"],
        },
      ],
      "@stylistic/jsx-first-prop-new-line": ["error", "always"],
      "@stylistic/jsx-max-props-per-line": ["error", {
        maximum: 1,
        when: "always"
      }],
      "react/jsx-closing-bracket-location": ["error", "tag-aligned"],
    },
  },
  prettier,
];
