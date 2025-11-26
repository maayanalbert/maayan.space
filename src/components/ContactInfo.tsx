import TextLink from "./TextLink"
import Image from "next/image"
import { Mail } from "react-feather"

export default function ContactInfo() {
  return (
    <>
      {/* Mobile layout - all in one column */}
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="flex items-center gap-2">
          <Mail size={20} className="text-[rgb(0,151,254)]" />
          <TextLink
            text="maayan.albert@gmail.com"
            href="mailto:maayan.albert@gmail.com"
            page="CONTACT"
          />
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/social-logos/X=Black.svg"
            alt="X (Twitter)"
            width={18}
            height={18}
            className="[filter:invert(47%)_sepia(98%)_saturate(2299%)_hue-rotate(187deg)_brightness(100%)_contrast(101%)]"
          />
          <TextLink
            text="@maayanalbert"
            href="https://twitter.com/_maayanster"
            page="CONTACT"
          />
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/social-logos/Github=Black.svg"
            alt="Github"
            width={20}
            height={20}
            className="[filter:invert(47%)_sepia(98%)_saturate(2299%)_hue-rotate(187deg)_brightness(100%)_contrast(101%)]"
          />
          <TextLink
            text="@maayanalbert"
            href="https://github.com/maayanalbert"
            page="CONTACT"
          />
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/social-logos/LinkedIn=Black.svg"
            alt="LinkedIn"
            width={18}
            height={18}
            className="[filter:invert(47%)_sepia(98%)_saturate(2299%)_hue-rotate(187deg)_brightness(100%)_contrast(101%)]"
          />
          <TextLink
            text="/maayan-albert"
            href="https://www.linkedin.com/in/maayan-albert/"
            page="CONTACT"
          />
        </div>
      </div>
      {/* Desktop layout - 2 separate rows */}
      <div className="hidden sm:flex sm:flex-col gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Mail
              size={20}
              className="sm:w-[26px] sm:h-[26px] text-[rgb(0,151,254)]"
            />
            <TextLink
              text="maayan.albert@gmail.com"
              href="mailto:maayan.albert@gmail.com"
              page="CONTACT"
            />
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/social-logos/X=Black.svg"
              alt="X (Twitter)"
              width={18}
              height={18}
              className="sm:w-[22px] sm:h-[22px] [filter:invert(47%)_sepia(98%)_saturate(2299%)_hue-rotate(187deg)_brightness(100%)_contrast(101%)]"
            />
            <TextLink
              text="@maayanalbert"
              href="https://twitter.com/_maayanster"
              page="CONTACT"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/social-logos/Github=Black.svg"
              alt="Github"
              width={20}
              height={20}
              className="sm:w-[24px] sm:h-[24px] [filter:invert(47%)_sepia(98%)_saturate(2299%)_hue-rotate(187deg)_brightness(100%)_contrast(101%)]"
            />
            <TextLink
              text="@maayanalbert"
              href="https://github.com/maayanalbert"
              page="CONTACT"
            />
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/social-logos/LinkedIn=Black.svg"
              alt="LinkedIn"
              width={18}
              height={18}
              className="sm:w-[22px] sm:h-[22px] [filter:invert(47%)_sepia(98%)_saturate(2299%)_hue-rotate(187deg)_brightness(100%)_contrast(101%)]"
            />
            <TextLink
              text="/maayan-albert"
              href="https://www.linkedin.com/in/maayan-albert/"
              page="CONTACT"
            />
          </div>
        </div>
      </div>
    </>
  )
}
