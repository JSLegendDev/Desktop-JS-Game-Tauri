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
        dir: BaseDirectory.AppData,
        recursive: true,
      });
    },
    async save() {
      await writeTextFile("save.json", JSON.stringify(this.data), {
        dir: BaseDirectory.AppLocalData,
      });
    },
    async load() {
      try {
        this.data = JSON.parse(
          await readTextFile("save.json", {
            dir: BaseDirectory.AppLocalData,
          })
        );
      } catch {
        this.data = {};
      }
    },
  };
}

export const saveSystem = makeSaveSystem("save.json");
