import { useState } from "react";
import IncidentsTable from "../components/Incidents/IncidentsTable";
import { useIncidentData } from "../hooks/useIncidentData";
import { Outlet, useSearchParams } from "react-router-dom";
import ManageIncidentForm from "../components/Incidents/ManageIncidentForm";
import { AnimatePresence } from "framer-motion";
import { useAllApps } from "../hooks/Apps/useAllApps";

/**
 * Incidents component.
 * Fetching incidents data, which is then passed to the IncidentTable component to render the table.
 */

export default function Incidents() {
  const [searchParams, setSearchParms] = useSearchParams();
  const pagination = {
    pageSize: Number(searchParams.get("size")) || 10,
    pageIndex: Number(searchParams.get("page")) || 1,
  };
  const incidents = useIncidentData(pagination.pageSize, pagination.pageIndex);
  const [showForm, setShowForm] = useState(false);
  const apps = useAllApps();
  if (apps.isLoading || incidents.isLoading) return <h1>Loading</h1>;
  return (
    <>
      <div className="flex flex-col gap-3 w-full min-h-full items-end text-text">
        <h1 className="font-medium text-3xl mb-6">יומן מבצעים</h1>
        <div className="w-full text-text bg-white-color flex flex-col gap-3 py-3 border border-border shadow-md rounded-md h-full">
          <div className="flex gap-3 flex-row-reverse px-3">
            <button
              onClick={() => setShowForm(true)}
              className="text-white-color font-medium bg-primary rounded-md px-6 py-2 hover:bg-primary-hover"
            >
              חדש +
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {incidents.data && (
              <IncidentsTable
                data={incidents.data.incidents}
                rowCount={incidents.data.count}
                pagination={pagination}
              />
            )}
          </div>
        </div>
      </div>
      {showForm && (
        <AnimatePresence mode="wait">
          <ManageIncidentForm
            handleClose={(e) => {
              e.preventDefault();
              setShowForm(false);
            }}
            incident={{
              description: "",
              title: "",
              operational_impact: "",
              env: null,
              site: null,
              platform: null,
              IncidentImpact: [],
              IncidentApp: [],
              status: null,
              reported_by: null,
              omer_sent: false,
              monitored: false,
              technical_impact: null,
              start_date: "",
            }}
            apps={apps.data!}
          />
        </AnimatePresence>
      )}
      <Outlet />
    </>
  );
}
