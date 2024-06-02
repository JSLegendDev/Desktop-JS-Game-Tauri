export function makePlayer(k) {
  return k.make([
    k.sprite("spritesheet", { anim: "kirbIdle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 1.5), 10, 12) }),
    k.body({ jumpForce: 1000 }),
    k.anchor("center"),
    k.pos(k.center()),
    k.doubleJump(10),
    k.scale(8),
    {
      speed: 1000,
      setControls() {
        this.onKeyPress((key) => {
          if (key === "space") this.doubleJump();
        });

        this.onKeyDown((key) => {
          switch (key) {
            case "left":
              this.flipX = true;
              this.move(-this.speed, 0);
              break;
            case "right":
              this.flipX = false;
              this.move(this.speed, 0);
              break;
            default:
          }
        });
      },
    },
  ]);
}
