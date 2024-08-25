import { flexRender } from "@tanstack/react-table";
import { useLocation, useNavigate } from "react-router-dom";
import { IncidentType } from "../../types/IncidentType";

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
  const navigate = useNavigate();
  const location = useLocation();

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
            className="cursor-pointer hover:bg-[#F9F9F9]"
            onClick={() => {
              const queryParams = new URLSearchParams(location.search);
              navigate(
                `/incidents/${data[row.id].id}?${queryParams.toString()}`
              );
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
        ))}
      </tbody>
    </table>
  );
}
