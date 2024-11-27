document.addEventListener("DOMContentLoaded", function () {
  let profilePic = document.getElementById("profile-pic");
  let inputFile = document.getElementById("input-file");
  let nameHead = document.querySelector(".nameHead");
  let emailHead = document.querySelector(".emailHead");

  // Load user details
  let details = JSON.parse(localStorage.getItem("user-info"));
  if (details) {
    nameHead.innerText = details.fullname || "Full Name";
    emailHead.innerText = details.email || "User email";
  }

  // Load saved profile image
  let savedImage = localStorage.getItem("profile-image");
  if (savedImage) {
    profilePic.src = savedImage;
  }

  // Handle file input change
  inputFile.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePic.src = e.target.result;
        localStorage.setItem("profile-image", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  console.log("User Details:", details);
});
