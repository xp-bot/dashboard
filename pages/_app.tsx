import '@styles/globals.scss';
import '@styles/checkmark.scss';
import '@styles/xp-loading.scss';
import '../styles/markdown.scss';

import { Inter } from '@next/font/google';
import { apiRoutes } from 'apis/api-helper';
import FallBackImage from 'components/fallback-image';
import Modal from 'components/modal';
import { LayoutContextProvider } from 'context/layout-context';
import SocketManager from 'context/socket-manager';
import { useLocalStorage } from 'hooks/use-local-storage';
import {
  entries,
  forEach,
  isEmpty,
  isEqual,
  isNil,
  keys,
  last,
  map,
  size,
} from 'lodash';
import { IDiscordUserLookup } from 'models/backend/discord-models';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import semver from 'semver';
import { avatarToURL } from 'utils/discord-utils';

import changelog, { ChangelogType } from '../changelogs';
import MobileNavBar from '../components/mobile/mobile-nav-bar';
import WavePage from '../components/wave-page';
import { UserContextProvider } from '../context/user-context';

const inter = Inter({
  variable: '--inter-font',
  subsets: ['latin', 'cyrillic', 'greek'],
});

const SubmitterUser: FC<{ user_id: string }> = ({ user_id }) => {
  const [user, setUser] = useState<IDiscordUserLookup | undefined>();
  useEffect(() => {
    const getUser = async () => {
      const res = await apiRoutes.discord.lookupUser(user_id);

      if (!res.success) return;

      setUser(res.body);
    };

    getUser();
  }, []);

  return (
    <span className="relative inline-flex w-fit flex-row items-center gap-2 overflow-hidden rounded-md border bg-input text-sm text-darkText shadow-md transition-colors ease-in-out hover:bg-input-border dark:border-none dark:bg-input-darkMode dark:text-darkText-darkMode dark:hover:bg-input-border">
      {user && (
        <span className="aspect-square w-7 overflow-hidden">
          <FallBackImage
            className="h-full w-full object-cover"
            src={avatarToURL(user, 128, true)}
          />
        </span>
      )}
      <span className="pr-3">
        <span className="absolute -right-1 -top-8 text-5xl opacity-[.03] blur-[1px] dark:blur-0">
          @
        </span>
        <p>
          {user ? (
            <>
              {user.username}
              <span className="opacity-50">#{user.discriminator}</span>
            </>
          ) : (
            user_id
          )}
        </p>
      </span>
    </span>
  );
};

const ChangelogModal = () => {
  const [localStorage, setLocalStorage, isLocalStorageReady] = useLocalStorage([
    `last_version`,
  ]);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionChanges, setVersionChanges] = useState<ChangelogType>({});
  const envVersion = last(keys(changelog)) || '0.0.0';

  useEffect(() => {
    if (!localStorage || !isLocalStorageReady) return;

    const localVersion = localStorage.last_version;

    if (isNil(localVersion) || isEmpty(localVersion)) {
      setLocalStorage(`last_version`, envVersion);
      return;
    }

    if (
      isNil(localStorage.last_version) ||
      (envVersion && localVersion && semver.ltr(localVersion, envVersion))
    ) {
      const visibleChanges: ChangelogType = {};

      forEach(entries(changelog), ([version, changes]) => {
        semver.ltr(localVersion, version) &&
          forEach(
            entries(changes),
            // eslint-disable-next-line no-return-assign
            ([name, change]) => {
              visibleChanges[name] = [
                ...(visibleChanges ? visibleChanges[name] || [] : []),
                ...change,
              ];
            }
          );
      });

      setVersionChanges(visibleChanges);
      setVersionModalOpen(true);
    } else {
      setVersionModalOpen(false);
    }
  }, [localStorage.last_version, isLocalStorageReady]);

  return (
    <Modal
      customKey="changelog"
      isOpen={versionModalOpen}
      requestClose={() => {
        setLocalStorage('last_version', envVersion);
        setVersionModalOpen(false);
      }}
      title={`Changelog ${
        localStorage.last_version ? `from v${localStorage.last_version} to` : ``
      } v${envVersion}`}
    >
      <div className="flex flex-col gap-5">
        {map(entries(versionChanges), ([title, changePart], idx) => {
          return (
            <div
              className="flex flex-col gap-5"
              key={`changelog-modal-version-${title}`}
            >
              <div>
                <h2>{title}</h2>
                <ul className="flex flex-col gap-2">
                  {map(changePart, (change, idxx) => {
                    return change.type === 'image' ? (
                      <div
                        key={`changelog-modal-version-change-${change.type}-${idxx}`}
                        className="my-5 px-5 py-2 pt-0"
                      >
                        <div className="h-fit w-fit overflow-hidden rounded-md drop-shadow-md md:mx-auto">
                          <FallBackImage
                            className="hidden w-fit object-contain md:flex md:max-h-80"
                            src={change.content.pc}
                          />
                          <FallBackImage
                            className="object-contain md:hidden"
                            src={change.content.mobile || change.content.pc}
                          />
                        </div>
                      </div>
                    ) : (
                      <li
                        key={`changelog-modal-version-change-hr-${idxx}`}
                        className="ml-5 list-disc"
                      >
                        <div className="flex flex-col gap-2">
                          <p>{change.content}</p>
                          {change.submitter_id && change.submit_type && (
                            <>
                              <SubmitterUser user_id={change.submitter_id} />
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {idx + 1 < size(entries(versionChanges)) && (
                <hr className="mx-auto w-4/5 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <ThemeProvider attribute="class">
        <UserContextProvider>
          {/* {isEqual(router.asPath, `/`) ? (
            <Component {...pageProps} />
          ) : ( */}
          <div
            className={`h-fit min-h-[100vh] overflow-hidden ${
              isEqual(router.asPath, `/`) || isEqual(router.asPath, `/premium`)
                ? `pb-20 lg:pb-0`
                : `pb-20`
            } ${inter.variable}`}
          >
            <LayoutContextProvider>
              <SocketManager />
              <WavePage>
                <Component {...pageProps} />
                <ChangelogModal />
              </WavePage>
            </LayoutContextProvider>
            <MobileNavBar />
          </div>
          {/* )} */}
        </UserContextProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
