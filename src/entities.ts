import { GameObj, KaboomCtx } from "kaboom"
import constants from "./constants"
import { PlayerGameObject } from "./types"

const { scale } = constants

const makePlayer = (
  context: KaboomCtx,
  positionX: number,
  positionY: number
) => {
  const player = context.make([
    context.sprite("assets", { anim: "kirbyIdle" }),
    context.area({ shape: new context.Rect(context.vec2(4, 5.9), 8, 10) }),
    context.body(),
    context.pos(positionX * scale, positionY * scale),
    context.scale(scale),
    context.doubleJump(10),
    context.health(3),
    context.opacity(1),
    {
      speed: 300,
      direction: "right",
      isInhaling: false,
      isFull: false,
    },
    "player",
  ])

  player.onCollide("enemy", async (enemy: GameObj) => {
    if (player.isInhaling && enemy.isInhalable) {
      player.isInhaling = false
      context.destroy(enemy)
      player.isFull = true
      return
    }

    // hp is available as we've given the player health
    if (player.hp() === 0) {
      context.destroy(player)
      context.go("level-1")
      return
    }

    player.hurt()

    /* 
      We have 2 "tweens" to control the player flashing. We await so that the 
      first change in opacity (the player disappearing) has finished before we
      start the player showing up again.
    */

    await context.tween(
      player.opacity,
      0,
      0.05,
      (val) => (player.opacity = val),
      context.easings.linear // rate of change
    )
    await context.tween(
      player.opacity,
      1,
      0.05,
      (val) => (player.opacity = val),
      context.easings.linear
    )
  })

  player.onCollide("exit", () => {
    context.go("level-2")
  })

  // When the player inhales something
  // So this is actually always playing and he just adjusts visibility
  const inhaleEffect = context.add([
    context.sprite("assets", { anim: "kirbyInhaleEffect" }),
    context.pos(),
    context.scale(scale),
    context.opacity(0),
    "inhaleEffect",
  ])

  const inhaleZone = player.add([
    context.area({ shape: new context.Rect(context.vec2(0), 20, 4) }),
    context.pos(),
    "inhaleZone",
  ])

  /* 
    This moves the zone out from the player and orientates it relative to which way
    the player is facing
  */
  inhaleZone.onUpdate(() => {
    if (player.direction === "left") {
      inhaleZone.pos = context.vec2(-14, 8) // relative to parent object - the player
      inhaleEffect.pos = context.vec2(player.pos.x - 60, player.pos.y + 0)
      inhaleEffect.flipX = true // This flips the inhale animation based on orientation
      return
    }
    inhaleZone.pos = context.vec2(14, 8)
    inhaleEffect.pos = context.vec2(player.pos.x + 60, player.pos.y + 0)
    inhaleEffect.flipX = false
  })

  // This is if the player falls off the bottom of the screen (y = 0 at the top of the screen)
  player.onUpdate(() => {
    if (player.pos.y > 2000) {
      context.go("level-1")
    }
  })

  return player
}

const setControls = (context: KaboomCtx, player: PlayerGameObject) => {
  const inhaleEffectRef = context.get("inhaleEffect")[0]
  context.onKeyDown((key) => {
    switch (key) {
      case "left":
        player.direction = "left"
        player.flipX = true
        player.move(-player.speed, 0)
        break
      case "right":
        player.direction = "right"
        player.flipX = false
        player.move(player.speed, 0)
        break
      case "z":
        if (player.isFull) {
          player.play("kirbyFull")
          inhaleEffectRef.opacity = 0
          break
        }
        player.isInhaling = true
        player.play("kirbyInhaling")
        inhaleEffectRef.opacity = 1
        break
      default:
    }
  })

  context.onKeyPress((key) => {
    switch (key) {
      case "space":
        player.doubleJump()
        break
      default:
    }
  })

  context.onKeyRelease((key) => {
    if (key === "z" && player.isFull) {
      player.play("kirbyInhaling")
      const shootingStar = context.add([
        context.sprite("assets", {
          anim: "shootingStar",
          flipX: player.direction === "right",
        }),
        context.area({
          shape: new context.Rect(context.vec2(5, 4), 6, 6),
        }),
        context.pos(
          player.direction === "left" ? player.pos.x - 80 : player.pos.x + 80,
          player.pos.y + 5
        ),
        context.scale(scale),
        player.direction === "left"
          ? context.move(context.LEFT, 800)
          : context.move(context.RIGHT, 800),
        "shootingStar",
      ])
      shootingStar.onCollide("platform", () => context.destroy(shootingStar))

      player.isFull = false
      context.wait(1, () => player.play("kirbyIdle"))
      return
    }
    inhaleEffectRef.opacity = 0
    player.isInhaling = false
    player.play("kirbyIdle")
  })
}

export { makePlayer, setControls }
