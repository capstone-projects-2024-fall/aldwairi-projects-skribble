  // Function to get query parameters from the URL
  function getQueryParameter(name) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Display the selected prompt
  var selectedPrompt = getQueryParameter("prompt");
  document.getElementById("selectedPrompt").textContent = "Prompt: " + selectedPrompt;

  // Handle the "Change Prompt" button
  document.getElementById("changePrompt").onclick = function() {
    window.location.href = "selectionPopUp.html"; // Redirect back to prompt selection page
  };