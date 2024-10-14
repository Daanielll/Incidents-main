import { flexRender } from "@tanstack/react-table";
import { useState } from "react";
import IncidentDetails from "./IncidentDetails";
import { IncidentType } from "types/IncidentType";

/**
 * Renders a table with all the incidents.
 *
 * @param table - The table object, using the react-table library and the data provided.
 * @param data - The data object (the data that is being used in the table).
 */

export default function IncidentsTable({
  table,
  data,
}: {
  table: any;
  data: IncidentType[];
}) {
  const [openedIncident, setOpenedIncident] = useState<number[]>([]);

  return (
    <table className="w-full text-text">
      <thead className="bg-light border-y-2 border-border px-8 sticky top-0">
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
          <>
            <tr
              className={`${
                openedIncident.includes(data[row.id].id!)
                  ? "bg-light"
                  : "bg-white-color"
              } cursor-pointer hover:bg-light`}
              // onClick={() => setOpenedIncident(data[row.id].id || 0)}
              onClick={() => {
                const correntId = data[row.id].id;
                setOpenedIncident((prev) => {
                  if (correntId === undefined) return [...prev];
                  if (prev.includes(correntId)) {
                    return prev.filter((i) => i !== correntId);
                  } else {
                    return [...prev, correntId]; // Create a new array with the new id added
                  }
                });
              }}
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
            {openedIncident.includes(data[row.id].id!) && (
              <tr>
                <td
                  colSpan={row.getVisibleCells().length}
                  className="w-full h-64"
                >
                  <IncidentDetails id={data[row.id].id!} />
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  );
}
