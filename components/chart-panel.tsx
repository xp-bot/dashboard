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
import { forEach, isEqual, map, size, slice, sum } from "lodash";
import { IIlumChart } from "models/backend/ilum-models";
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { isDark as isDarkTheme } from "utils/theme-utils";

import BasicPanel, { BasicPanelVariant } from "./basic-panel";
import Select from "./select";

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

interface IIlumDisplayChart extends IIlumChart {
  name: string;
  color: string;
}

interface ChartPanelProps {
  title: string;
  chartData?: IIlumDisplayChart[];
  hideChart?: boolean;
}

const statusToClass = {
  Stable:
    "bg-[#16C172] text-lightText dark:text-lightText-darkMode dark:bg-[#16C172]/25 dark:border-2 dark:border-[#16C172]/60",
  Unstable:
    "bg-[#FC9E4F] text-lightText dark:text-lightText-darkMode dark:bg-[#FC9E4F]/25 dark:border-2 dark:border-[#FC9E4F]/60",
  Offline:
    "bg-[#FF5964] text-lightText dark:text-lightText-darkMode dark:bg-[#FF5964]/25 dark:border-2 dark:border-[#FF5964]/60",
  Unknown:
    "bg-[#3A2D32]/60 text-lightText dark:text-lightText-darkMode dark:bg-[#CC2936]/25 dark:border-2 dark:border-[#CC2936]/60",
};

const ChartPanel: FC<ChartPanelProps> = ({ chartData, title, hideChart }) => {
  const [timePeriod, setTimePeriod] = useState<-144 | -1008 | -4032 | number>(
    -144
  );
  const [status, setStatus] = useState<
    `Stable` | `Unstable` | `Offline` | `Unknown`
  >(`Unknown`);
  const [average, setAverage] = useState<number>(0);
  const { theme, systemTheme } = useTheme();

  const calculateAverage = () => {
    let sumNumber = 0;
    forEach(chartData, (dataPart) => {
      sumNumber = sum([sumNumber, ...slice(dataPart.data, -10)]);
    });
    const av = parseInt((sumNumber / (10 * size(chartData))).toFixed(0), 10);
    setAverage(av);
    if (av === 0) setStatus(`Offline`);
    else if (av > 500) setStatus(`Unstable`);
    else if (av < 1000) setStatus(`Stable`);
  };

  useEffect(() => {
    calculateAverage();
  }, [chartData]);

  const isDark = isDarkTheme(theme, systemTheme);

  if (!chartData || !chartData[0]) return <></>;

  return (
    <BasicPanel>
      <div className="flex w-full flex-col gap-5">
        <div className="relative flex w-full items-center justify-between gap-2">
          <h2 className="m-0 inline-block text-[17px]">{title}</h2>
          <div className="flex h-[45.5px] w-fit flex-row gap-2">
            {!hideChart && (
              <div>
                <Select
                  className="w-fit shrink-0"
                  isInPanel
                  onChange={(v) => {
                    setTimePeriod(parseInt(v, 10));
                  }}
                  options={[
                    {
                      id: "-144",
                      title: "Last 24 hours",
                      selected: timePeriod === -144,
                    },
                    {
                      id: "-1008",
                      title: "Last 7 days",
                      selected: timePeriod === -1008,
                    },
                    {
                      id: "-4032",
                      title: "Last 30 days",
                      selected: timePeriod === -4032,
                    },
                  ]}
                />
              </div>
            )}
            <div
              className={`flex h-full w-fit min-w-[80px] items-center justify-center rounded-md border border-input-border px-2 text-center text-lg shadow-md ${statusToClass[status]}`}
            >
              {isEqual(status, `Offline`)
                ? `Offline`
                : isEqual(status, `Unknown`)
                ? `Unknown`
                : `${average}ms`}
            </div>
          </div>
        </div>
        {!hideChart && (
          <BasicPanel variant={BasicPanelVariant.inPanel}>
            <Line
              height={120}
              options={{
                responsive: true,
                interaction: {
                  intersect: false,
                  mode: "index",
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      title(context) {
                        const point = context[0];
                        return `${point.raw}ms at ${point.label}`;
                      },
                    },
                  },
                  legend: {
                    labels: {
                      color: "blue",
                    },
                    position: "bottom",
                    display: size(chartData) > 1,
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      color: isDark
                        ? `rgba(255, 255, 255,.50)`
                        : `rgba(0, 0, 0,.50)`,
                    },
                  },
                  x: {
                    grid: { display: false },
                    ticks: {
                      color: isDark
                        ? `rgba(255, 255, 255,.50)`
                        : `rgba(0, 0, 0,.50)`,
                    },
                  },
                },
              }}
              data={{
                datasets: map(chartData, (data) => ({
                  data: slice(data.data, timePeriod),
                  fill: true,
                  label: data.name,
                  borderColor: `${data.color}`,
                  backgroundColor: `${data.color}54`,
                  pointStyle: false,
                  tension: 0.15,
                })),
                labels: map(slice(chartData[0].labels, timePeriod), (date) =>
                  day(date).format(`hh:mm a`)
                ),
              }}
            />
          </BasicPanel>
        )}
      </div>
    </BasicPanel>
  );
};

export default ChartPanel;
