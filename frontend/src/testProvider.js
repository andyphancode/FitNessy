import React from "react";
import UserContext from "./context/UserContext";

const testUser = {
    username: "test",
    email: "test@test.com"
  };

const UserProvider =
  ({ children, currentUser = testUser }) => (
  <UserContext.Provider value={{ currentUser }}>
    {children}
  </UserContext.Provider>
);

export { UserProvider };  