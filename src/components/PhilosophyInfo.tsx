import TextLink from "./TextLink"

export function PhilosophyInfo() {
  return (
    <p>
      My mom used to call me a
      <TextLink
        text="kamikaze walker,"
        href="https://drive.google.com/file/d/1SaMNKAsV2Ov6tc7SybPnKeUO5NLn8UNg/view?usp=sharing"
        page="PHILOSOPHY"
      />{" "}
      because I learned how to walk by standing up, going as fast as I could,
      falling, and getting back up again.
      <br className="sm:hidden" /> <br className="sm:hidden" /> Someone I admire{" "}
      <TextLink
        text="once said"
        href="https://www.youtube.com/watch?v=kYfNvmF0Bqw"
        page="PHILOSOPHY"
      />{" "}
      the key to life is bumping up against its edges. I believe in order to
      bump up against the edges you must fall, so you might as well get used to
      it, and better yet, learn to love it.
    </p>
  )
}
