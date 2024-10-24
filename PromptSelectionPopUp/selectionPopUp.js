// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Handle prompt selection and redirection
var prompts = document.querySelectorAll(".modal-body li");
prompts.forEach(function(prompt) {
  prompt.addEventListener("click", function() {
    var selectedPrompt = prompt.textContent;

    // Navigate to the new page (journal page) and pass the selected prompt
    window.location.href = "journalPage.html?prompt=" + encodeURIComponent(selectedPrompt);
  });
});