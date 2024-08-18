import { AnimatePresence } from "framer-motion";
import {
  envEnum,
  ImpactEnum,
  IncidentType,
  PlatformEnum,
  ReporterEnum,
  SiteEnum,
} from "../../types/IncidentType";
import { ConfirmationModal } from "../ConfirmationModal";
import { motion } from "framer-motion";
import { Backdrop } from "../Backdrop";
import crossIcon from "../../assets/crossIcon.svg";
import trashIcon from "../../assets/trashIcon.svg";
import { useState } from "react";
import {
  envSettings,
  impactSettings,
  paltformSettings,
  reporterSettings,
  siteSettings,
} from "../../types/AppSettings";
import { AppType } from "../../types/AppType";
import {
  LabelApps,
  LabelButton,
  LabelInput,
  LabelText,
} from "./incidentForm/Sections";

type Props = {
  handleClose: (e: React.MouseEvent) => void;
  incident?: IncidentType;
  apps: AppType[];
};

export default function ManageIncidentForm({
  handleClose,
  incident,
  apps,
}: Props) {
  const [formData, setFormData] = useState({
    title: incident?.title || "",
    description: incident?.description || "",
    technicalImpact: incident?.technical_impact || null,
    operationalImpact: incident?.operational_impact || "",
    apps: incident?.IncidentApp || [],
    impactedApps: incident?.IncidentImpact || [],
    monitored: incident?.monitored || false,
    startDate: incident?.start_date || null,
    endDate: incident?.end_date || null,
    platform: incident?.platform || null,
    env: incident?.env || null,
    site: incident?.site || null,
    reportedBy: incident?.reported_by || null,
    omerSent: incident?.omer_sent || false,
    snowTicket: incident?.snow_ticket || null,
    jiraTicket: incident?.jira_ticket || null,
  });
  const selectedApps = [];
  formData.apps.map((app) => selectedApps.push(app.app.id));
  const [openDropdown, setOpenDropDown] = useState<string | null>(null);
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
            {!incident ? "הוסף אירוע" : "ערוך אירוע"}
          </h1>
          <button onClick={handleClose}>
            <img src={crossIcon} alt="" />
          </button>
        </div>

        {/* form */}

        <form className="flex flex-col gap-5 px-6 py-4 w-full">
          <div className="flex flex-row-reverse gap-5 w-full items-start">
            {/* Right column */}
            <div className="flex flex-1 flex-col gap-3">
              <LabelInput
                label="* שם אירוע"
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
                label="* מקור דיווח"
                values={reporterSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.reportedBy}
                setType={(value: keyof typeof ReporterEnum) => {
                  setFormData({ ...formData, reportedBy: value });
                }}
                dropDownValue="reporter"
              />
              <LabelButton
                label="תשתית"
                values={paltformSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.platform}
                setType={(value: keyof typeof PlatformEnum) => {
                  setFormData({ ...formData, platform: value });
                }}
                dropDownValue="platform"
              />
              <LabelButton
                label="סביבה"
                values={envSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.env}
                setType={(value: keyof typeof envEnum) => {
                  setFormData({ ...formData, env: value });
                }}
                dropDownValue="env"
              />
              <LabelButton
                label="אתר"
                values={siteSettings}
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
                value={formData.snowTicket}
                setValue={(e) =>
                  setFormData({ ...formData, snowTicket: e.target.value })
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
                        omerSent: !formData.omerSent,
                      })
                    }
                    type="button"
                    className={`${
                      formData.omerSent ? "bg-secondary-text" : ""
                    } rounded-sm border border-secondary-text size-5 text-white-color flex justify-center items-center`}
                  >
                    v
                  </button>
                </div>
              </div>
            </div>
            {/* Left column */}
            <div className="flex flex-1 flex-col gap-3">
              <LabelButton
                label="* משמעות טכנית"
                values={impactSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.technicalImpact}
                setType={(value: keyof typeof ImpactEnum) => {
                  setFormData({ ...formData, technicalImpact: value });
                }}
                dropDownValue="impact"
              />
              <LabelText
                label="* משמעות מבצעית"
                placeholder="הוסף משמעות מבצעית"
                value={formData.operationalImpact}
                setValue={(e) =>
                  setFormData({
                    ...formData,
                    operationalImpact: e.target.value,
                  })
                }
              />
              {/* <LabelButton label="מערכות" />
              <LabelButton label="מערכות מושפעות" /> */}
              <LabelApps
                label="מערכות"
                apps={apps}
                value={formData.apps}
                setValue={(value) =>
                  setFormData({
                    ...formData,
                    apps: formData.apps.concat({ app: value }),
                  })
                }
              />
              <LabelInput
                label="* זמן תחילת אירוע"
                type="datetime-local"
                value={formData.startDate}
                setValue={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
              <LabelInput
                label="זמן סיום אירוע"
                type="datetime-local"
                value={formData.endDate}
                setValue={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
              <LabelInput
                label="מספר טיקט בJIRA"
                placeholder="הוסף מספר טיקט"
                value={formData.jiraTicket}
                setValue={(e) =>
                  setFormData({ ...formData, jiraTicket: e.target.value })
                }
              />
              {/* <LabelButton label="* סטטוס" /> */}
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
            {incident && (
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
