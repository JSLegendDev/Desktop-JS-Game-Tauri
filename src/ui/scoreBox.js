import { saveSystem } from "../systems/save";
import { computeRank } from "../utils";

export async function makeScoreBox(k, pos, score) {
  saveSystem.load();

  if (score > saveSystem.data.maxScore) {
    saveSystem.data.maxScore = score;
    await saveSystem.save();
  }

  const container = k.make([
    k.rect(500, 500),
    k.pos(pos),
    k.color(k.Color.fromHex("#d7f2f7")),
    k.area(),
    k.anchor("center"),
    k.outline(4, k.Color.fromHex("#14638e")),
    k.fixed(),
  ]);

  container.add([
    k.text(`Your best score : ${saveSystem.data.maxScore}`),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-220, -200),
  ]);

  container.add([
    k.text(`Your score: ${score}`),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-220, -150),
  ]);

  container.add([
    k.text(`Your current rank : ${computeRank(score)}`),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-220, 50),
  ]);

  container.add([
    k.text(`Your best rank : ${computeRank(saveSystem.data.maxScore)}`),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.pos(-220, 0),
  ]);

  const restartBtn = container.add([
    k.rect(200, 50, { radius: 3 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.anchor("center"),
    k.pos(0, 200),
  ]);

  restartBtn.add([
    k.text("Play again", { size: 24 }),
    k.color(k.Color.fromHex("#d7f2f7")),
    k.area(),
    k.anchor("center"),
  ]);

  restartBtn.onClick(() => {
    k.go("main");
  });

  k.onKeyPress("space", () => {
    k.go("main");
  });

  k.onGamepadButtonPress("south", () => {
    k.go("main");
  });

  return container;
}
