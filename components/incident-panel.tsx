import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import day from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import useBreakpoints from "hooks/use-breakpoints";
import { join, map } from "lodash";
import { IIncident } from "models/backend/incident-models";
import { FC, useEffect, useState } from "react";

import BasicPanel from "./basic-panel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface IncidentPanelProps {
  incident: IIncident;
  forceClosed?: boolean;
}

const borderColor: { [key: string]: string } = {
  "Degraded Performance": "#f25f5f",
  Maintenance: "#939cfa",
  "Planned Maintenance": "#939cfa",
  "Implementing Fix": "#e993e0",
  Monitoring: "#f2c94c",
  Resolved: "#43B581",
};

const IncidentPanel: FC<IncidentPanelProps> = ({ incident, forceClosed }) => {
  const { isMd } = useBreakpoints();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(forceClosed ? false : isMd);
  }, [isMd]);

  return (
    <button
      type="button"
      onClick={() => {
        setOpened(forceClosed ? false : !opened);
      }}
      className={`w-full cursor-pointer ${
        opened ? `` : `md:hover:-translate-y-1`
      } transition ease-in-out`}
    >
      <BasicPanel
        borderTop
        borderColor={
          borderColor[incident.content.status] || borderColor.Maintenance
        }
      >
        <motion.div
          whileHover={!opened ? { paddingBottom: 10 } : undefined}
          animate={{ height: "fit-content" }}
          className="flex w-full flex-col p-2 text-darkText dark:text-darkText-darkMode"
        >
          <div className="relative flex w-full flex-col items-center gap-y-2 text-center md:flex-row md:justify-between md:text-start">
            <h2 className="m-0">{incident.content.title}</h2>
            <span className="opacity-75">{incident.content.status}</span>
          </div>
          <AnimatePresence>
            {opened && (
              <motion.div
                initial={{ height: 0, marginTop: 0, opacity: 0 }}
                animate={{ height: "fit-content", marginTop: 20, opacity: 1 }}
                exit={{ height: 0, marginTop: 0, opacity: 0 }}
                className="flex w-full flex-col gap-5 overflow-hidden text-start"
              >
                <hr className="w-full" />
                <div className="grid w-full grid-cols-1 gap-y-3 md:grid-cols-[200px_1fr]">
                  <div className="opacity-75">Message</div>
                  <div>{incident.content.message}</div>
                </div>
                <div className="grid w-full grid-cols-1 gap-y-3 md:grid-cols-[200px_1fr]">
                  <div className="opacity-75">Affected Services</div>
                  <div>{join(incident.content.affected, `, `)}</div>
                </div>
                <hr className="w-full" />
                <div>
                  <div className="flex w-full flex-col gap-5 md:gap-3">
                    {map(incident.content.updates, (update) => (
                      <div
                        key={update.timestamp}
                        className="grid grid-cols-1 gap-y-3 md:grid-cols-[200px_1fr]"
                      >
                        <div className="opacity-75">
                          {day(update.timestamp).format(`MMM DD YYYY - HH:mm`)}
                        </div>
                        <div>
                          <span className="opacity-75">[{update.status}]</span>{" "}
                          {update.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </BasicPanel>
    </button>
  );
};

export default IncidentPanel;
