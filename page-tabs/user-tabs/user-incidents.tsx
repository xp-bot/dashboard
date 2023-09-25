// eslint-disable-next-line import/no-cycle

import { faAdd, faCancel, faSave } from "@fortawesome/free-solid-svg-icons";
import { apiRoutes } from "apis/api-helper";
import ButtonCluster from "components/button-cluster";
import IncidentPanel from "components/incident-panel";
import Modal from "components/modal";
import MultilineInput from "components/multiline-input";
import PageTitle from "components/page-title";
import PanelInput from "components/panel-input";
import Select from "components/select";
import {
  compact,
  isEqual,
  isUndefined,
  join,
  map,
  replace,
  split,
} from "lodash";
import { IIncident, IIncidentContent } from "models/backend/incident-models";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface UserTabIncidentsProps {
  tabPath: string;
}

interface IInputProps {
  status: string;
  title: string;
  message: string;
  affected: string;
  updateMessage: string;
}

const UserTabIncidents: FC<UserTabIncidentsProps> = () => {
  const [editIncident, setEditIncident] = useState<
    Partial<IIncident> | undefined
  >();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IInputProps>();

  const [editIncidentModalOpened, setEditIncidentModalOpened] = useState(false);
  const [incidents, setIncidents] = useState<IIncident[]>([]);
  const recieveIncidents = async () => {
    setEditIncident(undefined);
    setEditIncidentModalOpened(false);
    const res = await apiRoutes.incidents.getActiveIncidents();
    if (!res.success) return;
    setIncidents(res.body);
  };

  const createComment: SubmitHandler<IInputProps> = async (data) => {
    if (
      editIncident &&
      editIncident.incidentID &&
      isEqual(data.status, `Resolved`)
    ) {
      await apiRoutes.incidents.resolveIncident(editIncident.incidentID);
      setEditIncidentModalOpened(false);
      setEditIncident(undefined);
      recieveIncidents();
      return;
    }
    const newIncidentObject: IIncidentContent = {
      title: (editIncident ? editIncident.content?.title : data.title) || ``,
      message:
        (editIncident ? editIncident.content?.message : data.message) || ``,
      affected: editIncident
        ? editIncident.content?.affected || []
        : split(
            replace(replace(data.affected || ``, /(, )/gm, `,`), /( ,)/gm, `,`),
            `,`
          ),
      status: data.status || ``,
      updates: [
        ...(editIncident ? editIncident.content?.updates || [] : []),
        {
          message: `${data.updateMessage}`,
          status: data.status || ``,
          timestamp: Date.now(),
        },
      ],
    };

    if (isUndefined(editIncident))
      await apiRoutes.incidents.putIncident(newIncidentObject);
    else if (editIncident.incidentID)
      await apiRoutes.incidents.postIncident(
        newIncidentObject,
        editIncident.incidentID
      );

    setEditIncidentModalOpened(false);
    setEditIncident(undefined);
    recieveIncidents();
  };

  useEffect(() => {
    recieveIncidents();
  }, []);

  useEffect(() => {
    if (editIncident) {
      setValue(`title`, editIncident.content?.title || ``);
      setValue(`message`, editIncident.content?.message || ``);
      setValue(`affected`, join(editIncident.content?.affected, `, `) || ``);
      setValue(`updateMessage`, ``);
      setValue(
        `status`,
        editIncident.content?.status || `Degraded Performance`
      );
    } else {
      setValue(`title`, ``);
      setValue(`message`, ``);
      setValue(`affected`, ``);
      setValue(`updateMessage`, ``);
      setValue(`status`, `Degraded Performance`);
    }
  }, [editIncident, editIncidentModalOpened]);

  useEffect(() => {
    if (isEqual(watch(`status`), `Resolved`) && editIncident) {
      setValue(`updateMessage`, `This Issue has been resolved!`);
    }
  }, [watch(`status`)]);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div>
          <PageTitle title="Incidents" />
          <div className="flex flex-col gap-5">
            {map(incidents, (incident) => {
              return (
                <div
                  key={`incident-${incident.incidentID}`}
                  onClick={() => {
                    setEditIncident(incident);
                    setEditIncidentModalOpened(true);
                  }}
                  className="cursor-pointer transition ease-in-out hover:-translate-y-1"
                >
                  <div className="pointer-events-none">
                    <IncidentPanel forceClosed incident={incident} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <PageTitle disableArrow title="Create Incident" />
          <ButtonCluster
            buttons={[
              {
                text: `Create Incident`,
                icon: faAdd,
                onClick: () => {
                  setEditIncident(undefined);
                  setEditIncidentModalOpened(true);
                },
              },
            ]}
          />
        </div>
      </div>
      <Modal
        title={
          isUndefined(editIncident)
            ? `Create Incident`
            : `Modify ${editIncident.incidentID}`
        }
        customKey={`modify-ban-modal-${
          isUndefined(editIncident) ? `create` : editIncident?.incidentID
        }`}
        isOpen={editIncidentModalOpened}
        requestClose={() => {
          setEditIncident(undefined);
          setEditIncidentModalOpened(false);
        }}
      >
        <form
          onSubmit={handleSubmit(createComment)}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-5">
            <PanelInput
              registerForm={register(`title`, {
                required: `This is required.`,
              })}
              formError={errors.title}
              disabled={!isUndefined(editIncident)}
              value={
                isUndefined(editIncident)
                  ? ``
                  : editIncident.content?.title || ``
              }
              label="Title"
            />
            <PanelInput
              registerForm={register(`message`, {
                required: `This is required.`,
              })}
              formError={errors.message}
              placeholder="Short, general description of the issue."
              disabled={!isUndefined(editIncident)}
              value={
                isUndefined(editIncident)
                  ? ``
                  : editIncident.content?.message || ``
              }
              label="Description"
            />
            <PanelInput
              registerForm={register(`affected`, {
                required: `This is required.`,
              })}
              placeholder="Seperate with commas."
              formError={errors.affected}
              disabled={!isUndefined(editIncident)}
              value={
                isUndefined(editIncident)
                  ? ``
                  : join(editIncident.content?.affected, `, `) || ``
              }
              label="Affected Services"
            />
            <hr className="mx-auto my-3 w-4/5" />
            <MultilineInput
              value=""
              disabled={isEqual(watch(`status`), `Resolved`)}
              placeholder="Give the user an idea of what we're going to do."
              registerForm={register(`updateMessage`, {
                required: `This is required.`,
              })}
              formError={errors.updateMessage}
              label="What is going to happen / What are we doing?"
            />
            <Select
              registerForm={register(`status`, {
                required: `This is required.`,
              })}
              isInPanel
              formError={errors.status}
              options={compact([
                { id: `Degraded Performance`, title: `Degraded Performance` },
                { id: `Maintenance`, title: `Maintenance` },
                { id: `Planned Maintenance`, title: `Planned Maintenance` },
                { id: `Investigating`, title: `Investigating` },
                { id: `Implementing Fix`, title: `Implementing Fix` },
                { id: `Reverting Patch`, title: `Reverting Patch` },
                ...(editIncident
                  ? [{ id: `Resolved`, title: `Resolved` }]
                  : [undefined]),
              ])}
            />
          </div>
          <ButtonCluster
            isInPanel
            buttons={[
              {
                text: `Cancel`,
                onClick: () => {
                  setEditIncident(undefined);
                  setEditIncidentModalOpened(false);
                },
                icon: faCancel,
              },
              { text: `Save`, submitType: true, icon: faSave },
            ]}
          />
        </form>
      </Modal>
    </>
  );
};

export default UserTabIncidents;
