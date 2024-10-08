import { createContext } from "react";
import { LoginCredentials, useUser } from "../hooks/Auth/useAuth";
import { UserType } from "../types/UserType";

// UserContextType
export interface UserContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<UserType>;
}

// CREATE USER CONTEXT
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
/**
 * UserContextProvider is a React component that provides the UserContext to its descendants.
 * It uses the useUser hook to get the user data and wraps it in the UserContext.
 *
 * @param children - The children components.
 * @return The UserContextProvider component.
 */
export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the user data using the useUser hook
  const user = useUser();

  const contextValue: UserContextType = {
    // The user data
    user: user.user,
    // Whether the user is authenticated
    isAuthenticated: user.isAuthenticated,
    // Whether the user data is being fetched
    isLoading: user.isLoading,
    // The login function that can be used to authenticate the user
    login: user.login.mutateAsync,
  };

  return (
    // Wrap the children components in the UserContext.Provider and provide the contextValue
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
