import { useEffect, useState } from "react";
import IncidentsTable from "../components/Incidents/IncidentsTable";
import { useIncidentData } from "../hooks/useIncidentData";
import { Outlet, useSearchParams } from "react-router-dom";
import ManageIncidentForm from "../components/Incidents/ManageIncidentForm";
import { AnimatePresence } from "framer-motion";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useDebounce } from "../hooks/useDebounce";
import searchIcon from "../assets/searchIcon.svg";
import { ImpactEnum, StatusEnum } from "../types/Enums";

/**
 * Fetches incidents data, which is then passed to the IncidentTable component to render the table.
 */

export default function Incidents() {
  // Get search params and add the page and limit to a pagination state
  const [searchParams, setSearchParms] = useSearchParams();
  const [pagination, setPagination] = useState({
    pageSize: Number(searchParams.get("limit")) || 10,
    pageIndex: Number(searchParams.get("page")) || 0,
  });
  // Get search query from the search params and create a debounced var for it
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search);
  // Change the URL when pagination state change
  useEffect(() => {
    setSearchParms({
      ...(pagination.pageSize !== 10 && {
        limit: pagination.pageSize.toString(),
      }),
      ...(pagination.pageIndex !== 0 && {
        page: pagination.pageIndex.toString(),
      }),
      ...(search !== "" && {
        search: search,
      }),
    });
  }, [pagination]);
  // Change the URL when debounced search change
  useEffect(() => {
    setPagination({
      ...pagination,
      pageIndex: 0,
    });
    setSearchParms({
      ...searchParams,
      ...(search !== "" && {
        search,
      }),
    });
  }, [debouncedSearch]);

  // Get incident data
  const incidents = useIncidentData();
  // State to control if new incident form is shown
  const [showForm, setShowForm] = useState(false);
  // Object to control status colors for the status column
  const statusColor = {
    green: "bg-secondary-green text-secondary-green",
    yellow: "bg-secondary-yellow text-secondary-yellow",
    red: "bg-secondary-red text-secondary-red",
  };
  // Manage the table's columns
  const columns = [
    {
      accessorKey: "status",
      header: "סטטוס",
      cell: (props: any) => {
        return (
          <div>
            <h1
              className={`${
                props.getValue() === "ONGOING"
                  ? statusColor.red
                  : props.getValue() === "RESOLVED"
                  ? statusColor.green
                  : statusColor.yellow
              } bg-opacity-15 rounded-md px-2 py-1 h-fit w-fit mx-auto brightness-95`}
            >
              {StatusEnum[props.getValue() as keyof typeof StatusEnum]}
            </h1>
          </div>
        );
      },
    },

    {
      accessorKey: "start_date",
      header: "תחילת אירוע",
      cell: (props: any) => {
        return (
          <h1 dir="rtl">
            {props.getValue().toLocaleDateString("he-IL", {
              day: "numeric",
              month: "short",
              ...(props.getValue().getFullYear() !== 2024
                ? { year: "2-digit" }
                : {}),
            })}
          </h1>
        );
      },
    },

    {
      accessorKey: "IncidentApp",
      cell: (props: any) => (
        <div className="flex gap-2 w-full justify-center flex-row-reverse">
          {props.getValue().map((app: any, index: number) => {
            if (index > 2) return;
            if (index === 2)
              return (
                <p key="ellipsis" className="px-2 py-1 bg-light rounded-md">
                  ...
                </p>
              );
            return (
              <h1 className="px-2 py-1 bg-light rounded-md" key={app.app.name}>
                {app.app.name}
              </h1>
            );
          })}
        </div>
      ),
      header: "מערכות",
    },
    {
      accessorKey: "operational_impact",
      header: "משמעות מבצעית",
    },
    {
      accessorKey: "technical_impact",
      header: "משמעות טכנית",
      cell: (props: any) => {
        return ImpactEnum[props.getValue() as keyof typeof ImpactEnum];
      },
    },
    {
      accessorKey: "title",
      header: "שם אירוע",
    },
  ];
  // Create a table instance
  const table = useReactTable({
    columns,
    data: incidents.data?.incidents || [],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: incidents.data?.count,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });
  // if (apps.isLoading || incidents.isLoading) return <h1>Loading</h1>;
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
            <div className="relative w-80">
              <input
                dir="rtl"
                className="input-default-np py-2 pl-3 pr-8"
                placeholder="סנן לפי שם"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <img
                draggable="false"
                className="absolute top-1/2 -translate-y-1/2 right-2 select-none"
                src={searchIcon}
                alt=""
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex-1">
              {incidents.data && (
                <IncidentsTable
                  table={table}
                  data={incidents.data.incidents || []}
                />
              )}
            </div>

            <div className="flex w-full justify-between flex-row-reverse px-5 mt-8">
              <div dir="rtl" className="flex gap-2 items-end">
                <h5>מציג</h5>
                <select
                  className="bg-light p-1"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    setPagination({ ...pagination, pageIndex: 0 });
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
                <h5>אירועים בעמוד</h5>
              </div>
              <div className="child:size-6 child:rounded-sm text-sm child:bg-light flex gap-2 child:flex child:items-center child:justify-center ">
                <button
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                >
                  {"<"}
                </button>
                {table.getCanPreviousPage() && (
                  <button onClick={() => table.firstPage()}>1</button>
                )}
                {!table.getCanNextPage() && <button disabled>...</button>}

                <button className="border border-secondary-text box-border">
                  {table.getState().pagination.pageIndex + 1}
                </button>
                {table.getCanNextPage() && (
                  <>
                    <button disabled>...</button>
                    <button onClick={() => table.lastPage()}>
                      {table.getPageCount()}
                    </button>
                  </>
                )}

                <button
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                >
                  {">"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {showForm && (
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
              start_date: new Date(),
            }}
          />
        )}
      </AnimatePresence>

      <Outlet />
    </>
  );
}
