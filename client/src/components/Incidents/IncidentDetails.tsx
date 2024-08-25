import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ImpactEnum,
  PlatformEnum,
  ReporterEnum,
  SiteEnum,
  StatusEnum,
} from "../../types/IncidentType";
import { useIncidentDataById } from "../../hooks/useIncidentData";
import AppBanner from "../AppBanner";
import { AnimatePresence, motion } from "framer-motion";
import messageIcon from "../../assets/messageIcon.svg";
import { useNewMessage } from "../../hooks/useNewMessage";
import { useState } from "react";
import { useDeleteIncident } from "../../hooks/useDeleteIncident";
import { ConfirmationModal } from "../ConfirmationModal";
import ManageIncidentForm from "./incidentForm/ManageIncidentForm";
import { Backdrop } from "../Backdrop";

/**
 * The IncidentDetails component renders the incident details page, including the incident's activity
 */
export default function IncidentDetails() {
  // Get the incident's ID from params, and get the incidents' data using useIncidentDataById(id) hook
  const { id } = useParams();
  const data = useIncidentDataById(Number(id)).data;
  const navigate = useNavigate();
  const location = useLocation();
  const deleteIncident = useDeleteIncident();

  // Get the new message function from useNewMessage(id) hook, and set the message text state
  const newMessage = useNewMessage(Number(id));
  const [messageText, setMessageText] = useState("");
  const [deleteForm, setDeleteForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // If still fetching, return loading text
  if (!data)
    return (
      <Backdrop onClick={() => {}}>
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-light animate-spin fill-text"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </Backdrop>
    );
  // Make dates objects and calculate MTTR - if no end date, calculate MTTR from start date until now

  const now = new Date();
  const mttr = data.end_date
    ? (
        (data.end_date.valueOf() - data.start_date.valueOf()) /
        (1000 * 60 * 60)
      ).toFixed(2)
    : ((now.valueOf() - data.start_date.valueOf()) / (1000 * 60 * 60)).toFixed(
        2
      );

  // Handle sending a new message
  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (messageText !== "") {
      newMessage(messageText);
      setMessageText("");
    }
  };

  // Status color - will be used to have different colors for each status
  const statusColor = {
    green: "bg-secondary-green",
    yellow: "bg-secondary-yellow",
    red: "bg-secondary-red",
    grey: "bg-slate-700",
  };
  const handleClose = () => {
    const queryParams = new URLSearchParams(location.search);
    navigate(`/incidents?${queryParams.toString()}`);
  };
  return (
    <>
      <div
        // Navigating to /incidents will close the details tab
        onClick={handleClose}
        className="fixed top-0 right-0 bg-black bg-opacity-10 w-screen h-screen flex justify-start"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "clamp(55rem,50%,70rem)" }}
          onClick={(e) => e.stopPropagation()}
          className="h-screen bg-light border-r border-border shadow-lg w-[clamp(55rem,50%,70rem)] flex overflow-x-hidden"
        >
          {/* LEFT SIDE */}
          <div className="h-full w-2/5 border-r border-border flex flex-col justify-between p-4 child:whitespace-nowrap child:overflow-x-hidden gap-4">
            <div className="flex flex-col gap-3">
              <h1 className="pt-2 font-medium text-lg  w-full text-right">
                פרטי אירוע
              </h1>
              <div className="w-full h-px bg-border"></div>
              <TextSection
                label=":נפתח על ידי"
                text={`${
                  data.opened_by
                    ? data.opened_by.first_name + " " + data.opened_by.last_name
                    : "משתמש נמחק"
                }`}
              />
              <TextSection
                label=":מקור דיווח"
                text={`${ReporterEnum[data.reported_by!]}`}
              />
              <TextSection
                label=':דווח לעמ"ר'
                text={`${data.omer_sent ? "V" : "X"}`}
                inline
              />
              <TextSection
                label=":עלה בניטור"
                text={`${data.monitored ? "V" : "X"}`}
                inline
              />
              <div className="w-full h-px bg-border"></div>
              <TextSection label=":אתר" text={SiteEnum[data.site!]} />
              <TextSection label=":תשתית" text={PlatformEnum[data.platform!]} />
              <TextSection
                label=":סביבה"
                text={`${data.env === "BLACK" ? "Black" : "RED" ? "Red" : ""}`}
              />
              <div className="w-full h-px bg-border"></div>
              <div className="text-right">
                <h5 className="incident-label">:משמעות מבצעית</h5>
                <p>{data.operational_impact}</p>
              </div>

              <BottomSection
                title=":משמעות טכנית"
                value={ImpactEnum[data.technical_impact!]}
                button
                style={statusColor.grey}
              />
              {data.snow_ticket && (
                <BottomSection title=":SNOWטיקט ב" value={data.snow_ticket} />
              )}
              {data.jira_ticket && (
                <BottomSection title=":JIRAטיקט ב" value={data.jira_ticket} />
              )}
              <BottomSection
                title=":תחילת אירוע"
                value={data.start_date.toLocaleString("he-IL", {
                  day: "numeric",
                  month: "short",
                  year: "2-digit",
                  hour: "numeric",
                  minute: "numeric",
                })}
              />
              <BottomSection
                title=":סיום אירוע"
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
                title=":MTTR"
                value={`${mttr} שעות`}
              />
              <BottomSection
                title=":סטטוס"
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
            <div className="flex gap-3 w-full child:w-full child:rounded-md child:cursor-pointer child:p-2">
              <button
                type="button"
                onClick={() => setDeleteForm(true)}
                className="border box-border border-secondary-red text-secondary-red"
              >
                מחיקה
              </button>
              <button
                onClick={() => setShowEditForm(true)}
                className="bg-primary text-white-color"
              >
                עריכה
              </button>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="flex flex-col items-end p-4 gap-2  child:overflow-x-hidden flex-1">
            <h1 className="font-medium text-lg"> {data.title}</h1>
            <h4 className="text-secondary-text">{`אירוע מספר ${data.id}`}</h4>
            <p>{data.description}</p>
            <div className="w-full h-px bg-border"></div>
            <h4 className="text-secondary-text">מערכות</h4>
            {data.IncidentApp.map((app) => (
              <AppBanner key={app.app.id} app={app.app} />
            ))}
            <h4 className="text-secondary-text">מערכות מושפעות</h4>
            {data.IncidentImpact.length > 0 ? (
              data.IncidentImpact.map((app) => (
                <AppBanner key={app.app.id} app={app.app} />
              ))
            ) : (
              <h4>אין</h4>
            )}
            {/* התקדמות אירוע */}

            <div className="flex flex-col gap-2 w-full flex-1">
              <h3 dir="rtl" className="text-lg font-medium my-3">
                התקדמות אירוע
              </h3>
              {/* All the messages section */}
              <div className="h-full flex flex-col justify-between items-end overflow-hidden">
                <div className="overflow-auto flex-1 w-full flex flex-col gap-2 px-1">
                  {data.IncidentActivity!.map((inc) => {
                    const messageDate = new Date(inc.message_date);
                    return (
                      <div
                        className="w-full flex flex-col text-right overflow-hidden"
                        key={inc.message_date}
                      >
                        <div className="flex flex-row-reverse gap-2 items-center">
                          <div className="child:text-sm min-w-6 size-6 bg-secondary-yellow rounded-full flex child:text-white-color items-center justify-center">
                            <span>
                              {inc.sent_by.last_name.charAt(0).toUpperCase()}
                            </span>
                            <span>
                              {inc.sent_by.first_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="font-medium flex gap-1" dir="rtl">
                            <h5>
                              {inc.sent_by.first_name +
                                " " +
                                inc.sent_by.last_name}
                            </h5>

                            <h5 className="text-secondary-text mx-2 font-normal">
                              {messageDate.toLocaleString("he-IL", {
                                day: "numeric",
                                month: "short",
                                year: "2-digit",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                              })}
                            </h5>
                          </div>
                        </div>
                        <p
                          className="border-r-2 border-border m-3 px-3 whitespace-normal break-words max-w-[30rem] text-right self-end"
                          dir="rtl"
                        >
                          {inc.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {/* New message section */}
                <form
                  onSubmit={handleSendMessage}
                  className="bg-white-color border border-border rounded-md p-2 flex flex-row-reverse w-full"
                >
                  <textarea
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.shiftKey === false)
                        handleSendMessage(e);
                    }}
                    dir="rtl"
                    placeholder="הוסף עדכון.."
                    className="resize-none flex-1 outline-none pl-2"
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  ></textarea>
                  <button
                    type="submit"
                    className="px-2 py-1 bg-primary text-white rounded-md h-fit flex gap-2 items-center self-end flex-row-reverse"
                  >
                    שליחת עדכון
                    <img src={messageIcon} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {deleteForm && (
          <ConfirmationModal
            handleClose={() => setDeleteForm(false)}
            text="האם אתה בטוח שאתה רוצה למחוק את האירוע? פעולה זו היא בלתי ניתנת לביטול"
            title="מחיקת אירוע"
            handleSubmit={() => {
              handleClose();
              deleteIncident(data.id!);
            }}
          />
        )}
        {showEditForm && (
          <ManageIncidentForm
            handleClose={() => setShowEditForm(false)}
            incident={data}
          />
        )}
      </AnimatePresence>
    </>
  );
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
  text: string;
  inline?: boolean;
}) {
  return (
    <div
      className={`${
        inline ? "flex-row-reverse gap-2" : "flex-col"
      } flex child:text-right`}
    >
      <h5 className="incident-label">{label}</h5>
      <p className="incident-text">{text}</p>
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
    <div className="flex flex-row-reverse justify-between items-center">
      <h5 className="incident-label">{title}</h5>
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
