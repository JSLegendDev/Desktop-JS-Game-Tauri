import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";

export function makeSaveSystem(savefileName) {
  return {
    data: {},
    async save() {
      await writeTextFile(savefileName, JSON.stringify(this.data), {
        dir: BaseDirectory.AppData,
      });
    },
    async load() {
      this.load = JSON.parse(
        await readTextFile(savefileName, { dir: BaseDirectory.AppData })
      );
    },
  };
}
