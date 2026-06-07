/** Strip sensitive fields before sending user data to the client */
export const formatUser = (user) => {
  if (!user) return null;
  const doc = user.toObject ? user.toObject() : { ...user };
  delete doc.password;
  return doc;
};
