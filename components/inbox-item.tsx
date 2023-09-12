import { apiRoutes } from "apis/api-helper";
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
              <span className="h-4 w-4 overflow-hidden rounded-full">
                <FallBackImage
                  className="h-full w-full object-cover"
                  src={avatarToURL(lookupUser)}
                />
              </span>
            )}
            <p className="text-sm opacity-75">
              {lookupUser?.username} replied to you:
            </p>
          </div>
        );
      default:
        return <p>{inboxItem.subject}</p>;
    }
  };

  return (
    <Link className="w-full" href={inboxItem.link || ""}>
      <div className="flex flex-col gap-1 rounded-md border bg-input py-2 pl-2 transition ease-in-out dark:bg-input-darkMode">
        <Subject />
        <p className="line-clamp-2 italic">{inboxItem.body}</p>
      </div>
    </Link>
  );
};

export default InboxItem;
