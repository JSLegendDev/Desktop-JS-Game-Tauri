import kaplay from "kaplay";
import { makePlayer } from "./player";
import { SCALE_FACTOR } from "./constants";
import { makeScoreBox } from "./scoreBox";
import { makeBackground } from "./utils";
import { saveSystem } from "./save";
import { appWindow } from "@tauri-apps/api/window";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: true,
  scale: 2,
});

k.loadSprite("kriby", "./kriby.png");
k.loadSprite("obstacles", "./obstacles.png");
k.loadSprite("background", "./background.png");
k.loadSprite("clouds", "./clouds.png");
k.loadSound("jump", "./jump.wav");
k.loadSound("hurt", "./hurt.wav");
k.loadSound("confirm", "./confirm.wav");

addEventListener("keydown", async (key) => {
  if (key.code === "F11") {
    if (await appWindow.isFullscreen()) {
      await appWindow.setFullscreen(false);
      return;
    }

    appWindow.setFullscreen(true);
  }
});

k.scene("start", async () => {
  makeBackground(k);

  const map = k.add([
    k.sprite("background"),
    k.pos(0, 0),
    k.scale(SCALE_FACTOR),
  ]);

  const clouds = map.add([k.sprite("clouds"), k.pos(), { speed: 5 }]);
  clouds.onUpdate(() => {
    clouds.move(clouds.speed, 0);
    if (clouds.pos.x > 700) {
      clouds.pos.x = -500; // put the clouds far back so it scrolls again through the level
    }
  });

  map.add([k.sprite("obstacles"), k.pos(), k.area(), { speed: 100 }]);

  await saveSystem.load();
  if (!saveSystem.data.maxScore) {
    saveSystem.data.maxScore = 0;
    await saveSystem.save();
  }

  const player = k.add(makePlayer(k));
  player.pos = k.vec2(k.center().x - 350, k.center().y + 56);

  const playBtn = k.add([
    k.rect(200, 50, { radius: 3 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x + 30, k.center().y + 60),
  ]);

  playBtn.add([
    k.text("Play", { size: 24 }),
    k.color(k.Color.fromHex("#d7f2f7")),
    k.area(),
    k.anchor("center"),
  ]);

  const goToGame = () => {
    k.play("confirm");
    k.go("main");
  };

  playBtn.onClick(goToGame);

  k.onKeyPress("space", goToGame);

  k.onGamepadButtonPress("south", goToGame);
});

k.scene("main", async () => {
  let score = 0;

  const colliders = await (await fetch("./collidersData.json")).json();
  const collidersData = colliders.data;

  makeBackground(k);

  k.setGravity(2500);

  const map = k.add([k.pos(0, -50), k.scale(SCALE_FACTOR)]);

  map.add([k.sprite("background"), k.pos()]);

  const clouds = map.add([k.sprite("clouds"), k.pos(), { speed: 5 }]);
  clouds.onUpdate(() => {
    clouds.move(clouds.speed, 0);
    if (clouds.pos.x > 700) {
      clouds.pos.x = -500; // put the clouds far back so it scrolls again through the level
    }
  });

  const platforms = map.add([
    k.sprite("obstacles"),
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

  for (const collider of collidersData) {
    platforms.add([
      k.area({
        shape: new k.Rect(k.vec2(0), collider.width, collider.height),
      }),
      k.body({ isStatic: true }),
      k.pos(collider.x, collider.y),
      "obstacle",
    ]);
  }

  k.add([
    k.rect(k.width(), 50),
    k.pos(0, -100),
    k.area(),
    k.fixed(),
    "obstacle",
  ]);

  k.add([
    k.rect(k.width(), 50),
    k.pos(0, 1000),
    k.area(),
    k.fixed(),
    "obstacle",
  ]);

  const player = k.add(makePlayer(k));
  player.pos = k.vec2(600, 250);
  player.setControls();
  player.onCollide("obstacle", async () => {
    if (player.isDead) return;
    k.play("hurt");
    platforms.speed = 0;
    player.disableControls();
    k.add(await makeScoreBox(k, k.center(), score));
    player.isDead = true;
  });

  k.camScale(k.vec2(1.2));
  player.onUpdate(() => {
    k.camPos(player.pos.x, 400);
  });
});

k.go("start");
