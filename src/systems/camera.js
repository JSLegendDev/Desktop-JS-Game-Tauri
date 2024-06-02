export function makeCameraSystem(k) {
  return {
    xPos: 0,
    zoomCam(factor) {
      k.camScale(k.vec2(factor));
    },
    setLeftBound(value) {
      this.leftBound = value;
    },
    setRightBound(value) {
      this.rightBound = value;
    },

    setVerticalLevel(XPos) {
      this.XPos = XPos;
    },

    setTarget(entity) {
      entity.onUpdate(() => {
        if (this.leftBound && this.leftBound > entity.pos.x) {
          k.camPos(this.leftBound, this.XPos);
          return;
        }

        if (this.rightBound && this.rightBound < entity.pos.x) {
          return;
        }

        k.camPos(entity.pos.x, this.XPos);
      });
    },
  };
}
