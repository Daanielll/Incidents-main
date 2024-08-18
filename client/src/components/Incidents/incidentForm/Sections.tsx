import { AppType } from "../../../types/AppType";
import { Dropdown } from "../../Dropdown";
import chevronDown from "../../../assets/chevronDownIcon.svg";
import { useState } from "react";
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
      <h4 className="font-medium text-sm mr-1">{label}</h4>
      {/* The dropdown button */}
      <h1
        onClick={() =>
          setOpenDropDown((prev) =>
            prev == dropDownValue ? null : dropDownValue
          )
        }
        className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-border rounded-md w-full flex-row-reverse relative"
      >
        <button type="button">
          {/* The dropdown icon */}
          <img
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
}: {
  label: string;
  apps: AppType[];
  value: AppType[];
  setValue: (e: any) => void;
  visible: boolean;
  setVisible: (e: any) => void;
}) {
  const [search, setSearch] = useState("");
  return (
    <div className="flex flex-col items-end gap-1 flex-1">
      <h4 className="font-medium text-sm mr-1">{label}</h4>
      <div dir="rtl" className="w-full relative">
        <div
          className="w-full gap-2 input-default cursor-pointer pl-2 flex text-ellipsis overflow-hidden"
          onClick={() => setVisible(!visible)}
        >
          <button type="button">
            <img
              className={`${
                visible ? "rotate-180" : "rotate-0"
              } transition-all`}
              src={chevronDown}
              alt=""
            />
          </button>
          <div className="h-6 flex gap-2 w-0 flex-1">
            <div className="flex gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {value.map((v, index) => (
                <p key={index} className="px-1 bg-light rounded-md">
                  {v.name}
                </p>
              ))}
            </div>
          </div>
        </div>
        {visible && (
          <div className="absolute top-12 left-0 flex flex-col gap-2 w-full p-2 items-end bg-white border border-border rounded-md overflow-hidden z-50 shadow-sm">
            <div className="w-full">
              <input
                dir="rtl"
                className="p-2 border border-border rounded-md w-full outline-none"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full flex gap-1 justify-start max-h-64 overflow-auto flex-wrap">
              {apps
                .filter((app) => app.name.includes(search))
                .map((app) => (
                  <button
                    onClick={() => setValue(app)}
                    type="button"
                    className={`${
                      value.includes(app)
                        ? "border-secondary-text"
                        : "border-border"
                    } rounded-md bg-light hover:bg-border p-2 text-right hover:brightness-90 cursor-pointer h-fit border box-border`}
                  >
                    {app.name}
                  </button>
                ))}
            </div>
          </div>
        )}
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
