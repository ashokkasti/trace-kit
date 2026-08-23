import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/dist/", "**/src/wasm/", "**/*.d.ts", "spike/"] },
  ...tseslint.configs.recommended.map((c) => ({
    ...c,
    files: ["**/*.ts", "**/*.tsx"],
  })),
);
