"use client"

import React, { useState } from "react";
import chroma from "chroma-js";
import { Navigation } from "@/components/navigation";
import { Header } from "@/components/header";
import { Clipboard, Check } from "lucide-react";

const BRAND_COLOR_KEYS = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "success", label: "Success" },
  { key: "danger", label: "Danger" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
  { key: "dark", label: "Dark" },
];

const TAILWIND_COLOR_KEYS = [
  { key: "gray", label: "Gray", default: "#878C94" },
  { key: "red", label: "Red", default: "#C70032" },
  { key: "orange", label: "Orange", default: "#EA712F" },
  { key: "lime", label: "Lime", default: "#91DC00" },
  { key: "green", label: "Green", default: "#2D7E24" },
  { key: "blue", label: "Blue", default: "#009FDB" },
  { key: "cobalt", label: "Cobalt", default: "#00388F" },
  { key: "mint", label: "Mint", default: "#49EEDC" },
];

const BRAND_DEFAULTS = {
  primary: "#009FDB",
  secondary: "#878C94",
  success: "#2D7E24",
  warning: "#EA712F",
  danger: "#C70032",
  dark: "#25303A",
  info: "#49EEDC",
};

const TAILWIND_DEFAULTS = Object.fromEntries(
  TAILWIND_COLOR_KEYS.map(({ key, default: def }) => [key, def])
);

function generateShades(base: string) {
  // 100 (lightest) to 900 (darkest)
  return {
    100: chroma(base).brighten(2).hex(),
    200: chroma(base).brighten(1.5).hex(),
    300: chroma(base).brighten(1).hex(),
    400: chroma(base).brighten(0.5).hex(),
    500: chroma(base).hex(),
    600: chroma(base).darken(0.5).hex(),
    700: chroma(base).darken(1).hex(),
    800: chroma(base).darken(1.5).hex(),
    900: chroma(base).darken(2).hex(),
  };
}

export default function ColorsPage() {
  const [brandColors, setBrandColors] = useState(BRAND_DEFAULTS);
  const [twColors, setTwColors] = useState(TAILWIND_DEFAULTS);
  const [copied, setCopied] = useState(false);
  const [copiedShade, setCopiedShade] = useState<string | null>(null);

  // Local state for hex input fields
  const [brandHexInputs, setBrandHexInputs] = useState({ ...BRAND_DEFAULTS });
  const [twHexInputs, setTwHexInputs] = useState({ ...TAILWIND_DEFAULTS });

  const handleBrandColorChange = (key: string, value: string) => {
    setBrandColors((prev) => ({ ...prev, [key]: value }));
    setBrandHexInputs((prev) => ({ ...prev, [key]: value }));
  };
  const handleBrandHexInput = (key: string, value: string) => {
    setBrandHexInputs((prev) => ({ ...prev, [key]: value }));
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(value)) {
      setBrandColors((prev) => ({ ...prev, [key]: value }));
    }
  };
  const handleTwColorChange = (key: string, value: string) => {
    setTwColors((prev) => ({ ...prev, [key]: value }));
    setTwHexInputs((prev) => ({ ...prev, [key]: value }));
  };
  const handleTwHexInput = (key: string, value: string) => {
    setTwHexInputs((prev) => ({ ...prev, [key]: value }));
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(value)) {
      setTwColors((prev) => ({ ...prev, [key]: value }));
    }
  };

  const brandPalette = Object.fromEntries(
    Object.entries(brandColors).map(([key, base]) => [key, generateShades(base)])
  );
  const twPalette = Object.fromEntries(
    Object.entries(twColors).map(([key, base]) => [key, generateShades(base)])
  );

  // Generate config code
  const semanticColors = [
    'border: "hsl(var(--border))",',
    'input: "hsl(var(--input))",',
    'ring: "hsl(var(--ring))",',
    'background: "hsl(var(--background))",',
    'foreground: "hsl(var(--foreground))",',
    'muted: {',
    '  DEFAULT: "hsl(var(--muted))",',
    '  foreground: "hsl(var(--muted-foreground))",',
    '},',
    'popover: {',
    '  DEFAULT: "hsl(var(--popover))",',
    '  foreground: "hsl(var(--popover-foreground))",',
    '},',
    'card: {',
    '  DEFAULT: "hsl(var(--card))",',
    '  foreground: "hsl(var(--card-foreground))",',
    '},',
    'destructive: {',
    '  DEFAULT: "hsl(var(--destructive))",',
    '  foreground: "hsl(var(--destructive-foreground))",',
    '},',
  ].join("\n");

  function colorObjectWithDefaultAndForeground(shades: Record<string, string>) {
    return {
      ...shades,
      DEFAULT: shades["500"],
      foreground: '#FFFFFF',
    };
  }

  const configCode = `colors: {\n${semanticColors}\n${Object.entries(brandPalette)
    .map(
      ([key, shades]) =>
        `  ${key}: ${JSON.stringify(colorObjectWithDefaultAndForeground(shades), null, 4).replace(/"/g, "'")},`
    )
    .join("\n")}
${Object.entries(twPalette)
    .map(
      ([key, shades]) =>
        `  ${key}: ${JSON.stringify(colorObjectWithDefaultAndForeground(shades), null, 4).replace(/"/g, "'")},`
    )
    .join("\n")}
}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(configCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShadeCopy = async (hex: string, key: string, shade: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedShade(`${key}-${shade}`);
    setTimeout(() => setCopiedShade(null), 1200);
  };

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 ml-0 md:ml-[240px] bg-background">
        <Header />
        <div className="max-w-4xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-6">Tailwind AT&T Color Manager</h1>
          <p className="mb-8 text-gray-700">
            Update your base colors below. Shades will be generated automatically. Copy the config snippet into your <code>tailwind.config.ts</code>.
          </p>
          <h2 className="text-lg font-semibold mb-2">Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {BRAND_COLOR_KEYS.map(({ key, label }) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">{label}</span>
                  <input
                    type="color"
                    value={brandColors[key as keyof typeof brandColors]}
                    onChange={(e) => handleBrandColorChange(key, e.target.value)}
                    className="w-8 h-8 border-none bg-transparent cursor-pointer"
                    aria-label={`Pick ${label} color`}
                  />
                  <input
                    type="text"
                    value={brandHexInputs[key as keyof typeof brandHexInputs]}
                    onChange={(e) => handleBrandHexInput(key, e.target.value)}
                    maxLength={7}
                    className="ml-2 w-20 px-2 py-1 border rounded text-xs font-mono"
                    aria-label={`Enter hex for ${label}`}
                    placeholder="#RRGGBB"
                  />
                </div>
                <div className="flex space-x-2 mt-2">
                  {Object.entries(brandPalette[key]).map(([shade, hex]) => (
                    <div key={shade} className="flex flex-col items-center">
                      <button
                        type="button"
                        className="w-8 h-8 rounded shadow border relative group"
                        style={{ background: hex }}
                        title={hex}
                        onClick={() => handleShadeCopy(hex, key, shade)}
                      >
                        {copiedShade === `${key}-${shade}` && (
                          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[10px] px-2 py-1 rounded z-10 pointer-events-none">Copied!</span>
                        )}
                        <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-[10px] px-2 py-1 rounded z-10 pointer-events-none whitespace-nowrap">{hex}</span>
                      </button>
                      <span className="text-xs mt-1">{shade}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-lg font-semibold mb-2">Tailwind Palette Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {TAILWIND_COLOR_KEYS.map(({ key, label }) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">{label}</span>
                  <input
                    type="color"
                    value={twColors[key as keyof typeof twColors]}
                    onChange={(e) => handleTwColorChange(key, e.target.value)}
                    className="w-8 h-8 border-none bg-transparent cursor-pointer"
                    aria-label={`Pick ${label} color`}
                  />
                  <input
                    type="text"
                    value={twHexInputs[key as keyof typeof twHexInputs]}
                    onChange={(e) => handleTwHexInput(key, e.target.value)}
                    maxLength={7}
                    className="ml-2 w-20 px-2 py-1 border rounded text-xs font-mono"
                    aria-label={`Enter hex for ${label}`}
                    placeholder="#RRGGBB"
                  />
                </div>
                <div className="flex space-x-2 mt-2">
                  {Object.entries(twPalette[key]).map(([shade, hex]) => (
                    <div key={shade} className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded shadow border"
                        style={{ background: hex }}
                      />
                      <span className="text-xs mt-1">{shade}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 justify-between">
            <span>Generated tailwind.config.ts colors</span>
            <span className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                title="Copy to clipboard"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Clipboard className="h-5 w-5" />}
              </button>
              {copied && <span className="text-green-600 text-xs">Copied!</span>}
            </span>
          </h2>
          <pre className="bg-gray-900 text-green-200 rounded p-4 overflow-x-auto text-sm">
            {configCode}
          </pre>
        </div>
      </main>
    </div>
  );
} 