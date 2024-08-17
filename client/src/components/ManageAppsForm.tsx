import { AnimatePresence, motion } from "framer-motion";
import crossIcon from "../assets/crossIcon.svg";
import chevronDown from "../assets/chevronDownIcon.svg";
import { useState } from "react";
import { Dropdown } from "./Dropdown";
import trashIcon from "../assets/trashIcon.svg";
import {
  envSettings,
  paltformSettings,
  recoverySettings,
  siteSettings,
} from "../types/AppSettings";

import { ConfirmationModal } from "./ConfirmationModal";
import { AppType } from "../types/AppType";
import { Backdrop } from "./Backdrop";
import { useEditApp } from "../hooks/Apps/useEditApp";
import { useDeleteApp } from "../hooks/Apps/useDeleteApp";
import { useNewApp } from "../hooks/Apps/useNewApp";

/**
 * A form component to Add / Edit / Delete an app.
 * @param handleClose - The function to handle form close event.
 * @param app - The app object to be managed.
 */
export function ManageAppsForm({
  handleClose,
  app,
}: {
  handleClose: (e: React.FormEvent) => void;
  app: AppType;
}) {
  const createApp = useNewApp();
  const editApp = useEditApp();
  const deleteApp = useDeleteApp();
  const [name, setName] = useState(app.name);
  const [description, setDescription] = useState(app.description);
  const [operationalImpact, setOperationalImpact] = useState(
    app.operational_impact
  );
  const [env, setEnv] = useState(app.env);
  const [mainSite, setMainSite] = useState<AppType["main_site"]>(app.main_site);
  const [recovery, setRecovery] = useState(app.recovery);
  const [openDropDown, setOpenDropDown] = useState<string | null>(null);
  const [platform, setPlatform] = useState(app.platform);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if app id is 0, create new app
    if (app.id === 0) {
      createApp({
        name,
        description: description === "" ? null : description,
        operational_impact: operationalImpact === "" ? null : operationalImpact,
        env,
        main_site: mainSite,
        recovery,
        platform,
      });
    } else if (app.id && app.id > 0) {
      // Create a changes object, which has all the fields that have been changed
      const changes = {
        ...(name !== app.name && { name }),
        ...(description !== app.description && {
          description: description === "" ? null : description,
        }),
        ...(operationalImpact !== app.operational_impact && {
          operational_impact:
            operationalImpact === "" ? null : operationalImpact,
        }),
        ...(env !== app.env && { env }),
        ...(mainSite !== app.main_site && { main_site: mainSite }),
        ...(recovery !== app.recovery && { recovery }),
        ...(platform !== app.platform && { platform }),
      };

      // Only call editApp if there are changes
      if (Object.keys(changes).length > 0) editApp({ changes, id: app.id });
    }

    // Close the form when finished
    handleClose(e);
  };

  // Handles form delete
  const handleDelete = (e: React.FormEvent) => {
    if (!app.id) return;
    deleteApp(app.id);
    handleClose(e);
  };
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-white-color border border-border w-[clamp(500px,25%,750px)] flex flex-col gap-4 items-end rounded-lg shadow-md text-tex relative"
        initial={{ opacity: 0, y: "25vh", x: "0%" }}
        animate={{
          opacity: 1,
          y: "0%",
          x: "0%",
          transition: {
            duration: 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20,
          },
        }}
        exit={{
          opacity: 0,
          y: "25vh",
          x: "0%",
        }}
      >
        <div className="flex justify-between flex-row-reverse w-full border-b border-border py-4 px-6">
          <h1 className="font-medium text-2xl">
            {app.id === 0 ? "הוסף מערכת" : "ערוך מערכת"}
          </h1>
          <button onClick={handleClose}>
            <img src={crossIcon} alt="" />
          </button>
        </div>

        {/* form */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 px-6 py-4 w-full items-end"
        >
          {/* App name input */}
          <div className="flex w-full flex-row-reverse items-end gap-3">
            <div className="form-text-div flex-1">
              <label className="font-medium text-sm mr-1" htmlFor="appName">
                * שם מערכת
              </label>
              <input
                dir="rtl"
                id="appName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הקלד שם מערכת"
                className="input-default w-full"
              />
            </div>
            {/* Environment dropdown */}
            <div className="flex flex-col items-end gap-1 w-[clamp(8rem,33%,16rem)]">
              <h4 className="font-medium text-sm mr-1">סביבה</h4>
              <div
                onClick={() =>
                  setOpenDropDown((prev) => (prev == "env" ? null : "env"))
                }
                className="flex gap-2 justify-start flex-row-reverse input-default cursor-pointer w-full relative"
              >
                <button type="button">
                  <img
                    src={chevronDown}
                    className={`${
                      openDropDown == "env" ? "rotate-180" : "rotate-0"
                    } transition-all`}
                    alt=""
                  />
                </button>
                <h1 className="h-6">
                  {envSettings.find((e) => e.value == env)?.name}
                </h1>
                {openDropDown == "env" && (
                  <Dropdown setValue={setEnv} data={envSettings} />
                )}
              </div>
            </div>
          </div>
          {/* Description textarea */}
          <div className="form-text-div">
            <label className="font-medium text-sm mr-1" htmlFor="appDesc">
              מהות מערכת
            </label>
            <textarea
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              dir="rtl"
              id="appDesc"
              rows={3}
              placeholder="הוסף מהות מערכת"
              className="input-default w-full resize-none"
            />
          </div>
          {/* Impact textarea */}
          <div className="form-text-div">
            <label className="font-medium text-sm mr-1" htmlFor="appImpact">
              משמעות מבצעית בהשבתה
            </label>
            <textarea
              value={operationalImpact || ""}
              onChange={(e) => setOperationalImpact(e.target.value)}
              dir="rtl"
              id="appImpact"
              rows={2}
              placeholder="הוסף משמעות מבצעית"
              className="input-default w-full resize-none"
            />
          </div>
          {/* Platform dropdown */}
          <LabelButton
            label="פלטפורמה"
            values={paltformSettings}
            type={platform}
            setType={setPlatform}
            openDropDown={openDropDown}
            setOpenDropDown={setOpenDropDown}
            dropDownValue="platform"
          />
          {/* Site dropdown */}
          <LabelButton
            label="אתר ראשי"
            values={siteSettings}
            type={mainSite}
            setType={setMainSite}
            openDropDown={openDropDown}
            setOpenDropDown={setOpenDropDown}
            dropDownValue="site"
          />
          {/* Recovery dropdown */}
          <LabelButton
            label="שרידות"
            values={recoverySettings}
            setType={setRecovery}
            openDropDown={openDropDown}
            setOpenDropDown={setOpenDropDown}
            dropDownValue="recovery"
            type={recovery}
          />

          {/* Submit and Cancel buttons */}
          <div className="w-full h-px bg-border"></div>
          <div className="flex justify-between w-full">
            <div className="flex self-start gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-white-color rounded-md"
              >
                שמור מערכת
              </button>
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-white-color text-secondary-text box-border border border-border rounded-md"
              >
                ביטול
              </button>
            </div>
            {app.id !== 0 && (
              <button
                onClick={() => setIsDeleting(true)}
                type="button"
                className="px-5 py-2 rounded-md flex gap-2 bg-red-50 text-secondary-red items-center"
              >
                מחיקה
                <img src={trashIcon} alt="" />
              </button>
            )}
          </div>
          <AnimatePresence mode="wait">
            {isDeleting && (
              <ConfirmationModal
                title="מחיקת מערכת"
                text="האם אתה בטוח שאתה רוצה למחוק את המערכת? פעולה זו היא בלתי הפיכה"
                handleSubmit={handleDelete}
                handleClose={() => setIsDeleting(false)}
              />
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </Backdrop>
  );
}

/**
 * Renders an input button component with a label and a dropdown menu.
 *
 * @param label - The label text for the button.
 * @param openDropDown - The value of the currently open dropdown.
 * @param setOpenDropDown - The function to update the state of the open dropdown.
 * @param dropDownValue - The value of the dropdown button.
 * @param type - The current selected value of the dropdown.
 * @param setType - The function to update the state of the selected dropdown value.
 * @param values - The array of dropdown values.
 */
function LabelButton({
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
    <div className="flex justify-between w-[clamp(250px,60%,400px)] flex-row-reverse items-center">
      {/* The label text */}
      <h1 className="font-medium text-sm">{label}</h1>
      {/* The dropdown button */}
      <h1
        onClick={() =>
          setOpenDropDown((prev) =>
            prev == dropDownValue ? null : dropDownValue
          )
        }
        className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-border rounded-md w-40 flex-row-reverse relative"
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
