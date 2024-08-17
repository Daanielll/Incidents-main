import { useState } from "react";
import userIcon from "../assets/userIcon.svg";
import lockIcon from "../assets/lockIcon.svg";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/Auth/useAuthContext";
/**
 * Login component.
 * Renders a login form and handles user login.
 */
export function Login() {
  // State hooks to manage user input
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  // Get user data and authentication state from context
  const { user, isLoading, login } = useAuthContext();

  // If authentication is still loading, display a loading message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user is already authenticated, redirect to home page
  if (user) {
    return <Navigate to="/" />;
  }

  // Handle form submission. Calls the login function from the context
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: Number(id), password });
  };

  return (
    <div className="flex bg-light items-center justify-center w-full h-screen">
      {/* Logo and branding */}
      <div className="absolute top-0 right-0 flex p-5 gap-4 items-center">
        <h1 className="font-medium text-3xl cursor-default">דיווחי אירועים</h1>
        <div className="size-10 rounded-full border border-secondary-yellow bg-secondary-green"></div>
      </div>

      {/* Login form */}
      <div className="font-bold flex flex-col items-center gap-6 bg-white-color py-12 px-4 rounded-lg min-w-[28rem] w-1/4 max-w-[36rem] aspect-square">
        <div className="size-12 bg-secondary-green rounded-full border border-secondary-yellow"></div>
        <h1 className="font-medium text-3xl">ברוכים הבאים</h1>
        <form className="w-3/4 flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* User ID input */}
          <div className="relative">
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="input-default-np px-3 pr-9 py-2"
              type="text"
              placeholder="מספר עובד"
            />
            <img
              className="absolute top-1/2 right-2 -translate-y-1/2"
              src={userIcon}
              alt="user icon"
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-default-np px-3 pr-9 py-2"
              type="password"
              placeholder="סיסמה"
            />
            <img
              className="absolute top-1/2 right-2 -translate-y-1/2"
              src={lockIcon}
              alt="lock icon"
            />
          </div>

          {/* Login button */}
          <button className="w-full bg-primary font-medium text-white-color px-3 py-2 rounded-md hover:bg-primary-hover">
            התחבר
          </button>
        </form>
      </div>
    </div>
  );
}
