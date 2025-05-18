*“While coding, did you forget to pray?”*

# VSCode Prayer Times

A **Visual Studio Code extension** that seamlessly integrates Islamic prayer times into your coding workflow. Never miss a prayer again—stay focused on your code and your faith.

---

## 🚀 Key Features

* **VS Code Integration**: Fully integrated as an extension—no external apps needed.
* **Activity Bar Panel**: Click the prayer icon in the Activity Bar to view today’s full prayer schedule.
* **Status Bar Countdown**: Live countdown to the next upcoming prayer right in your Status Bar.
* **Pre-Prayer Alerts**: Configurable reminder (default 5 minutes) before each prayer.
* **On-Time Notifications**: Receive a notification exactly when prayer time begins.
* **Automatic Geolocation**: Detects your city and country through secure IP lookup.
* **Daily Cache & Midnight Refresh**: Caches data for the day, automatically refreshing at midnight.
* **Manual Refresh Command**: Instantly update prayer times via the Command Palette (`Refresh Prayer Times`).

---

## ⚙️ Installation

1. **Prerequisites**

   * [Node.js](https://nodejs.org/) (v14 or newer)
   * Visual Studio Code (v1.60 or newer)

2. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/vscode-prayer-times.git
   cd vscode-prayer-times
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Build the extension**

   ```bash
   npm run compile
   ```

5. **Launch the extension**

   * Open this folder in VS Code.
   * Press <kbd>F5</kbd> to start an Extension Development Host window.
   * The extension will activate on startup and display prayer times.

---

## 💡 Usage

* **Status Bar**: Watch a live countdown to the next prayer.
* **Activity Bar**: Click the Prayer Times icon for today’s full schedule.
* **Notifications**:

  * Pre-prayer reminder (default 5 minutes before).
  * On-time alert at the exact prayer moment.
* **Commands**:

  * `Refresh Prayer Times` – Manually fetch and update times.

---

## 🛠 Configuration

Customize settings in your VS Code `settings.json`:

```json
{
  "prayerTimes.calculationMethod": 13,       // Calculation method (e.g., Diyanet = 13)
  "prayerTimes.overrideLocation": "City, Country",
  "prayerTimes.preAlertMinutes": 5          // Minutes before prayer for reminder
}
```

---

## ✅ Testing

1. **Unit Tests**

   ```bash
   npm test
   ```

2. **Manual End-to-End**

   * Launch via <kbd>F5</kbd>.
   * Confirm countdown appears in the Status Bar.
   * Open Activity Bar panel to view schedule.
   * Wait for or simulate prayer times to see notifications.
   * Run `Refresh Prayer Times` to force-update.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please open an issue or submit a pull request.

---

## 📅 Roadmap

* Calendar heatmap view of prayer times
* Localization and regional support
* Theme-aware styling (light/dark)
* Unit tests for Webview components
* Screenshots and visual assets

---

## 📄 License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.
