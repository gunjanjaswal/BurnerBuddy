// Popup script for BurnerBuddy extension

// DOM elements
const inboxView = document.getElementById('inbox-view');
const accountsView = document.getElementById('accounts-view');
const tabInbox = document.getElementById('tab-inbox');
const tabAccounts = document.getElementById('tab-accounts');
const noMessages = document.getElementById('no-messages');
const messageList = document.getElementById('message-list');
const messageDetail = document.getElementById('message-detail');
const backToList = document.getElementById('back-to-list');
const messageSubject = document.getElementById('message-subject');
const messageFrom = document.getElementById('message-from');
const messageDate = document.getElementById('message-date');
const messageContent = document.getElementById('message-content');
const confirmButton = document.getElementById('confirm-button');
const noAccounts = document.getElementById('no-accounts');
const accountsList = document.getElementById('accounts-list');

// Current state
let currentHostname = '';
let currentBurnerAccounts = {};
let currentEmail = '';
let currentMessageId = '';

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab to determine hostname
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0];
  
  if (currentTab && currentTab.url) {
    try {
      const url = new URL(currentTab.url);
      currentHostname = url.hostname;
      console.log(`Current hostname: ${currentHostname}`);
      
      // Load burner accounts
      loadBurnerAccounts();
    } catch (error) {
      console.error('Error parsing URL:', error);
    }
  } else {
    console.log('No active tab or URL found');
  }
  
  // Set up tab switching
  tabInbox.addEventListener('click', () => switchTab('inbox'));
  tabAccounts.addEventListener('click', () => switchTab('accounts'));
  
  // Set up back button
  backToList.addEventListener('click', showMessageList);
  
  // Set up confirm button
  confirmButton.addEventListener('click', handleConfirmClick);
  
  // Set up check emails button
  document.getElementById('check-emails-btn').addEventListener('click', checkForEmails);
});

// Check for emails manually
function checkForEmails() {
  console.log('Manually checking for emails...');
  
  // Show loading state
  const checkButton = document.getElementById('check-emails-btn');
  const originalText = checkButton.textContent;
  checkButton.textContent = 'Checking...';
  checkButton.disabled = true;
  
  chrome.runtime.sendMessage({ action: 'checkForEmails' }, (response) => {
    if (response && response.success) {
      console.log('Email check initiated. Refreshing in 3 seconds...');
      setTimeout(() => {
        loadBurnerAccounts();
        
        // Check if we found any emails
        const accounts = currentBurnerAccounts[currentHostname] || [];
        let totalMessages = 0;
        accounts.forEach(acc => {
          totalMessages += acc.messages.length;
        });
        
        // Reset button with notification if emails were found
        if (totalMessages > 0) {
          checkButton.textContent = `${originalText} (${totalMessages} found)`;
        } else {
          checkButton.textContent = originalText;
        }
        checkButton.disabled = false;
      }, 3000);
    } else {
      console.error('Failed to initiate email check:', response ? response.error : 'Unknown error');
      // Reset button on error
      checkButton.textContent = originalText;
      checkButton.disabled = false;
    }
  });
}

// Load burner accounts from background script
function loadBurnerAccounts() {
  console.log('Loading accounts for hostname: ' + currentHostname);
  chrome.runtime.sendMessage({ action: 'getBurnerAccounts' }, (response) => {
    if (response && response.burnerAccounts) {
      console.log(`Received ${Object.keys(response.burnerAccounts).length} hostnames with accounts`);
      currentBurnerAccounts = response.burnerAccounts;
      
      // Check if we have accounts for this hostname
      const accounts = currentBurnerAccounts[currentHostname] || [];
      console.log(`Found ${accounts.length} accounts for current hostname`);
      
      if (accounts.length > 0) {
        accounts.forEach(acc => {
          console.log(`Account: ${acc.firstName} ${acc.lastName} (${acc.email}) - ${acc.messages.length} messages`);
        });
      }
      
      // Render accounts for current hostname
      renderAccounts();
      
      // Render messages for the most recent account
      renderMessages();
    } else {
      console.log('No accounts received or error in response');
    }
  });
}

// Render accounts for current hostname
function renderAccounts() {
  console.log('Rendering accounts for hostname:', currentHostname);
  const accounts = currentBurnerAccounts[currentHostname] || [];
  console.log('Found accounts:', accounts.length);
  
  if (accounts.length === 0) {
    noAccounts.classList.remove('hidden');
    accountsList.classList.add('hidden');
    return;
  }
  
  noAccounts.classList.add('hidden');
  accountsList.classList.remove('hidden');
  accountsList.innerHTML = '';
  
  accounts.forEach(account => {
    const accountItem = document.createElement('div');
    accountItem.className = 'account-item';
    
    const accountInfo = document.createElement('div');
    accountInfo.className = 'account-info';
    
    const accountName = document.createElement('div');
    accountName.className = 'account-name';
    accountName.textContent = `${account.firstName} ${account.lastName}`;
    
    const accountEmail = document.createElement('div');
    accountEmail.className = 'account-email';
    accountEmail.textContent = account.email;
    
    const accountDate = document.createElement('div');
    accountDate.className = 'account-date';
    accountDate.textContent = formatDate(account.createdAt);
    
    accountInfo.appendChild(accountName);
    accountInfo.appendChild(accountEmail);
    accountInfo.appendChild(accountDate);
    
    const messageCount = document.createElement('div');
    messageCount.className = 'message-count';
    const unreadCount = account.messages.filter(msg => !msg.seen).length;
    
    if (unreadCount > 0) {
      messageCount.textContent = unreadCount;
      messageCount.classList.add('has-unread');
    } else if (account.messages.length > 0) {
      messageCount.textContent = account.messages.length;
    }
    
    accountItem.appendChild(accountInfo);
    accountItem.appendChild(messageCount);
    
    // Add click handler
    accountItem.addEventListener('click', () => {
      currentEmail = account.email;
      renderMessages();
      switchTab('inbox');
    });
    
    accountsList.appendChild(accountItem);
  });
  
  // Set current email to the most recent account if not set
  if (!currentEmail && accounts.length > 0) {
    currentEmail = accounts[0].email;
  }
}

// Render messages for current account
function renderMessages() {
  console.log('Rendering messages for email:', currentEmail);
  const accounts = currentBurnerAccounts[currentHostname] || [];
  
  // Find account by email or username part
  let account = null;
  if (currentEmail) {
    account = accounts.find(acc => acc.email === currentEmail);
    
    // If not found by exact match, try matching by username part
    if (!account && currentEmail.includes('@')) {
      const currentUsername = currentEmail.split('@')[0];
      account = accounts.find(acc => {
        const accUsername = acc.email.split('@')[0];
        return accUsername === currentUsername;
      });
      
      // Update currentEmail if found by username
      if (account) {
        console.log(`Updated current email from ${currentEmail} to ${account.email}`);
        currentEmail = account.email;
      }
    }
  } else if (accounts.length > 0) {
    // If no current email but accounts exist, use the first one
    account = accounts[0];
    currentEmail = account.email;
    console.log('No current email, using first account:', currentEmail);
  }
  
  console.log('Found account:', account);
  
  if (!account || account.messages.length === 0) {
    console.log('No messages found');
    noMessages.classList.remove('hidden');
    messageList.classList.add('hidden');
    messageDetail.classList.add('hidden');
    return;
  }
  
  console.log(`Found ${account.messages.length} messages`);
  
  noMessages.classList.add('hidden');
  messageList.classList.remove('hidden');
  messageDetail.classList.add('hidden');
  messageList.innerHTML = '';
  
  // Sort messages by date (newest first)
  const sortedMessages = [...account.messages].sort((a, b) => {
    return new Date(b.receivedAt) - new Date(a.receivedAt);
  });
  
  sortedMessages.forEach(message => {
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    if (!message.seen) {
      messageItem.classList.add('unread');
    }
    
    const messageSubject = document.createElement('div');
    messageSubject.className = 'message-subject';
    messageSubject.textContent = message.subject;
    
    const messageIntro = document.createElement('div');
    messageIntro.className = 'message-intro';
    messageIntro.textContent = message.intro;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = formatDate(message.receivedAt);
    
    messageItem.appendChild(messageSubject);
    messageItem.appendChild(messageIntro);
    messageItem.appendChild(messageTime);
    
    // Add click handler
    messageItem.addEventListener('click', () => {
      showMessageDetail(message);
    });
    
    messageList.appendChild(messageItem);
  });
}

// Show message detail
function showMessageDetail(message) {
  console.log('Showing message detail:', message);
  messageList.classList.add('hidden');
  messageDetail.classList.remove('hidden');
  
  messageSubject.textContent = message.subject || 'No Subject';
  messageFrom.textContent = `From: ${message.from || 'Unknown Sender'}`;
  messageDate.textContent = formatDate(message.receivedAt);
  
  // Set message content
  const content = message.content || 'No content available';
  messageContent.innerHTML = content;
  console.log('Message content length:', content.length);
  
  // Find confirmation links
  const links = messageContent.querySelectorAll('a');
  console.log(`Found ${links.length} links in email`);
  let hasConfirmLink = false;
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    const text = (link.textContent || '').toLowerCase();
    
    console.log(`Link: ${text} -> ${href}`);
    
    if (text.includes('confirm') || text.includes('verify') || text.includes('activate') || 
        (href && (href.includes('confirm') || href.includes('verify') || href.includes('activate')))) {
      hasConfirmLink = true;
      confirmButton.setAttribute('data-href', href);
      confirmButton.classList.remove('hidden');
      console.log('Found confirmation link:', href);
    }
  });
  
  if (!hasConfirmLink) {
    console.log('No confirmation links found');
    confirmButton.classList.add('hidden');
  }
  
  // Mark message as seen
  currentMessageId = message.id;
  if (!message.seen) {
    chrome.runtime.sendMessage({
      action: 'markMessageAsSeen',
      hostname: currentHostname,
      email: currentEmail,
      messageId: message.id
    });
  }
}

// Show message list
function showMessageList() {
  messageDetail.classList.add('hidden');
  messageList.classList.remove('hidden');
}

// Handle confirm button click
function handleConfirmClick() {
  const href = confirmButton.getAttribute('data-href');
  if (href) {
    chrome.tabs.create({ url: href });
  }
}

// Switch between tabs
function switchTab(tab) {
  if (tab === 'inbox') {
    tabInbox.classList.add('active');
    tabAccounts.classList.remove('active');
    inboxView.classList.add('active');
    accountsView.classList.remove('active');
  } else {
    tabInbox.classList.remove('active');
    tabAccounts.classList.add('active');
    inboxView.classList.remove('active');
    accountsView.classList.add('active');
  }
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}
