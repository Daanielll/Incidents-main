/**
 * Dropdown component that renders a list of options for a user to select from.
 *
 * @param data - The array of options to display in the dropdown
 * @param setValue - The function to update the selected value
 */
export function Dropdown({
  data,
  setValue,
}: {
  data: { name: string; value: string | null }[];
  setValue: (e: any) => void;
}) {
  return (
    // The dropdown container
    <div className="absolute top-12 left-0 flex flex-col w-full py-1 items-end bg-white border border-border rounded-md overflow-hidden z-50 shadow-sm">
      {/* Map over the data array to render each option */}
      {data.map((item) => (
        <button
          // Event handler for when the option is clicked
          onClick={(e) => {
            e.stopPropagation();
            setValue(item.value);
          }}
          key={item.value}
          className=" w-full px-3 py-2 text-right hover:bg-light cursor-pointer"
          type="button"
        >
          {/* The name of the option */}
          {item.name}
        </button>
      ))}
    </div>
  );
}
