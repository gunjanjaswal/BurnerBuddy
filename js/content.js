// Content script for Burner extension

// This script is injected into all web pages
// It's primarily used to communicate with the background script
// The actual form filling logic is injected dynamically when needed

console.log('Burner extension content script loaded');

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getFormFields') {
    // Find all form fields on the page
    const formFields = findFormFields();
    sendResponse({ formFields });
  }
  
  return true; // Keep the message channel open for async response
});

// Function to find all form fields on the page
function findFormFields() {
  const fields = [];
  const inputElements = document.querySelectorAll('input');
  
  inputElements.forEach(input => {
    const type = input.type.toLowerCase();
    const name = (input.name || '').toLowerCase();
    const id = (input.id || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    
    // Skip hidden fields and submit buttons
    if (type === 'hidden' || type === 'submit' || type === 'button') {
      return;
    }
    
    let fieldType = 'unknown';
    
    // Determine field type
    if (type === 'email' || name.includes('email') || id.includes('email') || placeholder.includes('email')) {
      fieldType = 'email';
    } else if (type === 'password' || name.includes('password') || id.includes('password') || placeholder.includes('password')) {
      fieldType = 'password';
    } else if (name.includes('first') || id.includes('first') || placeholder.includes('first name')) {
      fieldType = 'firstName';
    } else if (name.includes('last') || id.includes('last') || placeholder.includes('last name')) {
      fieldType = 'lastName';
    } else if (name.includes('name') || id.includes('name') || placeholder.includes('name')) {
      fieldType = 'fullName';
    }
    
    fields.push({
      type: fieldType,
      element: input
    });
  });
  
  return fields;
}
