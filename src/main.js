import kaplay from "kaplay";
import { makeCameraSystem } from "./systems/camera";
import { makePlayer } from "./entities/player";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: true,
  scale: 4,
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
  k.loadSprite("level-1-background", "./maps/level-1-background.png");
  k.loadSprite("level-1-clouds", "./maps/level-1-clouds.png");

  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex("#d7f2f7")),
    k.fixed(),
  ]);

  k.setGravity(3000);

  const map = k.add([k.pos(0, -50), k.scale(4)]);

  const background = map.add([
    k.sprite("level-1-background"),
    k.pos(),
    // k.fixed(),
  ]);
  background.onUpdate(() => {
    background.pos.x = -k.camPos().x / 40;
  });

  const clouds = map.add([k.sprite("level-1-clouds"), k.pos()]);
  clouds.onUpdate(() => {
    clouds.pos.x += 5 * k.dt();
    if (clouds.pos.x > 700) {
      clouds.pos.x = -500; // put the clouds far back so it scrolls again through the level
    }
  });

  const levelLayout = map.add([k.sprite("level-1")]);

  for (const collider of level1Colliders) {
    map.add([
      k.area({
        shape: new k.Rect(k.vec2(0), collider.width, collider.height),
      }),
      k.body({ isStatic: true }),
      k.pos(collider.x, collider.y),
    ]);
  }

  const player = k.add(makePlayer(k));
  player.setControls();
  player.setEvents();

  const camera = makeCameraSystem(k);
  camera.zoomCam(1.2);
  camera.setVerticalLevel(300);
  camera.setLeftBound(map.pos.x + 560);
  camera.setTarget(player);
}

main();
