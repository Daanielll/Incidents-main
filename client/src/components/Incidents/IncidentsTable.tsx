import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { ImpactEnum, IncidentType, StatusEnum } from "../../types/IncidentType";

/**
 * Renders a table with all the incidents.
 *
 * @param data - The data object (the data that is being used in the table).
 */

export default function IncidentsTable({
  data,
  rowCount,
  pagination,
}: {
  data: IncidentType[];
  rowCount: number;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
}) {
  const statusColor = {
    green: "bg-secondary-green text-secondary-green",
    yellow: "bg-secondary-yellow text-secondary-yellow",
    red: "bg-secondary-red text-secondary-red",
  };
  const navigate = useNavigate();
  // Months mapping, to display it in hebrew
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
              } bg-opacity-15 rounded-md px-2 py-1 h-fit w-fit mx-auto`}
            >
              {StatusEnum[props.getValue() as keyof typeof StatusEnum]}
            </h1>
          </div>
        );
      },
    },
    {
      accessorKey: "end_date",
      header: "זיכוי אירוע",
      cell: (props: any) => {
        if (!props.getValue())
          return <p className="text-secondary-text">בתהליך</p>;
        const date = new Date(props.getValue());
        return (
          <h1 dir="rtl">
            {date.toLocaleDateString("he-IL", {
              day: "numeric",
              month: "short",
              ...(date.getFullYear() !== 2024 ? { year: "2-digit" } : {}),
            })}
          </h1>
        );
      },
    },
    {
      accessorKey: "start_date",
      header: "תחילת אירוע",
      cell: (props: any) => {
        const date = new Date(props.getValue());
        return (
          <h1 dir="rtl">
            {date.toLocaleDateString("he-IL", {
              day: "numeric",
              month: "short",
              ...(date.getFullYear() !== 2024 ? { year: "2-digit" } : {}),
            })}
          </h1>
        );
      },
    },

    {
      accessorKey: "IncidentImpact",
      cell: (props: any) => {
        if (props.getValue().length < 1) return <p>אין</p>;
        return (
          <div className="flex gap-2 w-full justify-center">
            {props.getValue().map((app: any) => (
              <h1 className="px-2 py-1 bg-light rounded-md" key={app.app.name}>
                {app.app.name}
              </h1>
            ))}
          </div>
        );
      },
      header: "מערכות מושפעות",
    },
    {
      accessorKey: "IncidentApp",
      cell: (props: any) => (
        <div className="flex gap-2 w-full justify-center">
          {props.getValue().map((app: any) => (
            <h1 className="px-2 py-1 bg-light rounded-md" key={app.app.name}>
              {app.app.name}
            </h1>
          ))}
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

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount,
    state: {
      pagination,
    },
    autoResetPageIndex: true,
  });
  return (
    <table className="w-full text-text">
      <thead className="bg-light border-y-2 border-border px-8">
        <tr>
          {table.getAllColumns().map((columns: any) => (
            <th className="text-center p-3 font-medium" key={columns.id}>
              {columns.columnDef.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.getCoreRowModel().rows.map((row: any) => (
          <tr
            onClick={() => navigate(`/incidents/${data[row.id].id}`)}
            key={row.id}
          >
            {row.getVisibleCells().map((cell: any) => (
              <td
                key={cell.id}
                className={"text-center px-3 py-4 border-b border-border"}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <button onClick={() => table.nextPage()}>Next</button>
      </tfoot>
    </table>
  );
}
