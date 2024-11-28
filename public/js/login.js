const container = document.querySelector(".container");
const signInForm = document.querySelector(".sign-in-form");
const signUpForm = document.querySelector(".sign-up-form");
const signInBtn = document.querySelector("#sign-in-btn");
const signUpBtn = document.querySelector("#sign-up-btn");

const formElements = {
  signIn: {
    email: document.querySelector("#signin-email"),
    password: document.querySelector("#signin-password"),
    error: document.querySelector("#signin-error"),
  },
  signUp: {
    fullName: document.querySelector("#signup-fullname"),
    email: document.querySelector("#signup-email"),
    password: document.querySelector("#signup-password"),
    error: document.querySelector("#signup-error"),
  },
};
// Input Validation
const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  password: (password) =>
    password.length >= 8 && /\d/.test(password) && /[!@#$%^&*]/.test(password),
};
// API calls
const API = {
  makeAuthRequest: async (url, body) => {
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Request failed");
      }
      return await res.json();
    } catch (error) {
      console.error("Auth request failed:", error);
      throw error;
    }
  },
};

// Form Validation
const validateSignIn = () => {
  const { email, password, error } = formElements.signIn;
  if (!validators.email(email.value.trim())) {
    error.textContent = "Invalid email format.";
    return false;
  }
  if (!validators.password(password.value)) {
    error.textContent =
      "Password must be at least 8 characters long and include a number and a special character.";
    return false;
  }
  return true;
};

const validateSignUp = () => {
  const { fullName, email, password, error } = formElements.signUp;
  if (!fullName.value.trim()) {
    error.textContent = "Full name is required.";
    return false;
  }
  if (!validators.email(email.value.trim())) {
    error.textContent = "Invalid email format.";
    return false;
  }
  if (!validators.password(password.value)) {
    error.textContent =
      "Password must be at least 8 characters long and include a number and a special character.";
    return false;
  }
  return true;
};

// Form Submit Handlers
const handleSignIn = async (e) => {
  e.preventDefault();
  const { email, password, error } = formElements.signIn;

  if (!validateSignIn()) return;

  try {
    error.textContent = "";
    const data = await API.makeAuthRequest(
      "https://autogradesystem.onrender.com/auth/login",
      {
        email: email.value.trim(),
        password: password.value,
      }
    );
    localStorage.setItem("user-info", JSON.stringify(data));
    window.location.href = "/home.html";
  } catch (err) {
    error.textContent = err.message || "Invalid email or password";
  }
};
const handleSignUp = async (e) => {
  e.preventDefault();
  const { fullName, email, password, error } = formElements.signUp;
  if (!validateSignUp()) return;
  try {
    error.textContent = "";
    const data = await API.makeAuthRequest(
      "https://autogradesystem.onrender.com/auth/register",
      {
        fullname: fullName.value.trim(),
        email: email.value.trim(),
        password: password.value,
      }
    );

    localStorage.setItem("user-info", JSON.stringify(data));
    window.location.href = "/home.html";
  } catch (err) {
    error.textContent = err.message || "Registration failed. Please try again.";
  }
};
signInForm.addEventListener("submit", handleSignIn);
signUpForm.addEventListener("submit", handleSignUp);
signInBtn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
signUpBtn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});
formElements.signIn.email.addEventListener("focus", () => {
  formElements.signIn.error.textContent = "";
});
formElements.signIn.password.addEventListener("focus", () => {
  formElements.signIn.error.textContent = "";
});
formElements.signUp.fullName.addEventListener("focus", () => {
  formElements.signUp.error.textContent = "";
});
formElements.signUp.email.addEventListener("focus", () => {
  formElements.signUp.error.textContent = "";
});
formElements.signUp.password.addEventListener("focus", () => {
  formElements.signUp.error.textContent = "";
});
