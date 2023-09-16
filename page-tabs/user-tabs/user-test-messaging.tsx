// eslint-disable-next-line import/no-cycle

import { faBreadSlice } from "@fortawesome/free-solid-svg-icons";
import ButtonCluster, { ButtonFeature } from "components/button-cluster";
import PageTitle from "components/page-title";
import { ToastItemType } from "components/toast-item";
import { useToast } from "context/toast-context";
import { FC } from "react";

interface UserTabTestMessagingProps {
  tabPath: string;
}

const UserTabTestMessaging: FC<UserTabTestMessagingProps> = () => {
  const { toast } = useToast();

  return (
    <>
      <div className="flex flex-col gap-5">
        <div>
          <PageTitle title="Test Toasts" />
          <div className="flex flex-col gap-5">
            <ButtonCluster
              buttons={[
                {
                  text: "Test Success",
                  icon: faBreadSlice,
                  onClick: () => {
                    toast({ text: "Test Toast", type: ToastItemType.SUCCESS });
                  },
                  feature: ButtonFeature.save,
                },
                {
                  text: "Test Warning",
                  icon: faBreadSlice,
                  onClick: () => {
                    toast({ text: "Test Toast", type: ToastItemType.WARNING });
                  },
                },
                {
                  text: "Test Failure",
                  icon: faBreadSlice,
                  onClick: () => {
                    toast({ text: "Test Toast", type: ToastItemType.ERROR });
                  },
                  feature: ButtonFeature.danger,
                },
                {
                  text: "Test Incoming Message",
                  icon: faBreadSlice,
                  onClick: () => {
                    toast({
                      text: "Test Message Toast",
                      type: ToastItemType.NEW_MESSAGE,
                    });
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTabTestMessaging;
