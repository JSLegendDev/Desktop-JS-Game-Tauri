export function makePlayer(k) {
  return k.make([
    k.sprite("spritesheet", { anim: "kirbIdle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 1.5), 10, 12) }),
    k.body({ jumpForce: 1000 }),
    k.anchor("center"),
    k.pos(k.center()),
    k.doubleJump(10),
    k.scale(4),
    {
      speed: 600,
      setControls() {
        this.onKeyPress((key) => {
          switch (key) {
            case "x":
              this.doubleJump();
              break;
            case "z":
              this.trigger("inhale");
              break;
            default:
          }
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

        this.onKeyRelease(() => {
          this.play("kirbIdle");
          this.trigger("cancel-inhale");
        });
      },
      setEvents() {
        this.on("inhale", () => {
          this.play("kirbInhaling");
          const inhaleZone = this.add([
            k.area({ shape: new k.Rect(k.vec2(0, -5), 30, 15) }),
            k.anchor("topleft"),
            "inhale-zone",
          ]);
          inhaleZone.onUpdate(() => {
            inhaleZone.pos = this.flipX ? k.vec2(-30, -5) : k.vec2(0, -5);
          });
        });

        this.on("cancel-inhale", () => {
          const inhaleZone = k.get("inhale-zone", { recursive: true })[0];
          if (inhaleZone) k.destroy(inhaleZone);
        });
      },
    },
  ]);
}
