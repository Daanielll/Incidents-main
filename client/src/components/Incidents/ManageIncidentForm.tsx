import { IncidentType } from "../../types/IncidentType";
import { motion } from "framer-motion";
import { Backdrop } from "../Backdrop";
import crossIcon from "../../assets/crossIcon.svg";
import { useEffect, useState } from "react";
import settings from "../../types/AppSettings";
import { LabelApps, LabelButton, LabelInput, ToggleInput } from "./Sections";
import { useNewIncident } from "../../hooks/useNewIncident";
import { toast } from "sonner";
import { useAllApps } from "../../hooks/Apps/useAllApps";
import { useUpdateIncident } from "../../hooks/useUpdateIncident";
import { AppType } from "../../types/AppType";
import {
  EnvEnum,
  ImpactEnum,
  PlatformEnum,
  ReporterEnum,
  SiteEnum,
  StatusEnum,
} from "../../types/Enums";

type Props = {
  handleClose: (e: React.MouseEvent | React.FormEvent) => void;
  incident: IncidentType;
};

/**
 * Form copnent for creating or updating an incident.
 * @param handleCloste - The function to close the form.
 * @param incident - The incident object.
 */
export default function ManageIncidentForm({ handleClose, incident }: Props) {
  // Get all the apps (for the apps dropdown)
  const apps = useAllApps().data;
  // Use the hooks to update and create new incidents
  const newIncident = useNewIncident();
  const updateIncident = useUpdateIncident();
  // State for the form - excluding the apps
  const [formData, setFormData] = useState(incident);
  // State for the apps
  const [selectedApps, setSelectedApps] = useState<number[]>([]);
  // State for the impacted apps
  const [selectedImpacted, setSelectedImpacted] = useState<number[]>([]);
  // Update the apps states to the incident's apps IDs
  useEffect(() => {
    setSelectedApps(incident.IncidentApp.map((app) => app.app.id!));
    setSelectedImpacted(incident.IncidentImpact.map((app) => app.app.id!));
  }, []);
  // State to control which dropdown is active
  const [openDropdown, setOpenDropDown] = useState<string | null>(null);
  // Set the form's required fields
  const requiredFields = [
    "start_date",
    "title",
    "description",
    "operational_impact",
    "technical_impact",
    "status",
    "reported_by",
  ];
  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Get all the changes if the user is editing an existing incident
    const changes = getFormChanges(incident, formData);
    // Check if the apps or impacted apps have changed - returns boolean
    const appsChanged = getAppChanges(incident.IncidentApp, selectedApps);
    const impactedAppsChanged = getAppChanges(
      incident.IncidentImpact,
      selectedImpacted
    );

    // Split the data to only send the relevent data
    const {
      IncidentApp,
      IncidentImpact,
      description,
      operational_impact,
      IncidentActivity,
      ...data
    } = formData;
    // Create the finalIncident object, which will be sent to the server
    const finalIncident = {
      ...data,
      apps: selectedApps,
      impacted_apps: selectedImpacted,
      ...(description.trim() !== "" && { description: description }),
      ...(operational_impact.trim() !== "" && {
        operational_impact: operational_impact,
      }),
    };

    // Check if required fields are missing before sending the request
    const isValid =
      requiredFields.every(
        (key) => finalIncident[key as keyof typeof finalIncident] != null
      ) && finalIncident.apps.length > 0;

    if (isValid) {
      // If the user is creating a new incident, use the useNewIncident hook
      if (!incident.id) newIncident(finalIncident);
      // If the user is editing an existing incident, use the useUpdateIncident hook
      else {
        if (Object.keys(changes)[0] || appsChanged || impactedAppsChanged)
          updateIncident({
            changes: {
              ...changes,
              ...(appsChanged && { apps: selectedApps }),
              ...(impactedAppsChanged && { impacted_apps: selectedImpacted }),
            },
            id: incident.id!,
          });
      }
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
        className="bg-white-color border border-border w-[clamp(650px,30%,800px)] flex flex-col gap-4 items-end rounded-lg shadow-md text-tex relative"
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
          {/* Header */}
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
              <LabelInput
                label="* תיאור תקלה"
                placeholder="הוסף תיאור תקלה"
                type="textarea"
                value={formData.description}
                setValue={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
              {incident.id && (
                <>
                  <LabelButton
                    label="סביבה"
                    values={settings.envSettings}
                    openDropDown={openDropdown}
                    setOpenDropDown={setOpenDropDown}
                    type={formData.env}
                    setType={(value: keyof typeof EnvEnum) => {
                      setFormData({ ...formData, env: value });
                    }}
                    dropDownValue="env"
                  />

                  <LabelButton
                    label="אתר"
                    values={settings.siteSettings}
                    openDropDown={openDropdown}
                    setOpenDropDown={setOpenDropDown}
                    type={formData.site}
                    setType={(value: keyof typeof SiteEnum) => {
                      setFormData({ ...formData, site: value });
                    }}
                    dropDownValue="site"
                  />
                </>
              )}
              <LabelInput
                label="מספר טיקט בSNOW"
                placeholder="הוסף מספר טיקט"
                value={formData.snow_ticket || ""}
                setValue={(e) =>
                  setFormData({ ...formData, snow_ticket: e.target.value })
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
            {/* Left column */}
            <div className="flex w-[calc(50%-1.25rem)] flex-col gap-3">
              <div className="flex gap-4">
                <ToggleInput
                  label='דווח לעמ"ר?'
                  value={formData.omer_sent}
                  setValue={() =>
                    setFormData({
                      ...formData,
                      omer_sent: !formData.omer_sent,
                    })
                  }
                />
                <ToggleInput
                  label="עלה בניטור?"
                  value={formData.monitored}
                  setValue={() =>
                    setFormData({
                      ...formData,
                      monitored: !formData.monitored,
                    })
                  }
                />
              </div>
              <LabelInput
                type="textarea"
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
              {incident.id && (
                <LabelButton
                  label="תשתית"
                  values={settings.platformSettings}
                  openDropDown={openDropdown}
                  setOpenDropDown={setOpenDropDown}
                  type={formData.platform}
                  setType={(value: keyof typeof PlatformEnum) => {
                    setFormData({ ...formData, platform: value });
                  }}
                  dropDownValue="platform"
                />
              )}
              <LabelInput
                label="זמן תחילת אירוע *"
                type="datetime-local"
                value={formData.start_date}
                setValue={(e) => {
                  setFormData({
                    ...formData,
                    start_date: new Date(e.target.value),
                  });
                }}
              />
              <LabelInput
                isDisabled={formData.status != "RESOLVED"}
                label="זמן סיום אירוע"
                type="datetime-local"
                value={formData.end_date || ""}
                setValue={(e) => {
                  const d = e.target.value;
                  setFormData({
                    ...formData,
                    end_date: d !== "" ? new Date(d) : null,
                  });
                }}
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
                שמור אירוע
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 bg-white-color text-secondary-text box-border border border-border rounded-md"
              >
                ביטול
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </Backdrop>
  );
}

/**
 * A function that returns an object with all the form changes
 * @param incident - The incident object
 * @param formData - The form data
 */
function getFormChanges(incident: IncidentType, formData: IncidentType) {
  const changes = Object.entries(formData).reduce((all, [key, value]) => {
    if (incident[key as keyof IncidentType] !== value) {
      if (key === "start_date" || key === "end_date") {
        const dateValue = value ? value.toISOString().slice(0, 16) : null;
        const incidentDateValue = incident[key]
          ? incident[key]?.toISOString().slice(0, 16)
          : null;
        if (dateValue !== incidentDateValue) all[key] = value;
      } else all[key] = value;
    }
    return all;
  }, {} as { [key: string]: any });
  return changes;
}

/**
 * A funcion that returns true if the apps or impacted apps have changed
 * @param incidentApps - The incident apps
 * @param selectedApps - The selected apps
 */
function getAppChanges(
  incidentApps: { app: AppType }[],
  selectedApps: number[]
) {
  return (
    incidentApps.length !== selectedApps.length ||
    incidentApps.some((app) => !selectedApps.includes(app.app.id!))
  );
}
