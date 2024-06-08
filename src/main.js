import kaplay from "kaplay";
import { makePlayer } from "./entities/player";
import { SCALE_FACTOR } from "./constants";
import { makeScoreBox } from "./ui/scoreBox";
import { computeRank } from "./utils";
import { saveSystem } from "./systems/save";
import { appWindow } from "@tauri-apps/api/window";
import { loadAssets } from "./loadAssets";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: true,
  scale: 2,
});

async function game() {
  document.addEventListener("keydown", async (ev) => {
    if (ev.code === "F11") {
      if (await appWindow.isFullscreen()) {
        await appWindow.setFullscreen(false);
      } else {
        await appWindow.setFullscreen(true);
      }
    }
  });

  loadAssets(k);

  const level1Data = await (await fetch("./collidersData.json")).json();

  k.scene("start", async () => {
    k.add([
      k.rect(k.width(), k.height()),
      k.color(k.Color.fromHex("#d7f2f7")),
      k.fixed(),
    ]);

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
      await saveSystem.load();
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

    function goToGame() {
      k.play("confirm");
      k.go("main");
    }

    playBtn.onClick(goToGame);

    k.onKeyPress("space", goToGame);

    k.onGamepadButtonPress("south", goToGame);
  });

  k.scene("main", async () => {
    let score = 0;

    const level1Colliders = level1Data.data;

    k.add([
      k.rect(k.width(), k.height()),
      k.color(k.Color.fromHex("#d7f2f7")),
      k.fixed(),
    ]);

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

    // we create the player as an independent game obj instead of child of map
    // because of kaplay's physics system being buggy
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
}

game();
