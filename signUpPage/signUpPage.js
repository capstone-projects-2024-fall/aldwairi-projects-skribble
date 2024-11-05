function myFunction() {
    const x = document.getElementById("userName").value;
    const y = document.getElementById("userEmail").value;
    document.getElementById("demo2").innerHTML = x;
    document.getElementById("demo").innerHTML = y;
  window.location.href = '../homePage/homePage.html';
    // TO-DO: connect backend with frontend to allow the entry of the username, password, and email into the database
  }