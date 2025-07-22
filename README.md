# 🐉 DTools: D&D 5e Utility App

A React Native/Expo app for managing Dungeons & Dragons 5th Edition gameplay tools. Includes a bestiary, spellbook, combat tracker, and customizable settings.

---

## ✨ Features

- 📚 **Bestiary**: Browse, search, and filter monsters from the 5e SRD.
- ✨ **Spellbook**: View and search spells with detailed descriptions.
- ⚔️ **Combat Tracker**: Manage initiative, HP, and combat status for players and monsters.
- 🎲 **Dice Roller**: Quick dice rolling for any situation.
- 🎨 **Customizable Settings**: Theme, filters, and more.

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd dtools
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the Expo development server:**
   ```sh
   npx expo start
   ```
4. **Run on your device:**
   - Use the Expo Go app (iOS/Android) to scan the QR code.
   - Or run on an emulator/simulator.

---

## 🗂 Project Structure

- `app/` — App entry points and navigation
- `src/components/` — UI components (modals, lists, etc.)
- `src/constants/` — Static data (monsters, spells, tags, etc.)
- `src/context/` — React Context providers for state management
- `src/data/` — Data helpers and resolvers
- `src/hooks/` — Custom React hooks
- `src/style/` — Stylesheets
- `src/theme/` — Theme configuration
- `src/utils/` — Utility functions

---

## 🛠 Useful Commands

- **Lint:**
  ```sh
  npx eslint .
  ```
- **Install new packages:**
  ```sh
  npx expo install <package-name>
  ```

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.