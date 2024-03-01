import { useEffect } from "react"
import NavButtons from "@/components/NavButtons"
import { Item, Row } from "@/components/Item"
import { getPageColor } from "@/pageHelpers"
import TextLink from "./TextLink"

export default function ContactInfo() {
  return (
    <div className="flex sm:flex-row flex-col gap-5">
      <TextLink
        text="maayan@eve.space"
        href="mailto:maayan@eve.space"
        page="CONTACT"
      />
      <TextLink
        text="twitter.com/_maayanster"
        href="https://twitter.com/_maayanster"
        page="CONTACT"
      />
      <TextLink
        text="github.com/maayanalbert"
        href="https://github.com/maayanalbert"
        page="CONTACT"
      />
    </div>
  )
}
