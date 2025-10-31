export const capitalizeName = (name) => {
  return name.replace(/\b\w/g, char => char.toUpperCase());
};

export const isUsername = (username) => {
  if (!username) return "Username is required";
  if (username.length < 4) return "Minimum 4 characters required";
  if (username.length > 50) return "Maximum 50 characters allowed";
  if (!/^[a-zA-Z0-9]*$/.test(username)) return "Username must be alphanumeric";
  return "";
};


export const isEmail = (email) => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Enter a valid email address";
  if (email.length > 100) return "Email is too long";
  return "";
};

export const isPassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 5) return "Minimum 5 characters required";
  return "";
};

export const getFirebaseErrorMessage = (code) => {
  let message = "";

  switch (code) {
    case "auth/email-already-in-use":
      message = "Email already registered.";
      break;
    case "auth/invalid-email":
      message = "Invalid email address.";
      break;
    case "auth/weak-password":
      message = "Weak password. Use at least 6 characters.";
      break;
    case "auth/missing-email":
      message = "Enter your email.";
      break;
    case "auth/missing-password":
      message = "Enter your password.";
      break;
    case "auth/network-request-failed":
      message = "Network error. Check connection.";
      break;
    case "auth/configuration-not-found":
      message = "Auth setup missing in Firebase.";
      break;
    default:
      message = "Something went wrong. Try again.";
      break;
  }

  return message;
};


export const getLoginErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No user found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/missing-email":
      return "Email field cannot be empty.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "Login failed. Please try again later.";
  }
};

export const getForgotPasswordError = (code) => {
  switch (code) {
    case "auth/user-not-found":
      return "No user found with this email.";
    case "auth/invalid-email":
      return "Invalid email address.";
    default:
      return "Something went wrong. Try again.";
  }
};

