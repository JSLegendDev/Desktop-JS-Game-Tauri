export function computeRank(score) {
  if (score > 30) {
    return "S";
  }

  if (score > 20) {
    return "A";
  }

  if (score > 10) {
    return "B";
  }

  if (score > 2) {
    return "C";
  }

  return "D";
}

export function makeBackground(k) {
  k.add([k.rect(k.width(), k.height()), k.color(k.Color.fromHex("#d7f2f7"))]);
}
