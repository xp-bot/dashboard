import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'hooks/use-media-query';
import { isUndefined } from 'lodash';
import React, { useRef, useState } from 'react';
import { captureRankingBackground } from 'utils/image-utils';

import { apiRoutes } from '../apis/api-helper';
import { IXPBackground, IXPUser } from '../models/backend/xp-models';
import { useUser } from './user-context';

interface IUserDetailsContextValues {
  currentXPUser?: IXPUser;
  updateUser: (user: IXPUser) => Promise<boolean>;
  unsavedChanges: boolean;
  savingInProgress: boolean;
  fetchRankingBackground: () => Promise<boolean>;
  rankingBackground?: IXPBackground;
  tempRankingCard: {
    initTempRankingCardImageUpload: () => void;
    uploadingTempRankingCardImage: boolean;
    tempRankingCardImage?: string;
  };
}

export const UserDetailsContext =
  React.createContext<IUserDetailsContextValues>({
    updateUser: async () => false,
    unsavedChanges: false,
    savingInProgress: false,
    fetchRankingBackground: async () => false,
    tempRankingCard: {
      uploadingTempRankingCardImage: false,
      initTempRankingCardImageUpload: () => false,
    },
  });

interface IUserDetailsContextProviderProps {
  children: JSX.Element[] | JSX.Element;
}

export function UserDetailsContextProvider({
  children,
}: IUserDetailsContextProviderProps): React.ReactElement {
  const userContext = useUser();
  const isLg = useMediaQuery('(min-width: 900px)');

  const [currentXPUser, setCurrentXPUser] = useState<IXPUser | undefined>();

  const [uploadingTempRankingCardImage, setUploadingTempRankingCardImage] =
    useState(false);
  const [unsavedTempRankingCardImage, setUnsavedTempRankingCardImage] =
    useState(false);
  const [tempRankingCardImage, setTempRankingCardImage] = useState<
    string | undefined
  >();
  const tempRankingCardImageUploadButton = useRef<HTMLInputElement>(null);
  const [savingInProgress, setSavingInProgress] = useState(false);

  const [rankingBackground, setRankingBackground] = useState<IXPBackground>();

  async function updateUser(user: IXPUser): Promise<boolean> {
    if (userContext.isLoggedIn) {
      setCurrentXPUser(user);

      return true;
    }
    return false;
  }

  async function fetchRankingBackground(): Promise<boolean> {
    if (rankingBackground) return true;
    if (userContext.isLoggedIn) {
      const res = await apiRoutes.xp.me.background.get();
      if (res.success) {
        setRankingBackground(res.body);
        return true;
      }
    }
    return false;
  }

  async function saveUser() {
    setSavingInProgress(true);
    try {
      if (unsavedTempRankingCardImage) {
        setUploadingTempRankingCardImage(true);
        const uploadBGRes = await apiRoutes.xp.me.background.post({
          image: (await captureRankingBackground())?.toDataURL() || ``,
        });
        if (uploadBGRes.success) {
          setUnsavedTempRankingCardImage(false);
        }
        setUploadingTempRankingCardImage(false);
      }
      if (!isUndefined(currentXPUser)) {
        const update = await userContext.updateUser(currentXPUser);
        if (update) {
          setCurrentXPUser(undefined);
        }
        setSavingInProgress(false);
      }
    } catch {
      setSavingInProgress(false);
    }
  }

  // useNavigationLock(!isUndefined(currentXPUser), undefined, () => {
  //   setCurrentXPUser(undefined);
  // });

  return (
    <UserDetailsContext.Provider
      value={{
        rankingBackground,
        currentXPUser: currentXPUser || userContext.currentUser?.xpUser,
        fetchRankingBackground,
        unsavedChanges: !isUndefined(currentXPUser),
        savingInProgress,
        updateUser,
        tempRankingCard: {
          initTempRankingCardImageUpload: () => {
            if (tempRankingCardImageUploadButton?.current)
              tempRankingCardImageUploadButton.current.click();
          },
          uploadingTempRankingCardImage,
          tempRankingCardImage,
        },
      }}
    >
      <>
        {children}
        <input
          type="file"
          id="upload-button"
          ref={tempRankingCardImageUploadButton}
          style={{ display: 'none' }}
          accept={`.png,.jpg`}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const img = e.target.files[0];
              if (img.type === `image/png` || img.type === `image/jpeg`) {
                setTempRankingCardImage(URL.createObjectURL(img));
                setUnsavedTempRankingCardImage(true);
              }
            }
          }}
        />

        <motion.div
          initial={{ y: '4rem', opacity: 0 }}
          animate={
            !isUndefined(currentXPUser) || unsavedTempRankingCardImage
              ? { y: isLg ? '-2rem' : '-8rem', opacity: 1 }
              : { y: '4rem', opacity: 0 }
          }
          className={`pointer-events-none fixed left-0 bottom-0 z-30 flex h-20 w-full justify-center`}
        >
          <div className={`container mx-auto box-border px-10`}>
            <div className={`relative h-full w-full`}>
              <div
                onClick={() => {
                  saveUser();
                }}
                className="pointer-events-auto absolute right-0 bottom-0 flex h-14 w-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-green-500 p-3 px-5 text-lg ring-green-600/25 drop-shadow-lg transition ease-in-out active:bg-green-600 active:ring lg:right-5 lg:h-10 lg:w-fit lg:text-base lg:hover:-translate-y-1"
              >
                <FontAwesomeIcon icon={faSave} />
                {isLg && ` Save Profile`}
              </div>
            </div>
          </div>
        </motion.div>
        {/* <div
          className={`${
            !isUndefined(currentXPUser) || unsavedTempRankingCardImage
              ? `-translate-y-20 lg:-translate-y-5`
              : `translate-y-16 opacity-0`
          } fixed bottom-0 z-30 flex w-full justify-center transition ease-in-out`}
        >
          <div className={`container w-full shadow-md lg:w-80`}>
            <ButtonCluster
              buttons={[
                {
                  onClick: () => {
                    saveUser();
                  },
                  text: `Save Profile`,
                  feature: ButtonFeature.save,
                  icon: faSave,
                },
              ]}
            />
          </div>
        </div> */}
      </>
    </UserDetailsContext.Provider>
  );
}

export const useUserDetails = (): IUserDetailsContextValues =>
  React.useContext(UserDetailsContext);
