import { GameObj, KaboomCtx } from "kaboom"
import constants from "./constants"

const { scale } = constants

const makePlayer = (context: KaboomCtx, positionX: number, positionY: number) => {
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
    "player"
  ]);

  player.onCollide("enemy", async (enemy: GameObj) => {
    if (player.isInhaling && enemy.isInhalable) {
      player.isInhaling = false;
      context.destroy(enemy)
      player.isFull = true;
      return;
    }

    // hp is available as we've given the player health
    if(player.hp() === 0) {
      context.destroy(player);
      context.go("level-1")
      return
    }

    player.hurt();

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
    );
    await context.tween(
      player.opacity,
      1,
      0.05,
      (val) => (player.opacity = val),
      context.easings.linear
    );
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
  ]);

  const inhaleZone = player.add([
    context.area({ shape: new context.Rect(context.vec2(0), 20, 4) }),
    context.pos(),
    "inhaleZone",
  ]);

  /* 
    This moves the zone out from the player and orientates it relative to which way
    the player is facing
  */
  inhaleZone.onUpdate(() => {
    if (player.direction === "left") {
      inhaleZone.pos = context.vec2(-14, 8); // relative to parent object - the player
      inhaleEffect.pos = context.vec2(player.pos.x - 60, player.pos.y + 0);
      inhaleEffect.flipX = true; // This flips the inhale animation based on orientation
      return;
    }
    inhaleZone.pos = context.vec2(14, 8);
    inhaleEffect.pos = context.vec2(player.pos.x + 60, player.pos.y + 0)
    inhaleEffect.flipX = false
  });

  // This is if the player falls off the bottom of the screen (y = 0 at the top of the screen)
  player.onUpdate(() => {
    if (player.pos.y > 2000) {
      context.go("level-1")
    }
  })

  return player
}

export { makePlayer }