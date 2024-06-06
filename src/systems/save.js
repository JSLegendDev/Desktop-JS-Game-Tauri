import {
  writeTextFile,
  readTextFile,
  BaseDirectory,
  exists,
} from "@tauri-apps/api/fs";

function makeSaveSystem(savefileName) {
  return {
    data: {},
    async save() {
      await writeTextFile(savefileName, JSON.stringify(this.data), {
        dir: BaseDirectory.AppData,
      });
    },
    async load() {
      this.data = JSON.parse(
        await readTextFile(savefileName, { dir: BaseDirectory.AppData })
      );
    },
  };
}

export const saveSystem = makeSaveSystem("save.json");
