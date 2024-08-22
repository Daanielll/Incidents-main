import { AnimatePresence } from "framer-motion";
import {
  envEnum,
  ImpactEnum,
  IncidentType,
  PlatformEnum,
  ReporterEnum,
  SiteEnum,
  StatusEnum,
} from "../../types/IncidentType";
import { ConfirmationModal } from "../ConfirmationModal";
import { motion } from "framer-motion";
import { Backdrop } from "../Backdrop";
import crossIcon from "../../assets/crossIcon.svg";
import trashIcon from "../../assets/trashIcon.svg";
import { useState } from "react";
import settings from "../../types/AppSettings";
import { AppType } from "../../types/AppType";
import {
  LabelApps,
  LabelButton,
  LabelInput,
  LabelText,
} from "./incidentForm/Sections";
import { useNewIncident } from "../../hooks/useNewIncident";
import { toast } from "sonner";
import { useAllApps } from "../../hooks/Apps/useAllApps";

type Props = {
  handleClose: (e: React.MouseEvent) => void;
  incident: IncidentType;
};

export default function ManageIncidentForm({ handleClose, incident }: Props) {
  const apps = useAllApps().data;
  const newIncident = useNewIncident();
  const [formData, setFormData] = useState(incident);
  const [selectedApps, setSelectedApps] = useState<number[]>([]);

  // if (typeof formData.start_date === "string" && formData.start_date !== "")
  //   setFormData((prev) => {
  //     return { ...prev, start_date: new Date(prev.start_date) };
  //   });
  // if (typeof formData.end_date === "string" && formData.end_date !== "")
  //   setFormData((prev) => {
  //     return { ...prev, end_date: formData.end_date ? new Date(prev.end_date) : null };
  //   });
  if (formData.start_date.length === 24)
    setFormData((prev) => {
      return { ...prev, start_date: prev.start_date.slice(0, 16) };
    });
  if (formData.end_date && formData.end_date.length === 24)
    setFormData((prev) => {
      return { ...prev, end_date: prev.end_date.slice(0, 16) };
    });

  if (selectedApps.length === 0)
    formData.IncidentApp.map((app) =>
      setSelectedApps((prev) => [...prev, app.app.id!])
    );

  const [selectedImpacted, setSelectedImpacted] = useState<number[]>([]);
  if (selectedImpacted.length === 0)
    formData.IncidentImpact.map((app) =>
      setSelectedImpacted((prev) => [...prev, app.app.id!])
    );
  const [openDropdown, setOpenDropDown] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    // console.log(incident["IncidentImpact"]);

    // for (const key of Object.keys(incident)) {
    //   console.log("key: " + incident[`${key}`]);
    // }
    // const changes = {for (const [key, value] of Object.entries(formData)) {
    //   (incident[key] !== value && {...key: value})
    // }}

    const changes = Object.entries(formData).reduce((all, [key, value]) => {
      if (incident[key] !== value) {
        if (key === "start_date" || key === "end_date") {
          console.log(incident[key].slice(0, 16) == value);
        }
        all[key] = value;
      }
      return all;
    }, {});
    // console.log(changes);
    e.preventDefault();
    return;
    const {
      IncidentApp,
      IncidentImpact,
      start_date,
      end_date,
      description,
      operational_impact,
      ...data
    } = formData;

    const inc = {
      ...data,
      ...{ start_date: new Date(start_date) },
      ...(end_date && { end_date: new Date(end_date) }),
      ...{ apps: selectedApps },
      ...{ impacted_apps: selectedImpacted },
      ...(description.trim() !== "" && { description: description }),
      ...(operational_impact.trim() !== "" && {
        operational_impact: operational_impact,
      }),
    };
    if (
      inc.apps[0] &&
      inc.title &&
      inc.description &&
      inc.start_date &&
      inc.platform &&
      inc.operational_impact &&
      inc.platform &&
      inc.reported_by &&
      inc.site &&
      inc.status &&
      inc.technical_impact &&
      inc.env
    ) {
      newIncident(inc);
      handleClose(e);
    } else
      toast.error("שדות חובה חסרים", {
        position: "top-center",
        richColors: true,
        className: "toast-rtl",
      });
  };

  if (!apps) return <h1 className="fixed left-1/2 top-1/2">Loading</h1>;

  return (
    <Backdrop onClick={() => {}}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-white-color border border-border w-[clamp(750px,50%,1000px)] flex flex-col gap-4 items-end rounded-lg shadow-md text-tex relative"
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
            {!incident.id ? "הוסף אירוע" : "ערוך אירוע"}
          </h1>
          <button onClick={handleClose}>
            <img src={crossIcon} alt="" />
          </button>
        </div>

        {/* form */}

        <form
          onSubmit={handleSubmit}
          onClick={() => setOpenDropDown(null)}
          className="flex flex-col gap-5 px-6 py-4 w-full"
        >
          <div className="flex flex-row-reverse gap-5 w-full items-start">
            {/* Right column */}
            <div className="flex flex-1 flex-col gap-3">
              <LabelInput
                label="שם אירוע *"
                placeholder="הקלד שם תקלה"
                value={formData.title}
                setValue={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <LabelText
                label="* תיאור תקלה"
                placeholder="הוסף תיאור תקלה"
                value={formData.description}
                setValue={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <LabelButton
                label="תשתית *"
                values={settings.paltformSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.platform}
                setType={(value: keyof typeof PlatformEnum) => {
                  setFormData({ ...formData, platform: value });
                }}
                dropDownValue="platform"
              />
              <LabelButton
                label="סביבה *"
                values={settings.envSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.env}
                setType={(value: keyof typeof envEnum) => {
                  setFormData({ ...formData, env: value });
                }}
                dropDownValue="env"
              />
              <LabelButton
                label="אתר *"
                values={settings.siteSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.site}
                setType={(value: keyof typeof SiteEnum) => {
                  setFormData({ ...formData, site: value });
                }}
                dropDownValue="site"
              />
              <LabelInput
                label="מספר טיקט בSNOW"
                placeholder="הוסף מספר טיקט"
                value={formData.snow_ticket || ""}
                setValue={(e) =>
                  setFormData({ ...formData, snow_ticket: e.target.value })
                }
              />
              <LabelInput
                label="מספר טיקט בJIRA"
                placeholder="הוסף מספר טיקט"
                value={formData.jira_ticket || ""}
                setValue={(e) =>
                  setFormData({ ...formData, jira_ticket: e.target.value })
                }
              />
              <div className="flex child:flex-1 justify-start child:flex child:flex-row-reverse child:items-center child:gap-3 h-[4.125rem] ">
                <div>
                  <h5>?עלה בניטור</h5>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        monitored: !formData.monitored,
                      })
                    }
                    type="button"
                    className={`${
                      formData.monitored ? "bg-secondary-text" : ""
                    } rounded-sm border border-secondary-text size-5 text-white-color flex justify-center items-center`}
                  >
                    v
                  </button>
                </div>
                <div>
                  <h5>?דווח לעמ"ר</h5>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        omer_sent: !formData.omer_sent,
                      })
                    }
                    type="button"
                    className={`${
                      formData.omer_sent ? "bg-secondary-text" : ""
                    } rounded-sm border border-secondary-text size-5 text-white-color flex justify-center items-center`}
                  >
                    v
                  </button>
                </div>
              </div>
            </div>
            {/* Left column */}
            <div className="flex w-[calc(50%-1.25rem)] flex-col gap-3">
              <LabelButton
                label="משמעות טכנית *"
                values={settings.impactSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.technical_impact}
                setType={(value: keyof typeof ImpactEnum) => {
                  setFormData({ ...formData, technical_impact: value });
                }}
                dropDownValue="impact"
              />
              <LabelText
                label="* משמעות מבצעית"
                placeholder="הוסף משמעות מבצעית"
                value={formData.operational_impact}
                setValue={(e) =>
                  setFormData({
                    ...formData,
                    operational_impact: e.target.value,
                  })
                }
              />
              <LabelButton
                label="מקור דיווח *"
                values={settings.reporterSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.reported_by}
                setType={(value: keyof typeof ReporterEnum) => {
                  setFormData({ ...formData, reported_by: value });
                }}
                dropDownValue="reporter"
              />
              <LabelApps
                label="מערכות *"
                apps={apps}
                value={apps.filter((app) => selectedApps.includes(app.id!))}
                setValue={(value) => {
                  !selectedApps.includes(value.id)
                    ? setSelectedApps([...selectedApps, value.id])
                    : setSelectedApps(
                        selectedApps.filter((app) => app !== value.id)
                      );
                }}
                visible={openDropdown}
                setVisible={setOpenDropDown}
                dropDownValue="apps"
              />
              <LabelApps
                label="מערכות מושפעות"
                apps={apps}
                value={apps.filter((app) => selectedImpacted.includes(app.id!))}
                setValue={(value) => {
                  !selectedImpacted.includes(value.id)
                    ? setSelectedImpacted([...selectedImpacted, value.id])
                    : setSelectedImpacted(
                        selectedImpacted.filter((app) => app !== value.id)
                      );
                }}
                visible={openDropdown}
                setVisible={setOpenDropDown}
                dropDownValue="impacted"
              />

              <LabelInput
                label="זמן תחילת אירוע *"
                type="datetime-local"
                value={formData.start_date}
                setValue={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
              <LabelInput
                label="זמן סיום אירוע"
                type="datetime-local"
                value={formData.end_date || ""}
                setValue={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />

              <LabelButton
                label="סטטוס *"
                values={settings.statusSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.status}
                setType={(value: keyof typeof StatusEnum) => {
                  setFormData({ ...formData, status: value });
                }}
                dropDownValue="status"
              />
            </div>
          </div>
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
            {incident.id && (
              <button
                type="button"
                className="px-5 py-2 rounded-md flex gap-2 bg-red-50 text-secondary-red items-center"
              >
                מחיקה
                <img src={trashIcon} alt="" />
              </button>
            )}
          </div>
          {/* <AnimatePresence mode="wait">
            {isDeleting && (
              <ConfirmationModal
                title="מחיקת מערכת"
                text="האם אתה בטוח שאתה רוצה למחוק את המערכת? פעולה זו היא בלתי הפיכה"
                // handleSubmit={handleDelete}
                // handleClose={() => setIsDeleting(false)}
              />
            )}
          </AnimatePresence> */}
        </form>
      </motion.div>
    </Backdrop>
  );
}
