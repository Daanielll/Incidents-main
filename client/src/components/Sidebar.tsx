import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { NavLink } from "react-router-dom";
import { IncidentIcon } from "../assets/IncidentIcon";

/**
 * Sidebar component.
 * Renders a sidebar with the logo, a menu with one section for the analysts, and user information.
 */
export function Sidebar() {
  // State to control the sidebar's expand/collapse state
  const [isExpanded, setIsExpanded] = useState(false);
  // Get the user object from the auth context
  const { user } = useAuthContext();
  // Define the menu items for the analysts section
  const analysts = [
    {
      title: "יומן מבצעים",
      icon: <IncidentIcon />,
      link: "/incidents",
    },
    {
      title: "ניהול מערכות",
      icon: <IncidentIcon />,
      link: "/manage-apps",
    },
  ];

  // If the user is not logged in, display a loading message
  if (user === null) return <div>loading</div>;

  return (
    <>
      {/* The sidebar's expand/collapse button */}
      <div
        className={`${
          isExpanded ? "w-[clamp(18rem,12%,24rem)]" : "w-20"
        } duration-300`}
      ></div>
      <div
        className={`${
          isExpanded ? "w-[clamp(18rem,12%,24rem)]" : "w-20"
        }  flex flex-col p-5 text-right child:text-right items-end gap-10 fixed duration-300 ease-out border-l border-border box-border whitespace-nowrap bg-white-color h-full`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)} // Toggle the sidebar's expand/collapse state
          className="size-6 shadow-md bg-border rounded-full absolute left-0 top-5 translate-y-1/2 -translate-x-1/2 cursor-pointer flex items-center justify-center text-white-color text-sm"
        >
          {isExpanded ? ">" : "<"}
        </button>
        <div className="flex gap-4 items-center justify-end overflow-hidden w-full">
          {isExpanded && (
            <h1 className="font-medium text-3xl cursor-default text-text">
              דיווחי אירועים
            </h1>
          )}
          <div className="size-10 bg-secondary-green border border-secondary-yellow rounded-full min-w-10" />
        </div>
        <div className="flex flex-col gap-3 mr-[10px] flex-grow w-full overflow-x-hidden items-end">
          {/* ANALYSTS Items */}
          <div className="h-5 self-end">
            {isExpanded && (
              <h3 className="text-sm font-medium text-secondary-text">
                עובדים
              </h3>
            )}
          </div>
          {analysts.map((item) => (
            <NavLink
              to={item.link}
              key={item.title}
              className={({ isActive }) =>
                `${
                  isActive ? "text-text" : ""
                } flex gap-2 justify-end text-secondary-text items-cente hover:text-text cursor-pointer h-6`
              }
            >
              {isExpanded && <h2>{item.title}</h2>}
              {item.icon}
            </NavLink>
          ))}
        </div>
        {/* User Info */}
        <div
          className={`${
            isExpanded ? "bg-light border border-border -m-1 p-1" : ""
          } w-[calc(100%+0.5rem)] flex justify-start flex-row-reverse rounded-lg gap-4 py-2 items-center overflow-hidden`}
        >
          <div className="min-w-10 size-10 bg-secondary-yellow rounded-full flex child:text-white-color items-center justify-center">
            <span>{user.last_name.charAt(0).toUpperCase()}</span>
            <span>{user.first_name.charAt(0).toUpperCase()}</span>
          </div>
          {isExpanded && (
            <div>
              <h1 className="font-medium text-text">
                {user.first_name + " " + user.last_name}
              </h1>
              <h2 className="text-secondary-text">{user.id}</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
