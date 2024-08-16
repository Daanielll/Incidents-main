import { useContext } from "react";
import { UserContext, UserContextType } from "../context/userContext";

export const useAuthContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a UserContextProvider");
  }
  return context;
};
