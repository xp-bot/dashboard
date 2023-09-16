// eslint-disable-next-line import/no-cycle

import { faRemove, faSave } from "@fortawesome/free-solid-svg-icons";
import { apiRoutes } from "apis/api-helper";
import AnimatedDivList from "components/animated-div-list";
import BansListPanel from "components/bans-list-panel";
import ButtonCluster, { ButtonFeature } from "components/button-cluster";
import Modal from "components/modal";
import ModulePanel from "components/module-panel";
import MultilineInput from "components/multiline-input";
import PageTitle from "components/page-title";
import PanelInput from "components/panel-input";
import { ToastItemType } from "components/toast-item";
import { useToast } from "context/toast-context";
import { isEmpty, isEqual, isUndefined, map } from "lodash";
import { IXPDBUserBan } from "models/backend/xp-models";
import { FC, useEffect, useState } from "react";

interface UserTabBansProps {
  tabPath: string;
}

const UserTagBans: FC<UserTabBansProps> = () => {
  const [banModal, setBanModal] = useState<Partial<IXPDBUserBan> | undefined>();
  const [setupID, setSetupID] = useState<string | undefined>();
  const [bans, setBans] = useState<IXPDBUserBan[]>([]);
  const { toast } = useToast();
  const recieveBans = async () => {
    setBanModal(undefined);
    setSetupID(undefined);
    const res = await apiRoutes.bans.getAllUserBans();
    if (!res.success) return;
    setBans(res.body);
  };

  useEffect(() => {
    recieveBans();
  }, []);

  const saveBanModal = async () => {
    if (
      !banModal?.userID ||
      (isEqual(banModal.userID, `setup`) && isEmpty(setupID))
    )
      return;
    const id = isEqual(banModal.userID, `setup`) ? setupID : banModal?.userID;
    if (!id) return;
    const res = await apiRoutes.bans.patchUsersBans(id, {
      types: banModal?.content?.types || { rankingcard: false },
      notes: banModal?.content?.notes,
    });
    if (!res.success) {
      toast({ text: "Failed to save ban.", type: ToastItemType.ERROR });
      return;
    }
    toast({ text: "Successfully saved ban.", type: ToastItemType.SUCCESS });
    recieveBans();
  };

  const deleteBanModal = async () => {
    if (!banModal?.userID) return;
    const res = await apiRoutes.bans.deleteUsersBans(banModal?.userID);
    if (!res.success) {
      toast({ text: "Failed to reset ban.", type: ToastItemType.ERROR });
      return;
    }
    toast({ text: "Successfully reset ban.", type: ToastItemType.SUCCESS });
    recieveBans();
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div>
          <PageTitle title="User Bans" />
          <div className="flex flex-col gap-5">
            <AnimatedDivList emptyMessage="There are no banned users yet.">
              {map(bans, (ban) => {
                return {
                  key: `BannedUser-List-${ban.userID}`,
                  element: (
                    <div className="flex w-full flex-col items-center gap-5">
                      <BansListPanel
                        requestModify={() => {
                          setBanModal(ban);
                        }}
                        ban={ban}
                      />
                    </div>
                  ),
                };
              })}
            </AnimatedDivList>
          </div>
        </div>
        <div>
          <PageTitle disableArrow title="Create Bans" />
          <ButtonCluster
            buttons={[
              {
                text: `Create Ban`,
                onClick: () => {
                  setBanModal({ userID: `setup` });
                },
              },
            ]}
          />
        </div>
      </div>
      <Modal
        title={
          isEqual(banModal?.userID, `setup`)
            ? `Create Ban`
            : `Modify ${banModal?.userID}`
        }
        customKey={`modify-ban-modal-${banModal?.userID}`}
        isOpen={!isUndefined(banModal)}
        requestClose={() => {
          setBanModal(undefined);
        }}
      >
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <PanelInput
              disabled={!isEqual(banModal?.userID, `setup`)}
              value={
                isEqual(banModal?.userID, `setup`) ? `` : banModal?.userID || ``
              }
              onChange={(e) => {
                setSetupID(e.target.value);
              }}
              label="User ID"
            />
            <MultilineInput
              value={banModal?.content?.notes || ``}
              onChange={(e) => {
                setBanModal({
                  ...banModal,
                  content: {
                    types: { ...banModal?.content?.types },
                    notes: e.target.value || undefined,
                  },
                });
              }}
              label="Internal Info"
            />
            <ModulePanel
              checked={banModal?.content?.types.rankingcard || false}
              onChange={(v) => {
                setBanModal({
                  ...banModal,
                  content: {
                    ...banModal?.content,
                    types: { ...banModal?.content?.types, rankingcard: v },
                  },
                });
              }}
              isInPanel
              moduleName="Ranking Cards"
              moduleDescription="Enabling this will result in the user not being able to edit their RankingCard Background anymore."
            />
            <ModulePanel
              checked={banModal?.content?.types.dashboard_login || false}
              onChange={(v) => {
                setBanModal({
                  ...banModal,
                  content: {
                    ...banModal?.content,
                    types: { ...banModal?.content?.types, dashboard_login: v },
                  },
                });
              }}
              isInPanel
              moduleName="Prohibit Login"
              moduleDescription="By enabling this feature, the user will be prevented from logging into the dashboard."
            />
            <ModulePanel
              checked={
                banModal?.content?.types.dashboard_blog_comment_create || false
              }
              onChange={(v) => {
                setBanModal({
                  ...banModal,
                  content: {
                    ...banModal?.content,
                    types: {
                      ...banModal?.content?.types,
                      dashboard_blog_comment_create: v,
                    },
                  },
                });
              }}
              isInPanel
              moduleName="Prohibit Posting blog Comment"
              moduleDescription="By enabling this feature, the user will be prevented from logging into the dashboard."
            />
          </div>
          <ButtonCluster
            isInPanel
            buttons={[
              ...(!isEqual(banModal?.userID, `setup`)
                ? [
                    {
                      text: `Reset Bans`,
                      feature: ButtonFeature.danger,
                      icon: faRemove,
                      onClick: deleteBanModal,
                    },
                  ]
                : []),
              { text: `Save Bans`, onClick: saveBanModal, icon: faSave },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default UserTagBans;
