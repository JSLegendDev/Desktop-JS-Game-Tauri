import {
  writeTextFile,
  readTextFile,
  BaseDirectory,
  createDir,
  exists,
} from "@tauri-apps/api/fs";

function makeSaveSystem(savefileName) {
  return {
    data: {},
    async createSaveDataFolder() {
      const folderExists = await exists("saveData", {
        dir: BaseDirectory.AppData,
      });

      if (folderExists) return;

      await createDir("saveData", {
        dir: "BaseDirectory.AppData",
        recursive: true,
      });
    },
    async save() {
      await writeTextFile(
        `.\\saveData\\${savefileName}`,
        JSON.stringify(this.data)
      );
    },
    async load() {
      try {
        this.data = JSON.parse(
          await readTextFile(`.\\saveData\\${savefileName}`)
        );
      } catch {
        this.data = {};
      }
    },
  };
}

export const saveSystem = makeSaveSystem("save.json");
