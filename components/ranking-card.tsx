import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUser } from 'context/user-context';
import { useUserDetails } from 'context/user-details-context';
import { FC } from 'react';
import defaultBackground from 'utils/default-background';
import { avatarToURL } from 'utils/discord-utils';

import FallBackImage from './fallback-image';

const SVGText = (props: {
  leftPercent: number;
  topPercent: number;
  lightFont?: boolean;
  fontSize: number;
  fontWeight: number;
  fontFamily: 'Roboto' | 'Whitney Semibold';
  yAlign: number;
  children: string;
}) => (
  <div
    style={{ left: `${props.leftPercent}%`, top: `${props.topPercent}%` }}
    className={`absolute w-full resize ${
      props.lightFont ? `fill-white` : `fill-[#a7a9ab] opacity-50`
    }`}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y={props.yAlign}
        fontSize={props.fontSize}
        fontFamily={props.fontFamily}
        fontWeight={props.fontWeight}
      >
        {props.children}
      </text>
    </svg>
  </div>
);

interface RankingCardProps {}

const RankingCard: FC<RankingCardProps> = () => {
  const user = useUser();
  const userDetails = useUserDetails();
  return (
    <>
      {userDetails.tempRankingCard.tempRankingCardImage ? (
        <div
          id="RankingCapture"
          className="absolute top-[-2000px] left-[-2000px] h-[351px] w-[450px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              userDetails.tempRankingCard.tempRankingCardImage &&
              userDetails.tempRankingCard.tempRankingCardImage
            })`,
          }}
        ></div>
      ) : (
        <></>
      )}
      <div
        className={`relative flex w-fit max-w-full overflow-hidden rounded-md bg-panelBack p-4 shadow-md dark:bg-panelBack-darkMode`}
      >
        <div className="flex w-full flex-col gap-3">
          <h2 className="m-0 inline-block text-[17px]">Preview</h2>
          <div className="lg:p-3">
            {/* Background */}
            <div className="group relative flex aspect-[450/351] w-[450px] max-w-full flex-col overflow-hidden rounded-lg bg-[#18181c]">
              {/* Top Image */}
              <div className="flex h-[23.08%] w-full shrink-0 grow-0 items-center overflow-hidden">
                {userDetails.rankingBackground &&
                userDetails.tempRankingCard.tempRankingCardImage ? (
                  !userDetails.currentXPUser?.settings.background.canvas && (
                    <div className="aspect-[450/351] w-full">
                      <FallBackImage
                        className="h-full w-full object-cover"
                        src={
                          userDetails.tempRankingCard.tempRankingCardImage || ``
                        }
                      />
                    </div>
                  )
                ) : (
                  <div className="h-full w-full">
                    <FallBackImage
                      className="h-full w-full object-cover"
                      src={(() => {
                        if (
                          userDetails.rankingBackground &&
                          userDetails.currentXPUser?.settings.background.custom
                        ) {
                          if (
                            userDetails.currentXPUser?.settings.background
                              .canvas
                          )
                            return `data:image/png;base64,${userDetails.rankingBackground?.big.top}`;
                          return `data:image/png;base64,${userDetails.rankingBackground?.small}`;
                        }
                        return defaultBackground.small;
                      })()}
                    />
                  </div>
                )}
              </div>
              {/* Bottom Image */}
              <div className="h-full w-full">
                {userDetails.rankingBackground &&
                  userDetails.currentXPUser?.settings.background.custom &&
                  !userDetails.tempRankingCard.tempRankingCardImage &&
                  userDetails.currentXPUser?.settings.background.canvas && (
                    <div className="h-full w-full">
                      <FallBackImage
                        className="h-full w-full object-cover"
                        src={`data:image/png;base64,${userDetails.rankingBackground?.big.bottom}`}
                      />
                    </div>
                  )}
              </div>
              {/* Upload Image */}
              {userDetails.tempRankingCard.tempRankingCardImage &&
                userDetails.rankingBackground &&
                userDetails.currentXPUser?.settings.background.canvas && (
                  <div className="absolute h-full w-full">
                    <FallBackImage
                      className="absolute h-full w-full object-cover"
                      src={
                        userDetails.tempRankingCard.tempRankingCardImage || ``
                      }
                    />
                  </div>
                )}

              {/* Overlay */}
              <div
                style={{
                  backdropFilter: `blur(${userDetails.currentXPUser?.settings.background.blur}px)`,
                }}
                className="absolute bottom-0 h-[76.92%] w-full rounded-b-lg bg-[#18181cd9]"
              />
              {/* Hover Overlay */}
              <div
                onClick={() => {
                  userDetails.rankingBackground &&
                    userDetails.tempRankingCard.initTempRankingCardImageUpload();
                }}
                className="group absolute z-30 flex h-full w-full cursor-pointer flex-col items-center justify-center bg-[rgba(24,24,28,0.5)] opacity-0 backdrop-saturate-50 transition ease-in-out hover:opacity-100"
              >
                <div className="flex flex-col gap-2 text-lightText transition ease-in-out group-hover:scale-105 group-active:scale-95 dark:bg-lightText-darkMode">
                  <FontAwesomeIcon icon={faPen} />
                  <span className="font-WhitneySemibold font-bold">
                    Upload Image
                  </span>
                </div>
              </div>
              {/* Avatar Image */}
              <FallBackImage
                className="absolute left-[7.78%] top-[9.97%] z-20 aspect-square w-[26.67%] rounded-full shadow-rankingAvater"
                src={avatarToURL(user.currentUser?.discordUser, 256)}
              />
              {/* Text */}
              <>
                <SVGText
                  fontFamily="Whitney Semibold"
                  fontSize={33.3}
                  leftPercent={5.56}
                  topPercent={48.72}
                  yAlign={37.3}
                  lightFont
                  fontWeight={400}
                >
                  {user.currentUser?.discordUser.username || `Unknown`}
                </SVGText>
                {user.currentUser?.premium.userPremium && (
                  <SVGText
                    fontFamily="Roboto"
                    fontSize={12.8}
                    leftPercent={5.56}
                    topPercent={60.11}
                    yAlign={14}
                    fontWeight={400}
                  >
                    XP Premium
                  </SVGText>
                )}
                <SVGText
                  fontFamily="Roboto"
                  fontSize={66.7}
                  leftPercent={4.44}
                  topPercent={68.66}
                  yAlign={73}
                  fontWeight={300}
                  lightFont
                >
                  LEVEL 25
                </SVGText>
                <SVGText
                  fontFamily="Roboto"
                  fontSize={12.8}
                  leftPercent={5.56}
                  topPercent={88.6}
                  yAlign={14}
                  fontWeight={400}
                >
                  32.711 XP
                </SVGText>
              </>

              <div className="absolute bottom-0 h-[.57%] w-[35%] bg-xpBlue" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RankingCard;
