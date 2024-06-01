import kaplay from "kaplay";

const k = kaplay({
  width: 640,
  height: 360,
  letterbox: true,
  global: true,
});

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

k.setGravity(2400);

const player = k.add([
  k.sprite("spritesheet", { anim: "kirbIdle" }),
  k.area(),
  k.body(),
  k.anchor("center"),
  k.pos(k.center()),
  k.scale(3),
  k.doubleJump(10),
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

k.add([
  k.rect(k.width(), 50),
  k.area(),
  k.body({ isStatic: true }),
  k.pos(0, 300),
]);
