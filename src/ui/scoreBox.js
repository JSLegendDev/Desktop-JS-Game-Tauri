export function makeScoreBox(k, pos, score) {
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
    k.text(`Your score: ${score}`),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.anchor("center"),
    k.pos(0, -150),
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

  k.onKeyPress("enter", () => {
    k.go("main");
  });

  return container;
}
