import kaplay from "kaplay";
import { makePlayer } from "./entities/player";
import { SCALE_FACTOR } from "./constants";
import { makeScoreBox } from "./ui/scoreBox";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: true,
  scale: 4,
});

const level1Data = await (await fetch("./maps/level-1.json")).json();

k.loadSprite("spritesheet", "./spritesheet.png", {
  sliceX: 18,
  sliceY: 5,
});

k.loadSprite("level-1", "./maps/level-1.png");
k.loadSprite("level-1-background", "./maps/level-1-background.png");
k.loadSprite("level-1-clouds", "./maps/level-1-clouds.png");

async function main() {
  let score = 0;
  const level1Colliders = [];
  const level1Positions = [];
  for (const layer of level1Data.layers) {
    if (layer.name === "colliders") {
      level1Colliders.push(...layer.objects);
      continue;
    }

    if (layer.name === "positions") {
      level1Positions.push(...layer.objects);
    }
  }

  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex("#d7f2f7")),
    k.fixed(),
  ]);

  k.setGravity(2500);

  const map = k.add([k.pos(0, -50), k.scale(SCALE_FACTOR)]);

  map.add([k.sprite("level-1-background"), k.pos()]);

  const clouds = map.add([k.sprite("level-1-clouds"), k.pos(), { speed: 5 }]);
  clouds.onUpdate(() => {
    clouds.move(clouds.speed, 0);
    if (clouds.pos.x > 700) {
      clouds.pos.x = -500; // put the clouds far back so it scrolls again through the level
    }
  });

  const platforms = map.add([
    k.sprite("level-1"),
    k.pos(),
    k.area(),
    { speed: 100 },
  ]);
  platforms.onUpdate(() => {
    platforms.move(-platforms.speed, 0);
    if (platforms.pos.x < -490) {
      platforms.pos.x = 300; // put the platforms far back so it scrolls again through the level
      platforms.speed += 30; // progressively increase speed
    }
  });

  k.loop(1, () => {
    score += 1;
  });

  for (const collider of level1Colliders) {
    platforms.add([
      k.area({
        shape: new k.Rect(k.vec2(0), collider.width, collider.height),
      }),
      k.body({ isStatic: true }),
      k.pos(collider.x, collider.y),
      "obstacle",
    ]);
  }

  // we create the player as an independent game obj instead of child of map
  // because of kaplay's physics system being buggy
  const player = k.add(makePlayer(k));
  player.setControls();
  player.onCollide("obstacle", () => {
    platforms.speed = 0;
    player.disableControls();
    k.add(makeScoreBox(k, k.center(), score));
  });

  k.camScale(k.vec2(1.2));
  player.onUpdate(() => {
    k.camPos(player.pos.x, 400);
  });

  for (const position of level1Positions) {
    if (position.name === "player") {
      player.pos = k.vec2(600, 300);
      continue;
    }
  }
}

k.scene("main", main);

k.go("main");
