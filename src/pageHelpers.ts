export type Page = "ABOUT" | "PHILOSOPHY" | "CONTACT" | "DEFAULT"

export function getPageColor(type: Page, text?: boolean) {
  switch (type) {
    case "ABOUT":
      return "rgb(255,70,100)"
    case "PHILOSOPHY":
      return text ? "#D9AE00" : "#EBC737"
    case "CONTACT":
      return "rgb(0,151,254)"
    default:
      return "rgb(150, 150, 150)"
  }
}

export function getPageHighlight(type: Page): string {
  switch (type) {
    case "ABOUT":
      return "rgba(255, 70, 100, 0.13)"
    case "PHILOSOPHY":
      return "rgba(217, 174, 0, 0.15)"
    case "CONTACT":
      return "rgba(0, 151, 254, 0.13)"
    default:
      return "rgba(150, 150, 150, 0.2)"
  }
}

export function getPageDeepColor(type: Page): string {
  switch (type) {
    case "ABOUT":
      return "rgb(215, 55, 85)"
    case "PHILOSOPHY":
      return "rgb(175, 130, 0)"
    case "CONTACT":
      return "rgb(0, 120, 215)"
    default:
      return "rgb(90, 90, 90)"
  }
}

export function getPageName(type: Page) {
  switch (type) {
    case "ABOUT":
      return "About"
    case "PHILOSOPHY":
      return "Philosophy"
    case "CONTACT":
      return "Contact"
    default:
      return ""
  }
}
