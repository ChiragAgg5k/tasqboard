import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import svgToTinyDataUri from "mini-svg-data-uri";
require("tailwindcss/colors");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    require("daisyui"),
    function ({ matchUtilities, theme }: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToTinyDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        },
      );
    },
  ],
  daisyui: {
    themes: ["business", "autumn"],
  },
} satisfies Config;
