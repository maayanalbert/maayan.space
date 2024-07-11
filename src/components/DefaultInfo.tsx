import TextLink from "./TextLink"

export function DefaultInfo() {
  return (
    <p className="sm:text-[18px] text-[16px]">
      I build tools to help humans be the most themselves. Currently building an
      AI crystal ball with
      <TextLink text="Eve." href="https://www.eve.space/" page="DEFAULT" />
    </p>
  )
}
