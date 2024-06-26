import { useEffect } from "react"
import NavButtons from "@/components/NavButtons"
import { Item, Row } from "@/components/Item"
import { getPageColor } from "@/pageHelpers"
import TextLink from "./TextLink"

export default function ContactInfo() {
  return (
    <div className="flex sm:flex-row flex-col gap-5 sm:gap-10 sm:text-[18px] text-[16px]">
      <TextLink
        text="maayan@eve.space"
        href="mailto:maayan@eve.space"
        page="CONTACT"
      />
      <TextLink
        text="Twitter"
        href="https://twitter.com/_maayanster"
        page="CONTACT"
      />
      <TextLink
        text="Github"
        href="https://github.com/maayanalbert"
        page="CONTACT"
      />
      <TextLink
        text="Linkedin"
        href="https://www.linkedin.com/in/maayan-albert/"
        page="CONTACT"
      />
    </div>
  )
}
