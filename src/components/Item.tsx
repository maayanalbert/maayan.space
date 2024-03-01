import { Page as Page, getPageColor } from "@/pageHelpers"

export type Row = Item[]

export type Item = {
  first: string
  second: string
  link: string
  third?: string
  fourth?: string
  link2?: string
}

interface Props {
  item: Item
  page: Page
}

// can't use curSpace because of animation related delays
export function Item({ item, page }: Props) {
  const { first, second, link, third, fourth, link2 } = item
  return (
    <p
      className="sm:text-[22px] text-lg"
      style={{ color: "rgba(0, 0, 0, .85)" }}
    >
      {first}{" "}
      <a
        href={link}
        target="_blank"
        className="hover:underline"
        style={{ color: getPageColor(page) }}
      >
        {second}
      </a>
      {third && ` ${third} `}
      {fourth && (
        <a
          href={link2}
          target="_blank"
          className="hover:underline"
          style={{ color: getPageColor(page) }}
        >
          {fourth}
        </a>
      )}
    </p>
  )
}
