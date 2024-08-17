import { AppType } from "../types/AppType";
import { envEnum, SiteEnum } from "../types/IncidentType";

/**
 * This function is used to display an app banner.
 * @param app - The app object to be displayed.
 */
export default function AppBanner({ app }: { app: AppType }) {
  return (
    <div className="w-full flex flex-row-reverse justify-between p-[10px] bg-white-color border border-border rounded-md">
      <h1 className="font-medium">{app.name}</h1>
      <div className="flex gap-2 items-center">
        {app.env && <p>{envEnum[app.env]}</p>}

        {app.env && app.main_site && (
          <div className="size-1 rounded-full bg-text"></div>
        )}
        {app.main_site && <p>{SiteEnum[app.main_site]}</p>}
      </div>
    </div>
  );
}
