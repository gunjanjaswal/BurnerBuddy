<div align="center">

# 🔥 BurnerBuddy

### Privacy-First Form Filler &amp; Simulated Burner Inbox for Chrome

**Your friendly privacy companion for hassle-free signups.**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-34A853?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/gunjanjaswal/BurnerBuddy/releases)
[![License](https://img.shields.io/badge/License-MIT-success)](LICENSE)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-FF5E5B)](PRIVACY.md)
[![Author](https://img.shields.io/badge/by-Gunjan%20Jaswal-9333ea)](https://www.gunjanjaswal.me)
[![Support on Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/gunjanjaswal)

</div>

---

BurnerBuddy is a one-click consumer privacy tool that combines a **dummy data form filler** with a **simulated temporary inbox**. Sign up for services without handing over your real email address — avoid spam, dodge marketing lists, and keep your real identity out of databases you don't trust.

> ⚠️ **Note:** The inbox is a *local simulation* for demos and testing. It does not connect to a real mail server — see [Technical Details](#-technical-details).

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Technical Details](#-technical-details)
- [Privacy](#-privacy)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## ✨ Features

| | Feature | What it does |
|---|---|---|
| 🎯 | **One-Click Form Filling** | Right-click any form field → *"Fill with BurnerBuddy"* to populate every field with realistic dummy data. |
| 📧 | **Simulated Email Inbox** | Each burner account gets a temporary address that can receive simulated confirmation mail. |
| 🔔 | **Email Notifications** | The toolbar badge updates when a new message arrives; read it right in the popup. |
| ✅ | **Confirmation Links** | One click follows the verification link inside a simulated email. |
| 🗂️ | **Multiple Accounts** | Create and manage separate burner identities per website. |
| 🔒 | **Privacy-First** | Everything is stored locally in your browser — no servers, no tracking. |

## 🚀 Installation

### Developer Mode (Load Unpacked)

1. **Download** or clone this repository:
   ```bash
   git clone https://github.com/gunjanjaswal/BurnerBuddy.git
   ```
2. Open Chrome and go to `chrome://extensions/`.
3. Toggle **Developer mode** on (top-right corner).
4. Click **Load unpacked** and select the `BurnerBuddy` folder.
5. Pin BurnerBuddy from the toolbar puzzle icon and you're ready. 🔥

## 💻 Usage

### Create a Protected Account
1. Open any website with a signup form.
2. Right-click a form field (name, email, password).
3. Choose **Fill with BurnerBuddy** from the context menu.
4. Every field is filled with temporary data — submit the form.

### Check for Emails
1. When a confirmation arrives, the extension icon changes to flag a new message.
2. Click the icon to open the popup and read the email.
3. Hit **Confirm Email** to follow the verification link.

### Manage Accounts
1. Open the popup and switch to the **My Accounts** tab.
2. Browse every burner identity you've created.
3. Click an account to view its inbox.

## 🔧 Technical Details

### Email Simulation
BurnerBuddy ships a **self-contained, simulated** mail system for demonstration and testing:

- Generates temporary email addresses with custom domains.
- Simulates the arrival of confirmation emails.
- Stores all message data locally in browser storage.

### Architecture
- **Manifest V3** service-worker background script (`js/background.js`).
- **Content script** (`js/content.js`) injected into pages for context-menu form filling.
- **Popup UI** (`html/popup.html` + `js/popup.js` + `css/popup.css`) for accounts and inbox.

## 🔒 Privacy

- ✅ All account data lives in your browser's local storage.
- ✅ No external API calls, no data transmission.
- ✅ No tracking, no analytics.
- ✅ No personal information is collected.
- ✅ Fully open source and auditable.

See [PRIVACY.md](PRIVACY.md) for the full policy.

## 📁 Project Structure

```
BurnerBuddy/
├── manifest.json        # Extension configuration (MV3)
├── js/
│   ├── background.js    # Service worker — core logic & context menu
│   ├── content.js       # Injected into pages to fill forms
│   └── popup.js         # Popup UI logic
├── html/
│   ├── popup.html       # Popup UI
│   └── onboarding.html  # First-run welcome page
├── css/
│   └── popup.css        # Popup styles
└── images/              # Extension icons & assets
```

> **Building from source:** none required. Load the folder directly as an unpacked extension.

## 🤝 Contributing

Contributions are welcome! Open an issue or submit a pull request. Bug reports, new dummy-data locales, and UI polish are all appreciated.

## 📄 License

Released under the **MIT License** — free to use, modify, and distribute.

## ☕ Support

If BurnerBuddy keeps your inbox clean, consider supporting development on Ko-fi. It keeps the project alive and caffeinated. 🙏

<div align="center">

[![Support on Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/gunjanjaswal)

</div>

---

<div align="center">

**Made with ❤️, a little caffeine ☕, and zero questionable shortcuts**

Created by [**Gunjan Jaswal**](https://www.gunjanjaswal.me) • [GitHub](https://github.com/gunjanjaswal) • [Ko-fi](https://ko-fi.com/gunjanjaswal)

<sub>© 2025 BurnerBuddy. All rights reserved.</sub>

</div>
