// Function to update avatar name
function updateAvatarName() {
    const newAvatarName = document.getElementById('avatarName').value;
    if (newAvatarName) {
        document.getElementById('userName').innerText = newAvatarName;
        document.getElementById('avatarName').value = ''; // Clear input field
    } else {
        alert('Please enter a new avatar name.');
    }
}

// Function to change background color
function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

function goToPage(page) {
    window.location.href = page; // Navigate directly to the specified page
}