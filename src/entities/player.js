import { SCALE_FACTOR } from "../constants";

export function makePlayer(k) {
  return k.make([
    k.sprite("spritesheet", { frame: 0 }),
    k.area({ shape: new k.Rect(k.vec2(0, 1.5), 8, 5) }),
    k.anchor("center"),
    k.body({ jumpForce: 600 }),
    k.pos(),
    k.scale(SCALE_FACTOR),
    {
      isDead: false,
      speed: 600,
      setControls() {
        this.keyControllers = [];
        this.keyControllers.push(
          this.onKeyPress((key) => {
            if (key === "space") {
              k.play("jump");
              this.jump();
            }
          })
        );

        this.keyControllers.push(
          k.onClick(() => {
            k.play("jump");
            this.jump();
          })
        );

        this.keyControllers.push(
          k.onGamepadButtonPress("south", () => {
            k.play("jump");
            this.jump();
          })
        );
      },
      disableControls() {
        this.keyControllers.forEach((keyController) => keyController.cancel());
      },
    },
  ]);
}
