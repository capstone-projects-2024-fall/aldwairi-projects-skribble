// Function to get query parameters from the URL
function getQueryParameter(name) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
  
  // Display the selected prompt on page load (if already chosen)
  var selectedPrompt = getQueryParameter("prompt");
  if (selectedPrompt) {
    document.getElementById("selectedPrompt").textContent = "Prompt: " + decodeURIComponent(selectedPrompt);
  }