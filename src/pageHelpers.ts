export type Page = "ABOUT" | "PHILOSOPHY" | "CONTACT"

export function getPageColor(type: Page, text?: boolean) {
  switch (type) {
    case "ABOUT":
      return "rgb(255,70,100)"
    case "PHILOSOPHY":
      return text ? "#D9AE00" : "#EBC737"
    case "CONTACT":
      return "rgb(0,151,254)"
    default:
      return "gray"
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
