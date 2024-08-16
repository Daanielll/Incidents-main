import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

type PrivateRouteProps = {
  children: React.ReactElement;
};
/**
 * PrivateRoute is a component that checks if the user is authenticated and allows
 * access to the protected route if they are. If the user is not authenticated,
 * they are redirected to the login page.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactElement} props.children - The children components.
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Get the authentication state from the AuthContext
  const { isLoading, isAuthenticated } = useAuthContext();

  // If the authentication state is still loading, display a loading message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the children components
  return children;
};
