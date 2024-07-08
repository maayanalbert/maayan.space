import TextLink from "./TextLink"

export function DefaultInfo() {
  return (
    <p className="sm:text-[18px] text-[16px]">
      I work at the intersection of design, technology, and the human
      experience. Currently exploring AI personas for emotional support with
      <TextLink text="Eve." href="https://www.eve.space/" page="DEFAULT" />
    </p>
  )
}
