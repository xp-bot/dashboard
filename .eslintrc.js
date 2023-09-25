module.exports = {
  ignorePatterns: ["*.config.*", "*.d.ts", "*.js"],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: [
    "@typescript-eslint",
    "simple-import-sort",
    "unused-imports",
    "lodash",
    "check-file",
  ],
  extends: [
    "eslint:recommended",
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:lodash/recommended",
  ],
  rules: {
    "@typescript-eslint/no-empty-interface": "off",
    "react-hooks/exhaustive-deps": "off",
    "lodash/chaining": "off",
    "import/no-anonymous-default-export": "off",
    "check-file/filename-naming-convention": [
      "error",
      {
        "*": "KEBAB_CASE",
      },
    ],
    "check-file/folder-naming-convention": [
      "error",
      {
        "*": "KEBAB_CASE",
      },
    ],
    "lodash/import-scope": ["error", "member"],
    "lodash/matches-prop-shorthand": "off",
    "lodash/matches-shorthand": "off",
    "lodash/chain-style": [2, "explicit"],
    "max-depth": ["error", 3],
    "no-unused-vars": "off",
    "no-console": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/no-unescaped-entities": "off",

    "react/display-name": "off",
    "react/jsx-curly-brace-presence": [
      "warn",
      { props: "never", children: "never" },
    ],

    //#region  //*=========== Unused Import ===========
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    //#endregion  //*======== Unused Import ===========

    //#region  //*=========== Import Sort ===========
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          // ext library & side effect imports
          ["^@?\\w", "^\\u0000"],
          // {s}css files
          ["^.+\\.s?css$"],
          // Lib and hooks
          ["^@/lib", "^@/hooks"],
          // static data
          ["^@/data"],
          // components
          ["^@/components", "^@/container"],
          // zustand store
          ["^@/store"],
          // Other imports
          ["^@/"],
          // relative paths up until 3 level
          [
            "^\\./?$",
            "^\\.(?!/?$)",
            "^\\.\\./?$",
            "^\\.\\.(?!/?$)",
            "^\\.\\./\\.\\./?$",
            "^\\.\\./\\.\\.(?!/?$)",
            "^\\.\\./\\.\\./\\.\\./?$",
            "^\\.\\./\\.\\./\\.\\.(?!/?$)",
          ],
          ["^@/types"],
          // other that didnt fit in
          ["^"],
        ],
      },
    ],
    //#endregion  //*======== Import Sort ===========
  },
  globals: {
    React: true,
    JSX: true,
  },
};
