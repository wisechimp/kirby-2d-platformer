import kaboomContext from "./kaboomContext"

const gameSetup = async () => {
  kaboomContext.loadSprite("assets", "./assets/kirby-like.png", {
    sliceX: 9,
    sliceY: 10,
    anims: {
      kirbIdle: 0,
      kirbInhaling: 1,
      kirbFull: 2,
      kirbInhaleEffect: { from: 3, to: 8, speed: 15, loop: true },
      shootingStar: 9,
      guyIdle: 18,
      guyWalk: { from: 18, to: 19, speed: 4, loop: true },
      bird: { from: 27, to: 28, speed: 4, loop: true },
      flame: { from: 36, to: 37, speed: 4, loop: true },
    },
  })
}

gameSetup()