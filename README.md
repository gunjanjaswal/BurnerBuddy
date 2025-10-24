# FormGuard - Privacy-First Form Filler Chrome Extension

FormGuard is a one-click consumer privacy tool that combines a dummy data form filler with a temporary inbox generator. It allows you to sign up for services without using your real email address, helping you avoid spam and protect your privacy.

## Features

- **One-Click Form Filling**: Right-click on any form field and select "Fill with FormGuard" to automatically fill all fields with temporary data.
- **Temporary Email Inbox**: Each burner account comes with a temporary email address that can receive confirmation emails.
- **Email Notifications**: The extension icon changes when you receive a new email, and you can view the email content directly in the popup.
- **Confirmation Links**: Easily click on confirmation links in emails to verify your account.
- **Multiple FormGuard Accounts**: Create and manage multiple protected accounts for different websites.

## Installation

### Developer Mode Installation

1. Download or clone this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top-right corner.
4. Click "Load unpacked" and select the `formguard-extension` folder.
5. The FormGuard extension should now be installed and visible in your Chrome toolbar.

## Usage

### Creating a Protected Account

1. Navigate to a website with a signup form.
2. Right-click on any form field (name, email, password).
3. Select "Fill with FormGuard" from the context menu.
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

## Technical Details

### API Integration

This extension uses the [Mail.tm](https://mail.tm/) API for temporary email functionality. The API allows for:

- Creating temporary email addresses
- Checking for new messages
- Reading message content

### Privacy Considerations

- All account data is stored locally in your browser's storage.
- No data is sent to any servers except for the Mail.tm API for email functionality.
- The extension does not track your browsing history or collect any personal information.

## Development

### Project Structure

```
formguard-extension/
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

## License

This project is open source and available under the MIT License.
