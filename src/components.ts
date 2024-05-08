import kaboomContext from "./kaboomContext";

const background = [
  kaboomContext.rect(kaboomContext.width(), kaboomContext.height()),
  kaboomContext.color(kaboomContext.Color.fromHex("#f7d7db")),
  kaboomContext.fixed(),
]

export { background }