import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ManageAppsForm } from "../components/ManageAppsForm";
import { useAllApps } from "../hooks/Apps/useAllApps";

/**
 * ManageApps component for managing apps.
 * It renders a list of apps and a form for creating / editing / deleting apps.
 */
export function ManageApps() {
  // Fetch all apps data from the server
  const allApps = useAllApps();

  // State to keep track of the form open status and the index of the app being edited
  const [formOpen, setFormOpen] = useState<number>(-2);

  // State to filter apps
  const [filterApps, setFilterApps] = useState("");

  // If the data is still loading or if there is no data, show a loading message
  if (allApps.isLoading || !allApps.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col text-text gap-3 items-end h-full">
      {/* Animate the form opening and closing */}
      <AnimatePresence mode="wait" initial={false}>
        {formOpen !== -2 && (
          <ManageAppsForm
            // If the form is for creating a new app, initialize the app object with default values
            app={formOpen === -1 ? { id: 0, name: "" } : allApps.data[formOpen]}
            // Callback function to close the form
            handleClose={(e) => {
              e.preventDefault();
              setFormOpen(-2);
            }}
          />
        )}
      </AnimatePresence>

      <h1 className="font-medium text-3xl mb-6">ניהול מערכות</h1>
      <div className="flex flex-row-reverse child:py-2 gap-3">
        <button
          onClick={() => setFormOpen(-1)}
          className="text-white-color font-medium bg-primary rounded-lg px-6 hover:bg-primary-hover"
        >
          חדש +
        </button>
        <input
          dir="rtl"
          type="text"
          placeholder="חיפוש"
          className="border border-border rounded-lg px-4 w-80 placeholder:text-secondary-text outline-none"
          value={filterApps}
          onChange={(e) => setFilterApps(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {/* Render a button for each app */}
        {allApps.data
          .filter((app) => app.name.includes(filterApps))
          .map((app, index) => (
            <button
              onClick={() => setFormOpen(index)}
              className="bg-white-color text-text border border-border rounded-lg font-medium px-4 py-2"
              key={app.id}
            >
              {app.name}
            </button>
          ))}
      </div>
    </div>
  );
}
