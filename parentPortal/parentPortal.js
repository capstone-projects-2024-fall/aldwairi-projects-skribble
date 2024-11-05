// Function to update the parent's email
function changeEmail() {
    const newEmail = document.getElementById('newEmail').value;
    if (newEmail) {
        // Update the displayed email
        document.getElementById('parentEmail').innerText = newEmail;
        document.getElementById('newEmail').value = ''; // Clear input field
        alert('Email updated successfully!');
    } else {
        alert('Please enter a valid email address.');
    }
}

// Function to save the selected feature control settings
function saveControls() {
    const addViewFriends = document.getElementById('addViewFriends').checked;
    const enableChat = document.getElementById('enableChat').checked;
    const mediaSharing = document.getElementById('mediaSharing').checked;
    const timeLimit = document.getElementById('timeLimit').value;

    // Display the saved settings as a confirmation
    let settingsSummary = `
        Add/View Friends: ${addViewFriends ? 'Enabled' : 'Disabled'}\n
        Enable Chat: ${enableChat ? 'Enabled' : 'Disabled'}\n
        Media Sharing: ${mediaSharing ? 'Enabled' : 'Disabled'}\n
        Time Limit: ${timeLimit} hrs/day
    `;
    
    alert(`Settings Saved:\n${settingsSummary}`);
}
