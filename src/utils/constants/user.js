/**
 * Checks if the given user is an admin.
 * @param {Object} user - Firebase authenticated user object.
 * @returns {boolean} true if user is admin, false otherwise.
 */
export const isAdmin = (user) => {
  if (!user || !user.email) return false;

  // You can add more admin emails in this array if needed
  const adminEmails = ["yugendran1407@gmail.com"];

  return adminEmails.includes(user.email.toLowerCase());
};
