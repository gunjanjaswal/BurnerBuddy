// Background script for BurnerBuddy extension

// We'll use a direct approach without relying on external APIs
// This simulates having an email but doesn't actually check for real emails
// For a production extension, you would need to use a paid email API service

// Available domains we'll pretend to use
const AVAILABLE_DOMAINS = [
  'formguard-mail.com',
  'secure-temp.org',
  'private-inbox.net'
];

// Store for simulated emails
let simulatedEmails = {};

// Store for active burner accounts
let burnerAccounts = {};
let activePollingIntervals = {};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('BurnerBuddy extension installed');
  
  // Create context menu item
  chrome.contextMenus.create({
    id: 'fill-with-burnerbuddy',
    title: 'Fill with BurnerBuddy',
    contexts: ['editable']
  });
  
  // Load existing burner accounts from storage
  chrome.storage.local.get(['burnerAccounts'], (result) => {
    if (result.burnerAccounts) {
      burnerAccounts = result.burnerAccounts;
    }
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'fill-with-burnerbuddy') {
    // Generate a new burner account and fill the form
    createBurnerAccount(tab.url)
      .then(burnerData => {
        // Inject content script to fill the form
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: fillFormWithBurnerData,
          args: [burnerData]
        });
        
        // Start polling for emails
        startPollingForEmails(burnerData.email, burnerData.password, tab.url);
        
        // Update extension icon to show "waiting" state
        updateExtensionIcon('waiting');
      })
      .catch(error => {
        console.error('Error creating burner account:', error);
      });
  }
});

// Create a new burner account
async function createBurnerAccount(url) {
  try {
    console.log('Creating new burner account for URL:', url);
    // Generate random user data
    const firstName = generateRandomFirstName();
    const lastName = generateRandomLastName();
    const randomString = generateRandomString(4);
    
    // Always use the first domain from the available domains for consistency
    // This helps ensure we're using a domain that works with our simulated email system
    const domain = AVAILABLE_DOMAINS[0]; // Using formguard-mail.com
    console.log('Using domain:', domain);
    
    // Generate email address
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${randomString}`;
    const email = `${username}@${domain}`;
    const password = generateRandomPassword();
    console.log('Generated account:', email);
    
    // Store the burner account
    const hostname = new URL(url).hostname;
    if (!burnerAccounts[hostname]) {
      burnerAccounts[hostname] = [];
    }
    
    const burnerData = {
      firstName,
      lastName,
      email,
      password,
      createdAt: new Date().toISOString(),
      messages: []
    };
    
    burnerAccounts[hostname].unshift(burnerData);
    
    // Save to storage
    chrome.storage.local.set({ burnerAccounts });
    
    return burnerData;
  } catch (error) {
    console.error('Error in createBurnerAccount:', error);
    throw error;
  }
}

// Start polling for emails
function startPollingForEmails(email, password, url) {
  const hostname = new URL(url).hostname;
  
  console.log(`Starting email polling for ${email} on ${hostname}`);
  
  // Check immediately for testing purposes
  checkForNewEmails(null, hostname, email);
  
  // Set up polling interval
  const intervalId = setInterval(() => {
    checkForNewEmails(null, hostname, email);
  }, 5000); // Check every 5 seconds
  
  activePollingIntervals[email] = intervalId;
}

// This function is kept for compatibility but simplified
async function registerEmailWithAPI(email, password) {
  try {
    console.log('Using simulated email:', email);
    
    // Parse the email to get username and domain
    const [username, emailDomain] = email.split('@');
    
    // Check if the domain is in our list of available domains
    if (!AVAILABLE_DOMAINS.includes(emailDomain)) {
      console.warn(`Warning: Email domain ${emailDomain} is not in the list of available domains`);
      console.warn('Available domains:', AVAILABLE_DOMAINS);
    }
    
    return null; // No token needed for simulated emails
  } catch (error) {
    console.error('Error in registerEmailWithAPI:', error);
    throw error;
  }
}

// Update email domain in burnerAccounts
function updateEmailDomain(oldEmail, newEmail) {
  console.log(`Updating email from ${oldEmail} to ${newEmail}`);
  
  if (oldEmail === newEmail) {
    console.log('Email addresses are the same, no update needed');
    return;
  }
  
  let updated = false;
  
  // Extract usernames for comparison
  const oldUsername = oldEmail.split('@')[0];
  const newUsername = newEmail.split('@')[0];
  
  if (oldUsername !== newUsername) {
    console.log('Warning: Usernames do not match. This might cause issues.');
  }
  
  // Loop through all hostnames and accounts
  Object.keys(burnerAccounts).forEach(hostname => {
    const accounts = burnerAccounts[hostname];
    
    // Try to find by exact match first
    let account = accounts.find(acc => acc.email === oldEmail);
    
    // If not found, try to find by username
    if (!account && oldUsername) {
      account = accounts.find(acc => {
        const accUsername = acc.email.split('@')[0];
        return accUsername === oldUsername;
      });
    }
    
    if (account) {
      console.log(`Found account to update on ${hostname}: ${account.email} -> ${newEmail}`);
      account.email = newEmail;
      updated = true;
    }
  });
  
  if (updated) {
    // Save to storage
    console.log('Saving updated accounts to storage');
    chrome.storage.local.set({ burnerAccounts }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving to storage:', chrome.runtime.lastError);
      } else {
        console.log('Successfully saved updated accounts to storage');
      }
    });
  } else {
    console.log('No matching accounts found to update');
  }
}

// Check for new emails (simulated)
async function checkForNewEmails(token, hostname, email) {
  try {
    // Parse the email to get username and domain
    const [username, domain] = email.split('@');
    
    console.log(`Checking for new emails for ${email} on ${hostname}...`);
    
    // Verify the domain is supported
    if (!AVAILABLE_DOMAINS.includes(domain)) {
      console.log(`Domain ${domain} is not in our list of supported domains`);
      console.log('Supported domains:', AVAILABLE_DOMAINS);
      return;
    }
    
    // Create a unique key for this email
    const emailKey = `${username}@${domain}`;
    
    // Check if we have any simulated emails for this address
    if (!simulatedEmails[emailKey]) {
      // Generate a simulated email after a short delay (first time only)
      if (Math.random() > 0.3) { // 70% chance to get an email
        console.log(`Generating simulated email for ${emailKey}`);
        
        // Create a simulated email after a short delay
        setTimeout(() => {
          generateSimulatedEmail(emailKey, hostname);
        }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
      }
      
      // Initialize the email array
      simulatedEmails[emailKey] = [];
    }
    
    // Get any existing messages
    const messages = simulatedEmails[emailKey] || [];
    
    if (messages.length > 0) {
      console.log(`Found ${messages.length} messages for ${emailKey}`);
      updateExtensionIcon('new');
      
      // Find the burner account and add the messages
      if (burnerAccounts[hostname]) {
        // Find the account by email
        const account = burnerAccounts[hostname].find(acc => acc.email === emailKey);
        
        if (account) {
          console.log(`Found matching account for ${emailKey}`);
          
          // Add any new messages to the account
          let newMessageCount = 0;
          
          messages.forEach(message => {
            // Check if we already have this message
            const messageExists = account.messages.some(msg => msg.id === message.id);
            
            if (!messageExists) {
              console.log(`Adding new message: ${message.subject}`);
              account.messages.push(message);
              newMessageCount++;
            }
          });
          
          if (newMessageCount > 0) {
            console.log(`Added ${newMessageCount} new messages to account`);
            
            // Save to storage
            chrome.storage.local.set({ burnerAccounts }, () => {
              console.log('Saved updated messages to storage');
            });
          }
        } else {
          console.log(`No matching account found for ${emailKey}`);
        }
      } else {
        console.log(`No accounts found for hostname: ${hostname}`);
      }
    } else {
      console.log(`No messages found for ${emailKey}`);
    }
  } catch (error) {
    console.error('Error checking for new emails:', error);
  }
}

// Update extension icon
function updateExtensionIcon(state) {
  // Use the same icon for all states to avoid icon loading issues
  // We'll just change the badge text/color to indicate state
  
  let badgeText = '';
  let badgeColor = '#4a6cf7'; // Default blue color
  
  switch (state) {
    case 'waiting':
      badgeText = '⏳';
      badgeColor = '#FFA500'; // Orange
      break;
    case 'new':
      badgeText = '1';
      badgeColor = '#FF0000'; // Red
      break;
    default:
      badgeText = '';
      badgeColor = '#4a6cf7'; // Blue
  }
  
  // Set badge text and color
  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  
  // Temporarily disabled until we have valid icon files
  // Always use the same icon
  // const path = {
  //   16: '/images/icon16.png',
  //   48: '/images/icon48.png',
  //   128: '/images/icon128.png'
  // };
  // 
  // chrome.action.setIcon({ path });
}

// Generate a simulated email for testing
function generateSimulatedEmail(email, hostname) {
  // Create a unique message ID
  const messageId = Date.now().toString();
  
  // Create a simulated message
  const message = {
    id: messageId,
    subject: 'Welcome to ' + hostname,
    from: `noreply@${hostname}`,
    intro: 'Thank you for registering! Please confirm your email address by clicking the link below.',
    seen: false,
    receivedAt: new Date().toISOString(),
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome to ${hostname}!</h2>
        <p>Thank you for registering an account with us.</p>
        <p>Please confirm your email address by clicking the button below:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://${hostname}/confirm?token=simulated-token-${messageId}" 
             style="background-color: #4a6cf7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Confirm Email
          </a>
        </p>
        <p>If you did not create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The ${hostname} Team</p>
      </div>
    `
  };
  
  // Add the message to our simulated emails
  if (!simulatedEmails[email]) {
    simulatedEmails[email] = [];
  }
  
  simulatedEmails[email].push(message);
  console.log(`Generated simulated email for ${email}:`, message);
  
  // Update the extension icon
  updateExtensionIcon('new');
}

// Function to be injected into the page to fill form fields
function fillFormWithBurnerData(burnerData) {
  // Find all input fields on the page
  const inputFields = document.querySelectorAll('input');
  
  inputFields.forEach(field => {
    const fieldType = field.type.toLowerCase();
    const fieldName = (field.name || '').toLowerCase();
    const fieldId = (field.id || '').toLowerCase();
    const placeholder = (field.placeholder || '').toLowerCase();
    
    // Determine field type based on attributes
    if (fieldType === 'email' || fieldName.includes('email') || fieldId.includes('email') || placeholder.includes('email')) {
      field.value = burnerData.email;
    } else if (fieldType === 'password' || fieldName.includes('password') || fieldId.includes('password') || placeholder.includes('password')) {
      field.value = burnerData.password;
    } else if (fieldName.includes('first') || fieldId.includes('first') || placeholder.includes('first name')) {
      field.value = burnerData.firstName;
    } else if (fieldName.includes('last') || fieldId.includes('last') || placeholder.includes('last name')) {
      field.value = burnerData.lastName;
    } else if (fieldName.includes('name') || fieldId.includes('name') || placeholder.includes('name')) {
      // If it's just "name" without first/last specification, use full name
      field.value = `${burnerData.firstName} ${burnerData.lastName}`;
    }
    
    // Trigger input event to notify the page of changes
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

// Helper functions for generating random data
function generateRandomFirstName() {
  const firstNames = [
    'Alan', 'Alex', 'Alice', 'Amy', 'Andrew', 'Anna', 'Anthony', 'Ashley',
    'Barbara', 'Benjamin', 'Betty', 'Brian', 'Carol', 'Catherine', 'Charles', 'Christopher',
    'Daniel', 'David', 'Deborah', 'Donald', 'Dorothy', 'Edward', 'Elizabeth', 'Emily',
    'Emma', 'Eric', 'Ethan', 'Frank', 'George', 'Grace', 'Hannah', 'Helen',
    'Henry', 'Jack', 'James', 'Jane', 'Jason', 'Jennifer', 'John', 'Joseph',
    'Karen', 'Kevin', 'Kimberly', 'Laura', 'Linda', 'Lisa', 'Margaret', 'Maria',
    'Mark', 'Mary', 'Matthew', 'Michael', 'Michelle', 'Nancy', 'Nicholas', 'Olivia',
    'Patricia', 'Paul', 'Richard', 'Robert', 'Sarah', 'Steven', 'Susan', 'Thomas',
    'William'
  ];
  
  return firstNames[Math.floor(Math.random() * firstNames.length)];
}

function generateRandomLastName() {
  const lastNames = [
    'Adams', 'Allen', 'Anderson', 'Baker', 'Brown', 'Campbell', 'Carter', 'Clark',
    'Davis', 'Evans', 'Garcia', 'Gonzalez', 'Green', 'Hall', 'Harris', 'Hernandez',
    'Jackson', 'Johnson', 'Jones', 'King', 'Lee', 'Lewis', 'Lopez', 'Martin',
    'Martinez', 'Miller', 'Mitchell', 'Moore', 'Nelson', 'Parker', 'Perez', 'Phillips',
    'Roberts', 'Robinson', 'Rodriguez', 'Scott', 'Smith', 'Taylor', 'Thomas', 'Thompson',
    'Turner', 'Walker', 'White', 'Williams', 'Wilson', 'Wright', 'Young'
  ];
  
  return lastNames[Math.floor(Math.random() * lastNames.length)];
}

function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

function generateRandomPassword() {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=';
  
  let password = '';
  
  // Ensure at least one of each character type
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  
  // Add more random characters to reach desired length (12)
  const allChars = lowercase + uppercase + numbers + symbols;
  for (let i = 0; i < 8; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

// Reset all stored data
function resetAllData() {
  console.log('Resetting all stored data...');
  
  // Clear all burner accounts
  burnerAccounts = {};
  
  // Clear all polling intervals
  Object.values(activePollingIntervals).forEach(intervalId => {
    clearInterval(intervalId);
  });
  activePollingIntervals = {};
  
  // Clear storage
  chrome.storage.local.clear(() => {
    if (chrome.runtime.lastError) {
      console.error('Error clearing storage:', chrome.runtime.lastError);
    } else {
      console.log('Successfully cleared all stored data');
    }
  });
  
  return { success: true, message: 'All data has been reset' };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getBurnerAccounts') {
    console.log('Sending burner accounts to popup');
    sendResponse({ burnerAccounts });
  } else if (message.action === 'resetAllData') {
    console.log('Reset all data requested');
    const result = resetAllData();
    sendResponse(result);
  } else if (message.action === 'markMessageAsSeen') {
    const { hostname, email, messageId } = message;
    
    if (burnerAccounts[hostname]) {
      const account = burnerAccounts[hostname].find(acc => acc.email === email);
      if (account) {
        const message = account.messages.find(msg => msg.id === messageId);
        if (message) {
          message.seen = true;
          chrome.storage.local.set({ burnerAccounts });
          sendResponse({ success: true });
        }
      }
    }
  } else if (message.action === 'checkForEmails') {
    console.log('Manual check for emails requested');
    
    // Check for emails for all accounts
    let checkCount = 0;
    
    // Loop through all hostnames and accounts
    Object.keys(burnerAccounts).forEach(hostname => {
      const accounts = burnerAccounts[hostname];
      
      accounts.forEach(account => {
        const email = account.email;
        
        checkCount++;
        console.log(`Manually checking emails for ${email}`);
        
        // Force generate a simulated email for testing
        const [username, domain] = email.split('@');
        if (AVAILABLE_DOMAINS.includes(domain)) {
          // Generate a new simulated email
          setTimeout(() => {
            generateSimulatedEmail(email, hostname);
            
            // Then check for emails
            setTimeout(() => {
              checkForNewEmails(null, hostname, email)
                .then(() => {
                  console.log(`Successfully checked emails for ${email}`);
                })
                .catch(error => {
                  console.error(`Error checking emails for ${email}:`, error);
                });
            }, 500);
          }, 1000);
        } else {
          console.log(`Skipping email with unsupported domain: ${email}`);
        }
      });
    });
    
    sendResponse({ 
      success: true, 
      message: `Generating and checking emails for ${checkCount} accounts` 
    });
  }
  
  return true; // Keep the message channel open for async response
});
