import kaplay from "kaplay";

const k = kaplay({
  width: 640,
  height: 360,
  letterbox: true,
  global: true,
});

async function main() {
  const level1Data = await (await fetch("./maps/level-1.json")).json();
  const level1Colliders = [];
  for (const layer of level1Data.layers) {
    if (layer.name === "colliders") {
      level1Colliders.push(...layer.objects);
      break;
    }
  }

  k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 18,
    sliceY: 5,
    anims: {
      kirbIdle: 0,
      kirbInhaling: 1,
      kirbFull: 2,
      kirbInhaleEffect: { from: 3, to: 8, speed: 15, loop: true },
      shootingStar: 9,
      flame: { from: 36, to: 37, speed: 4, loop: true },
      guyIdle: 18,
      guyWalk: { from: 18, to: 19, speed: 4, loop: true },
      bird: { from: 27, to: 28, speed: 4, loop: true },
    },
  });

  k.loadSprite("level-1", "./maps/level-1.png");

  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex("#d7f2f7")),
    k.fixed(),
  ]);

  k.setGravity(2400);

  const map = k.add([k.sprite("level-1"), k.pos(), k.scale(3)]);

  for (const collider of level1Colliders) {
    map.add([
      k.area({
        shape: new k.Rect(k.vec2(0), collider.width, collider.height),
      }),
      k.body({ isStatic: true }),
      k.pos(collider.x, collider.y),
    ]);
  }

  const player = k.add([
    k.sprite("spritesheet", { anim: "kirbIdle" }),
    k.area(),
    k.body(),
    k.anchor("center"),
    k.pos(k.center()),
    k.doubleJump(10),
    k.scale(3),
    {
      speed: 300,
    },
  ]);

  player.onKeyPress((key) => {
    if (key === "space") player.doubleJump();
  });

  player.onKeyDown((key) => {
    switch (key) {
      case "left":
        player.flipX = true;
        player.move(-player.speed, 0);
        break;
      case "right":
        player.flipX = false;
        player.move(player.speed, 0);
        break;
      default:
    }
  });

  player.onUpdate(() => {
    if (map.pos.x + 320 > player.pos.x) {
      k.camPos(map.pos.x + 320, 300);
      return;
    }

    k.camPos(player.pos.x, 300);
  });
}

main();
