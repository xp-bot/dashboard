import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRoutes } from "apis/api-helper";
import { useUser } from "context/user-context";
import { slice, startsWith, toLower } from "lodash";
import { IDiscordUserLookup } from "models/backend/discord-models";
import { IInboxItem, InboxItemType } from "models/backend/inbox-interfaces";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { avatarToURL } from "utils/discord-utils";

import FallBackImage from "./fallback-image";

interface IInboxItemProps {
  inboxItem: IInboxItem;
}

const InboxItem: FC<IInboxItemProps> = ({ inboxItem }) => {
  const [lookupUser, setLookupUser] = useState<
    IDiscordUserLookup | undefined
  >();
  const user = useUser();
  useEffect(() => {
    const fetchLookupUser = async () => {
      if (!inboxItem.from) return;
      const res = await apiRoutes.discord.lookupUser(inboxItem.from);
      if (!res.success) return;
      setLookupUser(res.body);
    };
    fetchLookupUser();
  }, [inboxItem]);

  const Subject = () => {
    switch (inboxItem.type) {
      case InboxItemType.BlogPostReply:
        return (
          <div className="flex flex-row items-center gap-2">
            {lookupUser && (
              <span className="h-4 w-4 shrink-0 overflow-hidden rounded-full">
                <FallBackImage
                  className="h-full w-full object-cover"
                  src={avatarToURL(lookupUser)}
                />
              </span>
            )}
            <p
              className={`text-sm opacity-75 ${
                startsWith(
                  lookupUser?.username,
                  toLower(slice(lookupUser?.username, 0, 1)[0])
                )
                  ? "-mt-0.5"
                  : ""
              } `}
            >
              {lookupUser?.username} replied to you:
            </p>
          </div>
        );
      default:
        return <p>{inboxItem.subject}</p>;
    }
  };

  return (
    <div
      className={`flex w-full flex-col justify-between rounded-md rounded-l-none border border-l-2 border-l-xpBlue bg-input transition ease-in-out dark:rounded-l-md dark:border-l dark:border-l-input-border dark:bg-input-darkMode ${
        inboxItem.read ? "opacity-50 hover:opacity-100" : ""
      }`}
    >
      <Link
        href={inboxItem.link || ""}
        className="flex flex-row items-center justify-between p-2 pb-3 pr-[18px] hover:bg-input-border/10"
      >
        <div className="flex flex-col gap-1">
          <Subject />
          <p className="line-clamp-2 italic">{inboxItem.body}</p>
        </div>
        <div>
          <FontAwesomeIcon icon={faAngleRight} />
        </div>
      </Link>
      <div className="p-2 pt-0">
        <div className="flex flex-row justify-end border-t px-2 pt-2">
          {inboxItem.read ? (
            <button
              onClick={() => {
                user.inbox.dismissInboxItem(inboxItem);
              }}
              className="text-sm italic underline opacity-50 transition ease-in-out hover:opacity-100"
            >
              Dismiss and Delete
            </button>
          ) : (
            <button
              onClick={() => {
                user.inbox.markInboxItemRead(inboxItem);
              }}
              className="text-sm italic underline opacity-50 transition ease-in-out hover:opacity-100"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxItem;
