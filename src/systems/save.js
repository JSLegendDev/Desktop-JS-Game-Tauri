import {
  writeTextFile,
  readTextFile,
  BaseDirectory,
  exists,
} from "@tauri-apps/api/fs";

async function makeSaveSystem(savefileName) {
  const saveExists = await exists(savefileName, { dir: BaseDirectory.AppData });

  if (!saveExists) {
    await writeTextFile(savefileName, JSON.stringify({}), {
      dir: BaseDirectory.AppData,
    });
  }

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

export const saveSystem = await makeSaveSystem("save.json");
