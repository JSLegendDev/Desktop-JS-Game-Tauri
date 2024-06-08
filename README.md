# Desktop Game made in JavaScript + Tauri

![game screenshot](./game.png)

Flappy bird style game made with the Kaplay library and Tauri. It features a basic save system where your best score is saved on disk.

Supports multiple inputs (Mouse, Keyboard and Gamepad)

Download for Windows here : https://jslegend.itch.io/kriby

Tutorial on how to build this : (TBD)

## How to run?

1. Make sure you have the prerequisites : https://tauri.app/v1/guides/getting-started/prerequisites
2. Make sure have Node.js installed.
3. Clone the repo.
4. Once in the repo, do `npm install` to install the required dependencies.
5. Run the project in dev by doing `npm run tauri dev`.

## How to distribute the project as an installable app?

1. Build the project by doing `npm run tauri build`.
2. After the build is complete go to `target > release > bundle > msi`.
3. Distribute the installer on sites like itch.io or on Steam.

_Note : It's important to distribute the installer and not the .exe available `target > release >  Your Game.exe` because Tauri relies on WebView2 to be present on the system.The installer will make sure to download and install it on the users system if not already there. This is not the case for the .exe._
