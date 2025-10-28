# 🔥 BurnerBuddy - Privacy-First Form Filler Chrome Extension

**Your friendly privacy companion for hassle-free signups**

BurnerBuddy is a one-click consumer privacy tool that combines a dummy data form filler with a simulated temporary inbox. It allows you to sign up for services without using your real email address, helping you avoid spam and protect your privacy.

## ✨ Features

- **🎯 One-Click Form Filling**: Right-click on any form field and select "Fill with BurnerBuddy" to automatically fill all fields with temporary data.
- **📧 Simulated Email Inbox**: Each burner account comes with a temporary email address that can receive simulated confirmation emails.
- **🔔 Email Notifications**: The extension badge changes when you receive a new email, and you can view the email content directly in the popup.
- **✅ Confirmation Links**: Easily click on confirmation links in emails to verify your account.
- **🗂️ Multiple Accounts**: Create and manage multiple protected accounts for different websites.
- **🔒 Privacy-First**: All data is stored locally in your browser - no external servers, no tracking.

## Installation

### Developer Mode Installation

1. Download or clone this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top-right corner.
4. Click "Load unpacked" and select the `BurnerBuddy` folder.
5. The BurnerBuddy extension should now be installed and visible in your Chrome toolbar.

## Usage

### Creating a Protected Account

1. Navigate to a website with a signup form.
2. Right-click on any form field (name, email, password).
3. Select "Fill with BurnerBuddy" from the context menu.
4. The extension will automatically fill all form fields with temporary data.
5. Submit the form to create your account.

### Checking for Emails

1. When you receive a confirmation email, the extension icon will change to indicate a new message.
2. Click on the extension icon to open the popup.
3. View the email content and click the "Confirm Email" button to open the confirmation link.

### Managing Protected Accounts

1. Click on the extension icon to open the popup.
2. Click on the "My Accounts" tab to view all your protected accounts.
3. Click on an account to view its emails.

## 🔧 Technical Details

### Email Simulation

This extension uses a simulated email system for demonstration purposes:

- Generates temporary email addresses with custom domains
- Simulates receiving confirmation emails
- All email data is stored locally in your browser

### Privacy Considerations

- ✅ All account data is stored locally in your browser's storage
- ✅ No external API calls or data transmission
- ✅ No tracking or analytics
- ✅ No personal information collection
- ✅ Open source and transparent code

## Development

### Project Structure

```
BurnerBuddy/
├── manifest.json        # Extension configuration
├── js/
│   ├── background.js    # Background script for core functionality
│   ├── content.js       # Content script injected into web pages
│   └── popup.js         # Script for the popup UI
├── html/
│   └── popup.html       # Popup UI HTML
├── css/
│   └── popup.css        # Popup UI styles
└── images/              # Extension icons
```

### Building from Source

No build process is required. The extension can be loaded directly as an unpacked extension in Chrome's developer mode.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Made with ❤️, a little caffeine ☕, and zero questionable shortcuts**

Created by [Gunjan Jaswal](https://gunjanjaswal.me)

### ☕ Support This Project

If you find BurnerBuddy useful, consider buying me a coffee! Your support helps keep this project alive and caffeinated.

<a href="https://buymeacoffee.com/gunjanjaswal" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 50px !important;width: 180px !important;" >
</a>

---

<div align="center">
  <p>© 2025 BurnerBuddy. All rights reserved.</p>
  <p>
    <a href="https://gunjanjaswal.me">Website</a> •
    <a href="https://github.com/gunjanjaiswal">GitHub</a> •
    <a href="https://buymeacoffee.com/gunjanjaswal">Buy Me a Coffee</a>
  </p>
</div>
