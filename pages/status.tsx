import { apiRoutes } from "apis/api-helper";
import BasicPanel from "components/basic-panel";
import ChartPanel from "components/chart-panel";
import HeadSet from "components/head-set";
import { headerGradientTypes } from "components/header";
import HeaderStatus from "components/header-content/header-status";
import IncidentPanel from "components/incident-panel";
import PageTitle from "components/page-title";
import { useLayout } from "context/layout-context";
import useBreakpoints from "hooks/use-breakpoints";
import { compact, map, size, sortBy } from "lodash";
import { IIlumAlivePing, IIlumChart } from "models/backend/ilum-models";
import { IIncident } from "models/backend/incident-models";
import { IPage } from "models/page";
import type { NextPage } from "next";
import { FC, useEffect, useState } from "react";

interface HomeProps extends IPage {
  incidents: IIncident[];
  apiChart: IIlumChart | undefined;
  dashboardChart: IIlumChart | undefined;
  websiteChart: IIlumChart | undefined;
  shardPings: IIlumAlivePing[] | undefined;
}

const statusToClass = {
  Stable:
    "bg-[#16C172] text-lightText dark:text-lightText-darkMode dark:bg-[#16C172]/25 dark:border-2 dark:border-[#16C172]/60",
  Unstable:
    "bg-[#FC9E4F] text-lightText dark:text-lightText-darkMode dark:bg-[#FC9E4F]/25 dark:border-2 dark:border-[#FC9E4F]/60",
  Offline:
    "bg-[#FF5964] text-lightText dark:text-lightText-darkMode dark:bg-[#FF5964]/25 dark:border-2 dark:border-[#FF5964]/60",
  Unknown:
    "bg-[#3A2D32]/60 dark:bg-[#CC2936]/25 text-lightText dark:text-lightText-darkMode dark:border-2 dark:border-[#CC2936]/60",
};

const ShardPanel: FC<{
  shard: IIlumAlivePing;
}> = ({ shard }) => (
  <div
    className={`flex h-full w-full grow items-center justify-center whitespace-nowrap rounded-md border border-input-border p-2 px-3 text-center shadow-md ${
      shard.gateway_connected &&
      Date.now() - new Date(shard.updated_at).getTime() < 30000
        ? statusToClass.Stable
        : Date.now() - new Date(shard.updated_at).getTime() < 60000
        ? statusToClass.Unstable
        : statusToClass.Offline
    }`}
  >
    {shard.gateway_connected &&
    Date.now() - new Date(shard.updated_at).getTime() < 60000
      ? `Shard ${shard.shard_id} - ${shard.server_count} Servers`
      : `Shard ${shard.shard_id} - Offline`}
  </div>
);

const Status: NextPage<HomeProps> = ({
  incidents: ssgIncidents,
  apiChart: ssgApiChart,
  dashboardChart: ssgDashboardChart,
  websiteChart: ssgWebsiteChart,
  shardPings: ssgShardPings,
}) => {
  const layout = useLayout();
  const [ilumShards, setIlumShards] = useState<IIlumAlivePing[]>(
    ssgShardPings || []
  );
  const [ilumAPI, setIlumAPI] = useState<IIlumChart | undefined>(ssgApiChart);
  const [ilumDashboard, setIlumDashboard] = useState<IIlumChart | undefined>(
    ssgDashboardChart
  );
  const [ilumWebsite, setIlumWebsite] = useState<IIlumChart | undefined>(
    ssgWebsiteChart
  );
  const [incidents, setIncidents] = useState<IIncident[]>(ssgIncidents || []);
  const { isMd } = useBreakpoints();

  // create a function inside this next page that will be called every 10 seconds
  // this function will call the api and update the state of the page
  // this will allow the page to update without having to refresh the page
  // this will also allow the page to update without having to refresh the page
  // this will also allow the page to update without having to refresh the page

  useEffect(() => {
    layout.changeHeader(
      <HeaderStatus />,
      `blog`,
      undefined,
      undefined,
      size(incidents) > 0 ? headerGradientTypes.premium : undefined
    );
  }, []);

  const fetchIlumInfo = async () => {
    const getIlum = async () => {
      const [apiRes, dashboardRes, websiteRes, shardPingsRes, incidentRes] =
        await Promise.all([
          apiRoutes.ilum.getIlumAPIPing("backend"),
          apiRoutes.ilum.getIlumAPIPing("dashboard"),
          apiRoutes.ilum.getIlumAPIPing("website"),
          apiRoutes.ilum.getIlumShardAlivePings(),
          apiRoutes.incidents.getActiveIncidents(),
        ]);
      if (apiRes) setIlumAPI(apiRes);
      if (dashboardRes) setIlumDashboard(dashboardRes);
      if (websiteRes) setIlumWebsite(websiteRes);
      if (shardPingsRes) setIlumShards(shardPingsRes);
      if (shardPingsRes) setIlumShards(shardPingsRes);
      if (incidentRes && incidentRes.success) setIncidents(incidentRes.body);
    };
    getIlum();
  };

  useEffect(() => {
    fetchIlumInfo();
    const interval = setInterval(() => {
      fetchIlumInfo();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <HeadSet
        title="Status of XP Systems"
        description="Stay Up-to-Date on all XP related Services: All Information in One Convenient Location."
      />
      {size(incidents) > 0 && (
        <>
          <div className="flex flex-col gap-[2.5rem] pt-2">
            <div>
              <PageTitle disableArrow title="Maintenance in Progress" />
              <div className="flex flex-col gap-8 lg:flex-row lg:flex-wrap">
                {map(incidents, (incident) => (
                  <IncidentPanel
                    incident={incident}
                    key={`incident-panel-${incident.incidentID}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <hr className="mx-auto w-4/5" />
        </>
      )}

      <div>
        <PageTitle disableArrow title="Response Times" />
        <div className="flex flex-col gap-5 md:gap-10">
          <div className="flex w-full gap-5 md:gap-10">
            <ChartPanel
              title={isMd ? "API Response times in ms" : `XP API`}
              hideChart={!isMd}
              chartData={compact([
                ilumAPI
                  ? { ...ilumAPI, name: "API", color: "#3995D3" }
                  : undefined,
              ])}
            />
          </div>
          <div className="grid grid-cols-1 justify-center gap-5 md:grid-cols-2 md:gap-10">
            <ChartPanel
              hideChart
              title="Dashboard"
              chartData={compact([
                ilumDashboard
                  ? { ...ilumDashboard, name: "Dashboard", color: "#082F5F" }
                  : undefined,
              ])}
            />
            <ChartPanel
              hideChart
              title="Website"
              chartData={compact([
                ilumWebsite
                  ? { ...ilumWebsite, name: "Website", color: "#1161A0" }
                  : undefined,
              ])}
            />
          </div>
        </div>
      </div>
      {size(ilumShards) > 0 && (
        <div>
          <BasicPanel>
            <div className="grid grid-cols-1 flex-wrap gap-3 md:grid-cols-3 lg:grid-cols-4">
              {map(sortBy(ilumShards, "shard_id"), (shard) => (
                <ShardPanel shard={shard} />
              ))}
            </div>
          </BasicPanel>
        </div>
      )}
      {/*  Status Graphs */}
    </div>
  );
};

export async function getStaticProps() {
  try {
    const incidents = await apiRoutes.incidents.getActiveIncidents();

    const [apiChart, dashboardChart, websiteChart, shardPings] =
      await Promise.all([
        apiRoutes.ilum.getIlumAPIPing("backend"),
        apiRoutes.ilum.getIlumAPIPing("dashboard"),
        apiRoutes.ilum.getIlumAPIPing("website"),
        apiRoutes.ilum.getIlumShardAlivePings(),
      ]);
    return {
      props: {
        incidents: incidents.success ? sortBy(incidents.body, "createdAt") : [],
        apiChart,
        dashboardChart,
        websiteChart,
        shardPings,
      },
      revalidate: 10,
    };
  } catch (error) {
    return {
      notFound: true,
      revalidate: 10,
    };
  }
}

export default Status;
