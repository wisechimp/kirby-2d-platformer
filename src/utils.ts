import { KaboomCtx } from "kaboom";
import constants from "./constants";

const makeMap = async(kaboomContext: KaboomCtx, name: string) => {
  const mapData = await(await fetch(`./${name}.json`)).json()

  const map = kaboomContext.make([
    kaboomContext.sprite(name),
    kaboomContext.scale(constants.scale),
    kaboomContext.pos(0)
  ])

  const spawnPoints: { [key: string]: {x: number, y: number}[] } = {}

  for (const layer of mapData.layers) {
    if (layer.name === "colliders") {
      for (const collider of layer.objects) {
        map.add([
          kaboomContext.area({
            shape: new kaboomContext.Rect(
              kaboomContext.vec2(0),
              collider.width,
              collider.height
            ),
            collisionIgnore: ["platform", "exit"]
          }),
          collider.name !== "exit" ? kaboomContext.body({isStatic: true}) : null,
          kaboomContext.pos(collider.x, collider.y),
          collider.name !== "exit" ? "platform" : "exit"
        ])
      }
      continue;
    }

    if (layer.name === "spawnpoints") {
      for (const spawnPoint of layer.objects) {
        if (spawnPoints[spawnPoint.name]) {
          spawnPoints[spawnPoint.name].push({
            x: spawnPoint.x,
            y: spawnPoint.y
          })
          continue
        }
        spawnPoints[spawnPoint.name] = [{ x: spawnPoint.x, y: spawnPoint.y }]
      }
    }
  }
  return { map, spawnPoints }
}

export { makeMap }