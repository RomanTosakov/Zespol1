import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["*/resources.d.ts"],
}, ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier",
), {
    plugins: {
        import: fixupPluginRules(_import),
    },

    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },

        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: ["./tsconfig.json"],
            },
        },
    },

    rules: {
        "react/display-name": "off",
        "@next/next/no-img-element": "off",
        "react/no-unescaped-entities": "off",
        "import/no-anonymous-default-export": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "newline-before-return": "error",

        "import/newline-after-import": ["error", {
            count: 1,
        }],
    },
}];