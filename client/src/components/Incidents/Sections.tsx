import { AppType } from "../../types/AppType";
import { Dropdown } from "../Dropdown";
import chevronDown from "../../assets/chevronDownIcon.svg";
import { useState } from "react";
import searchIcon from "../../assets/searchIcon.svg";

/**
 * A reusable dropdown component with a label, and a button which opens the dropdown menu.
 *
 * @param label - The label to display above the button.
 * @param openDropDown - The value of the currently open dropdown.
 * @param setOpenDropDown - The function to update the state of the opened dropdown.
 * @param dropDownValue - The value of the dropdown button at which the dropdown should open.
 * @param type - The current selected value of the dropdown.
 * @param setType - The function to update the state of the selected dropdown value.
 * @param values - The array of dropdown values.
 */
export function LabelButton({
  label,
  setOpenDropDown,
  dropDownValue,
  openDropDown,
  type,
  setType,
  values,
  isApp = false,
}: {
  label: string;
  openDropDown: string | null;
  setOpenDropDown: React.Dispatch<React.SetStateAction<string | null>>;
  dropDownValue: string;
  type: string | null | undefined;
  setType: any;
  values: ({ value: null; name: string } | { value: string; name: string })[];
  isApp?: boolean;
}) {
  return (
    // The container for the label button and dropdown menu
    <div
      className={`flex ${
        isApp
          ? "justify-between w-[clamp(250px,60%,400px)] flex-row-reverse items-center"
          : "flex-col items-end gap-1 flex-1"
      } `}
    >
      {/* The label text */}
      <h4 dir="rtl" className="font-medium text-sm mr-1">
        {label}
      </h4>
      {/* The dropdown button */}
      <h1
        onClick={(e) => {
          e.stopPropagation();
          setOpenDropDown((prev) =>
            prev == dropDownValue ? null : dropDownValue
          );
        }}
        className={`flex items-center gap-2 cursor-pointer px-3 py-2 border border-border rounded-md flex-row-reverse relative ${
          isApp ? "w-40" : "w-full"
        }`}
      >
        {/* The dropdown icon */}
        <button type="button">
          <img
            draggable={false}
            className={`${
              openDropDown == dropDownValue ? "rotate-180" : "rotate-0"
            } transition-all`}
            src={chevronDown}
            alt=""
          />
        </button>

        {/* The selected dropdown value */}
        {values.find((r) => r.value == type)?.name}
        {/* Render the dropdown menu if it is open */}
        {openDropDown == dropDownValue && (
          <Dropdown
            setValue={setType}
            data={values}
            handleClose={() => {
              setOpenDropDown(null);
            }}
          />
        )}
      </h1>
    </div>
  );
}

/**
 * A reusable chips component for selecting applications.
 *
 * @param label - The label to display above the dropdown.
 * @param apps - The list of applications to display in the dropdown.
 * @param value - The currently selected applications.
 * @param setValue - The function to update the selected applications.
 * @param visible - The current visibility state of the dropdown.
 * @param setVisible - The function to set the visibility of the dropdown.
 * @param dropDownValue - The value of the dropdown button at which the dropdown should open.
 */
export function LabelApps({
  label,
  apps,
  value,
  setValue,
  visible,
  setVisible,
  dropDownValue,
}: {
  label: string;
  apps: AppType[];
  value: AppType[];
  setValue: (e: any) => void;
  visible: string | null;
  setVisible: (e: any) => void;
  dropDownValue: string;
}) {
  const [search, setSearch] = useState("");
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col items-end gap-1 w-full relative"
    >
      <h4 dir="rtl" className="font-medium text-sm mr-1">
        {label}
      </h4>
      <div className="w-full h-6 mb-4 border-y border-white-color border-opacity-0">
        <div
          dir="rtl"
          className={`${
            visible === dropDownValue ? "absolute z-[100] right-0" : ""
          } flex gap-2 flex-col bg-white-color w-full`}
        >
          <button
            onClick={() =>
              setVisible((prev: string) =>
                prev == dropDownValue ? null : dropDownValue
              )
            }
            type="button"
            className={`${
              visible === dropDownValue ? "flex-wrap" : " overflow-hidden"
            } py-2 px-3 bg-white-color border border-border rounded-md text-text box-content min-h-6 flex gap-2 relative items-center`}
          >
            <img
              src={chevronDown}
              className={`${
                visible === dropDownValue ? "rotate-180" : "rotate-0"
              } transition-all select-none`}
            />
            {value.map((app) => {
              return (
                <p
                  key={app.id}
                  className="px-1 rounded-md bg-light whitespace-nowrap"
                >
                  {app.name}
                </p>
              );
            })}
          </button>
          {visible === dropDownValue && (
            <div className="flex flex-col gap-2 w-full py-2 px-3 bg-white-color border-border rounded-md border shadow-sm max-h-64 overflow-auto">
              <div className="relative w-full">
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

              <div dir="rtl" className="w-full h-fit flex flex-wrap gap-2">
                {apps
                  .filter((app) => app.name.includes(search))
                  .map((app) => {
                    return (
                      <button
                        type="button"
                        onClick={() => setValue(app)}
                        key={app.id}
                        className={`${
                          value.includes(app)
                            ? "border-secondary bg-light"
                            : "border-border"
                        } rounded-md  hover:bg-border p-2 text-right  cursor-pointer h-fit border box-border`}
                      >
                        {app.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * A reusable form section component with a label and input.
 *
 * @param label - The text to display as the label.
 * @param type - The type of input to render (e.g. "text", "textarea").
 * @param placeholder - The placeholder text to display in the input.
 * @param value - The value of the input.
 * @param setValue - The function to update the input value.
 */
export function LabelInput({
  label,
  type = "text",
  placeholder = "",
  value,
  setValue,
  isDisabled = false,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string | null | Date;
  setValue: (e: any) => void;
  isDisabled?: boolean;
}) {
  const inputValue =
    value instanceof Date
      ? value
          .toLocaleString("sv-SE", {
            timeZone: "Asia/Jerusalem",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(" ", "T")
      : value || "";

  return (
    <div className="form-text-div flex-1">
      <label dir="rtl" className="font-medium text-sm mr-1" htmlFor={label}>
        {label}
      </label>
      {type !== "textarea" ? (
        <input
          disabled={isDisabled}
          dir="rtl"
          id={label}
          type={type}
          value={inputValue}
          onChange={setValue}
          placeholder={placeholder}
          className="input-default w-full"
        />
      ) : (
        <textarea
          dir="rtl"
          id={label}
          value={typeof value === "string" ? value : ""}
          onChange={setValue}
          placeholder={placeholder}
          className="input-default w-full resize-none"
          rows={3}
        />
      )}
    </div>
  );
}

export function ToggleInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: boolean;
  setValue: (e: any) => void;
}) {
  return (
    <div className="form-text-div flex-1">
      <label dir="rtl" className="font-medium text-sm mr-1" htmlFor={label}>
        {label}
      </label>
      <div
        onClick={() => setValue(!value)}
        className="p-1 rounded-md bg-border flex child:px-4 child:py-1 child:rounded-md child:cursor-pointer child:flex-1 w-full text-center"
      >
        <h1 className={value ? "bg-white text-text" : "text-secondary-text"}>
          כן
        </h1>
        <h1 className={!value ? "bg-white text-text" : "text-secondary-text"}>
          לא
        </h1>
      </div>
    </div>
  );
}
