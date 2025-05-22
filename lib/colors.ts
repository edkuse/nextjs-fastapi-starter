export const colors = {
  white: {
    name: "White",
    rgb: "rgb(255, 255, 255)",
    hex: "#FFFFFF"
  },
  black: {
    name: "Black",
    rgb: "rgb(0, 0, 0)",
    hex: "#000000"
  },
  lime: {
    name: "Lime",
    rgb: "rgb(17, 255, 0)",
    hex: "#11FF00"
  },
  mint: {
    name: "Mint",
    rgb: "rgb(62, 255, 110)",
    hex: "#3EFF6E"
  },
  attBlue: {
    name: "AT&T Blue",
    rgb: "rgb(0, 0, 127)",
    hex: "#00007F"
  },
  cobalt: {
    name: "Cobalt",
    rgb: "rgb(0, 62, 15)",
    hex: "#003E0F"
  }
} as const

// Usage examples:
// Primary: AT&T Blue
// Secondary: Cobalt
// Accent: Lime
// Success: Mint
// Text: Black/White 