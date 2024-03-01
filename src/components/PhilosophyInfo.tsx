import { getPageColor } from "@/pageHelpers"
import { useEffect } from "react"

export function PhilosophyInfo() {
  return (
    <p>
      My mom used to call me a{" "}
      <a
        href="https://drive.google.com/file/d/1SaMNKAsV2Ov6tc7SybPnKeUO5NLn8UNg/view?usp=sharing"
        target="_blank"
        className="hover:underline cursor-pointer"
        style={{ color: getPageColor("PHILOSOPHY", true) }}
      >
        kamikaze walker,
      </a>{" "}
      because I learned how to walk by standing up, going as fast as I could,
      falling, and getting back up again. Someone I admire{" "}
      <a
        href="https://www.youtube.com/watch?v=kYfNvmF0Bqw"
        target="_blank"
        className="hover:underline cursor-pointer"
        style={{ color: getPageColor("PHILOSOPHY", true) }}
      >
        once said
      </a>{" "}
      the key to life is bumping up against its edges. <br /> <br /> I believe
      in order to bump up against the edges you must fall, so you might as well
      get used to it, and better yet, learn to love it.
    </p>
  )
}
