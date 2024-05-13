import {
  AreaComp,
  BodyComp,
  DoubleJumpComp,
  GameObj,
  HealthComp,
  OpacityComp,
  PosComp,
  ScaleComp,
  SpriteComp,
} from "kaboom"

type PlayerGameObject = GameObj<
  SpriteComp &
    AreaComp &
    BodyComp &
    PosComp &
    ScaleComp &
    DoubleJumpComp &
    HealthComp &
    OpacityComp & {
      speed: number
      direction: string
      isInhaling: boolean
      isFull: boolean
    }
>

export type { PlayerGameObject }
