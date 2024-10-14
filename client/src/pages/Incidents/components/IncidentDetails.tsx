import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import trashIcon from "assets/trashIcon.svg";
import editIcon from "assets/editIcon.svg";
import {
  EnvEnum,
  ImpactEnum,
  PlatformEnum,
  ReporterEnum,
  SiteEnum,
  StatusEnum,
} from "types/Enums";
import ManageIncidentForm from "./ManageIncidentForm";
import { ConfirmationModal } from "components/ConfirmationModal";
import { AppType } from "types/AppType";
import {
  useDeleteIncident,
  useIncidentDataById,
} from "hooks/queries/incidentApi";

/**
 * The IncidentDetails component renders the incident details page, including the incident's activity
 */
export default function IncidentDetails({ id }: { id: number }) {
  // Get the incidents' data using useIncidentDataById(id) hook
  const data = useIncidentDataById(Number(id)).data;
  const deleteIncident = useDeleteIncident();

  // Get the new message function from useNewMessage(id) hook, and set the message text state
  const [deleteForm, setDeleteForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // If still fetching, return loading text
  if (!data) return <h1>loading</h1>;
  // Calculate MTTR - if no end date, calculate MTTR from start date until now
  const now = new Date();
  const mttr = data.end_date
    ? (
        (data.end_date.valueOf() - data.start_date.valueOf()) /
        (1000 * 60 * 60)
      ).toFixed(2)
    : ((now.valueOf() - data.start_date.valueOf()) / (1000 * 60 * 60)).toFixed(
        2
      );
  // Status color - will be used to have different colors for each status
  const statusColor = {
    green: "bg-secondary-green",
    yellow: "bg-secondary-yellow",
    red: "bg-secondary-red",
    grey: "bg-slate-700",
  };

  return (
    <>
      <div className="flex flex-col h-full border-b border-border">
        <div
          dir="rtl"
          className="bg-white p-3 px-4 flex justify-between text-text gap-10 h-full border-b border-border"
        >
          {/* First section */}
          <div className="flex flex-col gap-2">
            <TextSection
              label="נפתח על ידי:"
              text={`${
                data.opened_by
                  ? data.opened_by.first_name + " " + data.opened_by.last_name
                  : "משתמש נמחק"
              }`}
            />
            <TextSection
              label="נערך על ידי:"
              text={`${
                data.updated_by
                  ? data.updated_by.first_name + " " + data.updated_by.last_name
                  : "משתמש נמחק"
              } ב: ${data.updated_at!.toLocaleString("he-IL", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "numeric",
              })}`}
            />
            <TextSection
              label="מקור דיווח:"
              text={ReporterEnum[data.reported_by!]}
            />
            {data.snow_ticket && (
              <BottomSection title=":SNOWטיקט ב" value={data.snow_ticket} />
            )}
            <TextSection
              label='דווח לעמ"ר:'
              text={`${data.omer_sent ? "V" : "X"}`}
              inline
            />
            <TextSection
              label="עלה בניטור:"
              text={`${data.monitored ? "V" : "X"}`}
              inline
            />
          </div>
          {/* Divider */}
          <Divider />
          {/* Second Section */}
          <div className="flex flex-col gap-2 max-w-[20%]">
            <TextSection label="מערכות:" text={data.IncidentApp} />
            {data.IncidentImpact[0] && (
              <TextSection label="מערכות מושפעות:" text={data.IncidentImpact} />
            )}
            <TextSection
              label="אתר:"
              text={data.site ? SiteEnum[data.site] : "אין"}
            />
            <TextSection
              label="תשתית:"
              text={data.platform ? PlatformEnum[data.platform] : "אין"}
            />
            <TextSection
              label="סביבה:"
              text={data.env ? EnvEnum[data.env] : "אין"}
            />
          </div>
          {/* Divider */}
          <Divider />
          {/* Third section */}
          <div className="flex flex-col gap-2 max-w-[20%]">
            <div className="text-right">
              <h5 className="incident-label">משמעות מבצעית:</h5>
              <p className="break-words">{data.operational_impact}</p>
            </div>

            <BottomSection
              title="משמעות טכנית:"
              value={ImpactEnum[data.technical_impact!]}
              button
              style={statusColor.grey}
            />
            {data.snow_ticket && (
              <BottomSection title=":SNOWטיקט ב" value={data.snow_ticket} />
            )}
            <BottomSection
              title="תחילת אירוע:"
              value={data.start_date.toLocaleString("he-IL", {
                day: "numeric",
                month: "short",
                year: "2-digit",
                hour: "numeric",
                minute: "numeric",
              })}
            />
            <BottomSection
              title="סיום אירוע:"
              value={
                data.end_date
                  ? data.end_date.toLocaleString("he-IL", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : "בתהליך"
              }
            />
            <BottomSection
              style={!data.end_date ? "text-secondary-text" : ""}
              title="MTTR:"
              value={`${mttr} שעות`}
            />
            <BottomSection
              title="סטטוס:"
              value={StatusEnum[data.status!]}
              button
              style={
                data.status == "ONGOING"
                  ? statusColor.red
                  : data.status === "AWAITING_ANSWER"
                  ? statusColor.yellow
                  : statusColor.green
              }
            />
          </div>
          {/* Divider */}
          <Divider />
          {/* Fourth section */}
          <div className="w-[40%]">
            <h1 className="font-medium text-text">{data.title}</h1>
            <h4 className="text-secondary-text pb-2">{`אירוע מספר ${data.id}`}</h4>
            <p>{data.description}</p>
          </div>
        </div>
        <div
          dir="rtl"
          className="flex gap-2  w-full justify-end bg-white px-4 py-3 child:px-3 child:py-1 child:rounded-md child:flex child:border child:gap-2 child:items-center"
        >
          <button
            onClick={() => setDeleteForm(true)}
            className="bg-secondary-red text-white border-secondary-red"
            type="button"
          >
            <img src={trashIcon} />
            מחיקה
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            className="border-secondary-text text-secondary-text"
            type="button"
          >
            <img src={editIcon} />
            עריכה
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showEditForm && (
          <ManageIncidentForm
            handleClose={() => setShowEditForm(false)}
            incident={data}
          />
        )}
        {deleteForm && (
          <ConfirmationModal
            handleClose={() => setDeleteForm(false)}
            text="האם אתה בטוח שאתה רוצה למחוק את האירוע? פעולה זו היא בלתי ניתנת לביטול"
            title="מחיקת אירוע"
            handleSubmit={() => {
              deleteIncident(data.id!);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
  // return (
  //   <>
  //     <div
  //       // Navigating to /incidents will close the details tab
  //       onClick={handleClose}
  //       className="fixed top-0 right-0 bg-black bg-opacity-10 w-screen h-screen flex justify-start"
  //     >
  //       <motion.div
  //         initial={{ width: 0 }}
  //         animate={{ width: "clamp(55rem,50%,70rem)" }}
  //         onClick={(e) => e.stopPropagation()}
  //         className="h-screen bg-light border-r border-border shadow-lg w-[clamp(55rem,50%,70rem)] flex overflow-x-hidden"
  //       >
  //         {/* LEFT SIDE */}
  //         <div className="h-full w-2/5 border-r border-border flex flex-col justify-between p-4 child:whitespace-nowrap child:overflow-x-hidden gap-4">
  //           <div className="flex flex-col gap-3">
  //             <h1 className="pt-2 font-medium text-lg  w-full text-right">
  //               פרטי אירוע
  //             </h1>
  //             <div className="w-full h-px bg-border"></div>
  //             <TextSection
  //               label=":נפתח על ידי"
  //               text={`${
  //                 data.opened_by
  //                   ? data.opened_by.first_name + " " + data.opened_by.last_name
  //                   : "משתמש נמחק"
  //               }`}
  //             />
  //             <TextSection
  //               label=":מקור דיווח"
  //               text={`${ReporterEnum[data.reported_by!]}`}
  //             />
  //             <TextSection
  //               label=':דווח לעמ"ר'
  //               text={`${data.omer_sent ? "V" : "X"}`}
  //               inline
  //             />
  //             <TextSection
  //               label=":עלה בניטור"
  //               text={`${data.monitored ? "V" : "X"}`}
  //               inline
  //             />
  //             <div className="w-full h-px bg-border"></div>
  //             <TextSection label=":אתר" text={SiteEnum[data.site!]} />
  //             <TextSection label=":תשתית" text={PlatformEnum[data.platform!]} />
  //             <TextSection
  //               label=":סביבה"
  //               text={`${data.env === "BLACK" ? "Black" : "RED" ? "Red" : ""}`}
  //             />
  //             <div className="w-full h-px bg-border"></div>
  //             <div className="text-right">
  //               <h5 className="incident-label">:משמעות מבצעית</h5>
  //               <p>{data.operational_impact}</p>
  //             </div>

  //             <BottomSection
  //               title=":משמעות טכנית"
  //               value={ImpactEnum[data.technical_impact!]}
  //               button
  //               style={statusColor.grey}
  //             />
  //             {data.snow_ticket && (
  //               <BottomSection title=":SNOWטיקט ב" value={data.snow_ticket} />
  //             )}
  //             {data.jira_ticket && (
  //               <BottomSection title=":JIRAטיקט ב" value={data.jira_ticket} />
  //             )}
  //             <BottomSection
  //               title=":תחילת אירוע"
  //               value={data.start_date.toLocaleString("he-IL", {
  //                 day: "numeric",
  //                 month: "short",
  //                 year: "2-digit",
  //                 hour: "numeric",
  //                 minute: "numeric",
  //               })}
  //             />
  //             <BottomSection
  //               title=":סיום אירוע"
  //               value={
  //                 data.end_date
  //                   ? data.end_date.toLocaleString("he-IL", {
  //                       day: "numeric",
  //                       month: "short",
  //                       year: "2-digit",
  //                       hour: "numeric",
  //                       minute: "numeric",
  //                     })
  //                   : "בתהליך"
  //               }
  //             />
  //             <BottomSection
  //               style={!data.end_date ? "text-secondary-text" : ""}
  //               title=":MTTR"
  //               value={`${mttr} שעות`}
  //             />
  //             <BottomSection
  //               title=":סטטוס"
  //               value={StatusEnum[data.status!]}
  //               button
  //               style={
  //                 data.status == "ONGOING"
  //                   ? statusColor.red
  //                   : data.status === "AWAITING_ANSWER"
  //                   ? statusColor.yellow
  //                   : statusColor.green
  //               }
  //             />
  //           </div>
  //           <div className="flex gap-3 w-full child:w-full child:rounded-md child:cursor-pointer child:p-2">
  //             <button
  //               type="button"
  //               onClick={() => setDeleteForm(true)}
  //               className="border box-border border-secondary-red text-secondary-red"
  //             >
  //               מחיקה
  //             </button>
  //             <button
  //               onClick={() => setShowEditForm(true)}
  //               className="bg-primary text-white-color"
  //             >
  //               עריכה
  //             </button>
  //           </div>
  //         </div>
  //         {/* RIGHT SIDE */}
  //         <div className="flex flex-col items-end p-4 gap-2  child:overflow-x-hidden flex-1">
  //           <h1 className="font-medium text-lg"> {data.title}</h1>
  //           <h4 className="text-secondary-text">{`אירוע מספר ${data.id}`}</h4>
  //           <p>{data.description}</p>
  //           <div className="w-full h-px bg-border"></div>
  //         </div>
  //       </motion.div>
  //     </div>
  //     <AnimatePresence>
  //       {deleteForm && (
  //         <ConfirmationModal
  //           handleClose={() => setDeleteForm(false)}
  //           text="האם אתה בטוח שאתה רוצה למחוק את האירוע? פעולה זו היא בלתי ניתנת לביטול"
  //           title="מחיקת אירוע"
  //           handleSubmit={() => {
  //             handleClose();
  //             deleteIncident(data.id!);
  //           }}
  //         />
  //       )}
  //       {showEditForm && (
  //         <ManageIncidentForm
  //           handleClose={() => setShowEditForm(false)}
  //           incident={data}
  //         />
  //       )}
  //     </AnimatePresence>
  //   </>
  // );
}

/**
 * The TextSection component renders a label with text either inline or underneath, with underneath as defult
 * @param label - The label text
 * @param text - The text to display
 * @param inline - Whether the text should be displayed inline - false by default */
function TextSection({
  label,
  text,
  inline = false,
}: {
  label: string;
  text: string | { app: AppType }[];
  inline?: boolean;
}) {
  return (
    <div
      className={`${
        inline ? "flex-row gap-2" : "flex-col"
      } flex child:text-right`}
    >
      <h5 className="incident-label">{label}</h5>
      {typeof text === "string" ? (
        <p className="incident-text">{text}</p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {text.map((app) => (
            <p className="px-2 bg-border rounded-md text-nowrap">
              {app.app.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The BottomSection component renders a label with text inline, the text has a
 * fixed width and a styled border, like all the text sections at the bottom of the left side of the screen.
 * @param title - The title (label) of the section
 * @param value - The value of the section
 * @param button - Whether it should be styled as button - false by default
 * @param style - Any additional styles
 */
function BottomSection({
  title,
  value,
  button = false,
  style = "",
}: {
  title: string;
  value: string;
  button?: boolean;
  style?: string;
}) {
  return (
    <div className="flex flex-row justify-between items-center">
      <h5 className="incident-label pl-5">{title}</h5>
      <div className="w-48 px-2 border-r border-border">
        <div
          className={`${
            button ? "text-white-color" : "font-medium"
          } ${style} p-1 rounded-md w-full text-center `}
        >
          <p dir="rtl">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-full rounded-full w-px bg-border"></div>;
}
