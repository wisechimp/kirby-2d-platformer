import { background } from "./components"
import {
  makeFlameEnemy,
  makeBadGuyEnemy,
  makePlayer,
  setControls,
  makeBirdEnemy,
} from "./entities"
import kaboomContext from "./kaboomContext"
import { makeMap } from "./utils"

const gameSetup = async () => {
  kaboomContext.loadSprite("assets", "./kirby-like.png", {
    sliceX: 9,
    sliceY: 10,
    anims: {
      kirbyIdle: 0,
      kirbyInhaling: 1,
      kirbyFull: 2,
      kirbyInhaleEffect: { from: 3, to: 8, speed: 15, loop: true },
      shootingStar: 9,
      badGuyIdle: 18,
      badGuyWalk: { from: 18, to: 19, speed: 4, loop: true },
      bird: { from: 27, to: 28, speed: 4, loop: true },
      flame: { from: 36, to: 37, speed: 4, loop: true },
    },
  })

  kaboomContext.loadSprite("level-1", "./level-1.png")

  const { map: level1Layout, spawnPoints: level1SpawnPoints } = await makeMap(
    kaboomContext,
    "level-1"
  )

  kaboomContext.scene("level-1", () => {
    kaboomContext.setGravity(2100)
    kaboomContext.add(background)
    kaboomContext.add(level1Layout)

    // Create our single controllable character
    const kirby = makePlayer(
      kaboomContext,
      level1SpawnPoints.player[0].x,
      level1SpawnPoints.player[0].y
    )

    setControls(kaboomContext, kirby)
    kaboomContext.add(kirby)
    kaboomContext.camScale(0.7, 0.7)
    // This allows the camera to follow the player to the edge of the level
    kaboomContext.onUpdate(() => {
      if (kirby.pos.x < level1Layout.pos.x + 432)
        // This allows the player to see ahead as he moves to the right
        kaboomContext.camPos(kirby.pos.x + 500, 868)
    })

    console.log(level1SpawnPoints)

    for (const flame of level1SpawnPoints.flame) {
      makeFlameEnemy(kaboomContext, flame.x, flame.y)
    }

    for (const badGuy of level1SpawnPoints.badGuy) {
      makeBadGuyEnemy(kaboomContext, badGuy.x, badGuy.y)
    }

    for (const bird of level1SpawnPoints.bird) {
      const possibleSpeeds = [100, 200, 300]
      kaboomContext.loop(10, () => {
        makeBirdEnemy(
          kaboomContext,
          bird.x,
          bird.y,
          possibleSpeeds[Math.floor(Math.random() * possibleSpeeds.length)]
        )
      })
    }
  })

  kaboomContext.go("level-1")
}

gameSetup()
