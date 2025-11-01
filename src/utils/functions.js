export const capitalizeName = (name) => {
  return name.replace(/\b\w/g, char => char.toUpperCase());
};

export const formatDateTime = (date, label = "Select Date") => {
  if (!date) return label;

  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" }); 
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} ${month}, ${weekday} at ${time}`;
};

export const isValidDueDate = (date) => {
  console.log("date:", date)
  if (!date) return "Please select a due date and time";
  return "";
};

export const isValidUser = (user) => {
  if (!user) return "Please select a user to assign";
  return "";
};

export const isValidDescription = (desc) => {
  if (!desc) return "Task description is required";
  if (desc.trim().length < 5) return "Minimum 5 characters required";
  return "";
};

export const isValidTitle = (title) => {
  if (!title) return "Task title is required";
  if (title.trim().length < 3) return "Minimum 3 characters required";
  if (title.trim().length > 100) return "Maximum 100 characters allowed";
  if (!/^[a-zA-Z0-9\s.,'-]*$/.test(title))
    return "Title can only contain letters, numbers, spaces, and basic punctuation";
  return "";
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
  console.log(errorCode)
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
    case "auth/invalid-credential":
      return "Invalid email or password"
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

