import { AppType } from "../../../types/AppType";
import { Dropdown } from "../../Dropdown";
import chevronDown from "../../../assets/chevronDownIcon.svg";
import { useState } from "react";
import searchIcon from "../../../assets/searchIcon.svg";
export function LabelButton({
  label,
  setOpenDropDown,
  dropDownValue,
  openDropDown,
  type,
  setType,
  values,
}: {
  label: string;
  openDropDown: string | null;
  setOpenDropDown: React.Dispatch<React.SetStateAction<string | null>>;
  dropDownValue: string;
  type: string | null | undefined;
  setType: any;
  values: ({ value: null; name: string } | { value: string; name: string })[];
}) {
  return (
    // The container for the label button and dropdown menu
    <div className="flex flex-col items-end gap-1 flex-1">
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
        className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-border rounded-md w-full flex-row-reverse relative"
      >
        {/* The dropdown icon */}
        <img
          draggable={false}
          className={`${
            openDropDown == dropDownValue ? "rotate-180" : "rotate-0"
          } transition-all select-none`}
          src={chevronDown}
          alt=""
        />
        {/* The selected dropdown value */}
        {values.find((r) => r.value == type)?.name}
        {/* Render the dropdown menu if it is open */}
        {openDropDown == dropDownValue && (
          <Dropdown setValue={setType} data={values} />
        )}
      </h1>
    </div>
  );
}

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
                      <p
                        onClick={() => setValue(app)}
                        key={app.id}
                        className={`${
                          value.includes(app)
                            ? "border-secondary bg-light"
                            : "border-border"
                        } rounded-md  hover:bg-border p-2 text-right  cursor-pointer h-fit border box-border`}
                      >
                        {app.name}
                      </p>
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

export function LabelText({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: (e: any) => void;
}) {
  return (
    <div className="form-text-div flex-1">
      <label className="font-medium text-sm mr-1" htmlFor={label}>
        {label}
      </label>
      <textarea
        dir="rtl"
        id={label}
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        className="input-default w-full resize-none"
        rows={3}
      />
    </div>
  );
}
export function LabelInput({
  label,
  type = "text",
  placeholder = "",
  value,
  setValue,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string | null;
  setValue: (e: any) => void;
}) {
  return (
    <div className="form-text-div flex-1">
      <label dir="rtl" className="font-medium text-sm mr-1" htmlFor={label}>
        {label}
      </label>
      <input
        dir="rtl"
        id={label}
        type={type}
        value={value || ""}
        onChange={setValue}
        placeholder={placeholder}
        className="input-default w-full"
      />
    </div>
  );
}
