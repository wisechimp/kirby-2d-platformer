import kaboom from "kaboom";
import constants from "./constants";

const kaboomContext = kaboom({
  width: 256 * constants.scale,
  height: 144 * constants.scale,
  scale: constants.scale,
  letterbox: true,
  global: false
})

export default kaboomContext