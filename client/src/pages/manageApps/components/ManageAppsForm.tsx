import { AnimatePresence, motion } from "framer-motion";
import crossIcon from "assets/crossIcon.svg";
import { useState } from "react";
import trashIcon from "assets/trashIcon.svg";
import settings from "types/AppSettings.ts";
import { ConfirmationModal } from "components/ConfirmationModal.tsx";
import { AppType } from "types/AppType.ts";
import { Backdrop } from "components/Backdrop.tsx";
import { toast } from "sonner";
import { EnvEnum, PlatformEnum, RecoveryEnum, SiteEnum } from "types/Enums.ts";
import { useDeleteApp, useEditApp, useNewApp } from "hooks/queries/appsApi.ts";
import { LabelButton } from "pages/Incidents/components/Sections";

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
  // use CRUD hooks
  const createApp = useNewApp();
  const editApp = useEditApp();
  const deleteApp = useDeleteApp();

  const [formData, setFormData] = useState(app);

  const [openDropDown, setOpenDropDown] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { description, operational_impact, ...filteredApp } = formData;
    const finalApp = {
      ...filteredApp,
      ...(description &&
        description.trim() !== "" && { description: description }),
      ...(operational_impact &&
        operational_impact.trim() !== "" && {
          operational_impact: operational_impact,
        }),
    };
    if (finalApp.name.trim() !== "") {
      // if app id is 0, create new app
      if (app.id === 0) {
        createApp(finalApp);
      } else if (app.id && app.id > 0) {
        // Create a changes object, which has all the fields that have been changed
        const changes = {
          ...(finalApp.name !== app.name && { name: finalApp.name }),
          ...(description !== app.description && {
            description,
          }),
          ...(operational_impact !== app.operational_impact && {
            operational_impact,
          }),
          ...(finalApp.env !== app.env && { env: finalApp.env }),
          ...(finalApp.main_site !== app.main_site && {
            main_site: finalApp.main_site,
          }),
          ...(finalApp.recovery !== app.recovery && {
            recovery: finalApp.recovery,
          }),
          ...(finalApp.platform !== app.platform && {
            platform: finalApp.platform,
          }),
        };

        // Only call editApp if there are changes
        if (Object.keys(changes).length > 0) editApp({ changes, id: app.id });
      } // Close the form when finished
      handleClose(e);
    } else
      toast.error("שדות חובה חסרים", {
        position: "top-center",
        richColors: true,
        className: "toast-rtl",
      });
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
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="הקלד שם מערכת"
                className="input-default w-full"
              />
            </div>
            {/* Environment dropdown */}
            <LabelButton
              dropDownValue="env"
              values={settings.envSettings}
              label="סביבה"
              openDropDown={openDropDown}
              setOpenDropDown={setOpenDropDown}
              setType={(value: keyof typeof EnvEnum | null | undefined) =>
                setFormData({ ...formData, env: value })
              }
              type={formData.env}
            />
          </div>
          {/* Description textarea */}
          <div className="form-text-div">
            <label className="font-medium text-sm mr-1" htmlFor="appDesc">
              מהות מערכת
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
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
              value={formData.operational_impact || ""}
              onChange={(e) =>
                setFormData({ ...formData, operational_impact: e.target.value })
              }
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
            values={settings.platformSettings}
            type={formData.platform}
            setType={(value: keyof typeof PlatformEnum) =>
              setFormData({ ...formData, platform: value })
            }
            openDropDown={openDropDown}
            setOpenDropDown={setOpenDropDown}
            dropDownValue="platform"
            isApp
          />
          {/* Site dropdown */}
          <LabelButton
            label="אתר ראשי"
            values={settings.siteSettings}
            type={formData.main_site}
            setType={(value: keyof typeof SiteEnum) =>
              setFormData({ ...formData, main_site: value })
            }
            openDropDown={openDropDown}
            setOpenDropDown={setOpenDropDown}
            dropDownValue="site"
            isApp
          />
          {/* Recovery dropdown */}
          <LabelButton
            label="שרידות"
            values={settings.recoverySettings}
            type={formData.recovery}
            setType={(value: keyof typeof RecoveryEnum) =>
              setFormData({ ...formData, recovery: value })
            }
            openDropDown={openDropDown}
            setOpenDropDown={setOpenDropDown}
            dropDownValue="recovery"
            isApp
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
