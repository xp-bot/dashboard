import ButtonCluster from "components/button-cluster";
import Modal from "components/modal";
import { ToastItemType } from "components/toast-item";
import { isUndefined, map } from "lodash";
import { IInboxItem } from "models/backend/inbox-interfaces";
import { IPopupPayload } from "models/backend/socket-models";
import { FC, useEffect, useState } from "react";

import { useLayout } from "./layout-context";
import { useToast } from "./toast-context";
import { useUser } from "./user-context";

interface ISocketMangerProps {}

const SocketManager: FC<ISocketMangerProps> = () => {
  const [socketDisconnected, setSocketDisconnected] = useState<boolean>(true);
  const user = useUser();
  const layout = useLayout();
  const { toast } = useToast();
  const [devModal, setDevModal] = useState<IPopupPayload | undefined>();

  const handleUserRegister = () => {
    if (user.isLoggedIn && user.currentUser && socketDisconnected) {
      user.socketIO.currentSocket &&
        user.socketIO.currentSocket.emit(`registerID`, {
          userID: user.currentUser.discordUser.id,
        });
      setSocketDisconnected(false);
    }
  };

  const handleSocketEvents = () => {
    if (!user.socketIO.currentSocket) return;
    user.socketIO.currentSocket.on(
      `incoming_support_request`,
      (_payload: {
        supporterUserID: string;
        guildID: string;
        ticketID: string;
      }) => {
        null;
      }
    );
    user.socketIO.currentSocket.on(
      `dev_message_popup`,
      (payload: IPopupPayload) => {
        setDevModal(payload);
      }
    );

    user.socketIO.currentSocket.on("new-inbox-item", (item: IInboxItem) => {
      // TODO: Investigate why its not working
      // if (window.Notification.permission === "granted") {
      //   // eslint-disable-next-line no-new
      //   new window.Notification(`You have received a new message on XP!`, {
      //     body: item.body,
      //     tag: "new-inbox-item",
      //   });
      // }
      user.inbox.fetchInbox();
      toast({
        text: item.body || `You have received a new message!`,
        type: ToastItemType.NEW_MESSAGE,
        ttl: 5000,
        onClick: () => {
          layout.toggleInbox(true);
        },
      });
    });

    user.socketIO.currentSocket.on("disconnect", () => {
      setSocketDisconnected(true);
    });
  };

  useEffect(() => {
    handleSocketEvents();
  }, [user.socketIO.currentSocket]);

  useEffect(handleUserRegister, [user.isLoggedIn, socketDisconnected]);

  return (
    <>
      <Modal
        title={devModal?.title || ``}
        customKey={
          isUndefined(devModal) ? `closed-dev-modal` : `opened-dev-modal`
        }
        requestClose={() => {
          setDevModal(undefined);
        }}
        isOpen={!isUndefined(devModal)}
      >
        <div className="flex flex-col gap-5">
          {devModal?.content}
          {devModal?.buttons && (
            <ButtonCluster
              isInPanel
              buttons={map(devModal?.buttons, (button) => ({
                text: button.text,
                link: button.url,
              }))}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default SocketManager;
