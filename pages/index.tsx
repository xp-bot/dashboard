import BlockButton, { BlockButtonVariant } from "components/block-button";
import FallBackImage from "components/fallback-image";
import HeaderIndex from "components/header-content/header-index";
import IndexEmpBG from "components/index-emp-bg";
import IndexHighlight from "components/index-panel";
import Modal from "components/modal";
import { ThinArrowDown } from "components/svg/arrows";
import { useLayout } from "context/layout-context";
import { useUser } from "context/user-context";
import useBreakpoints from "hooks/use-breakpoints";
import { isUndefined, map } from "lodash";
// import { useFlags } from 'flags/client';
import type { NextPage } from "next";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

import HeadSet from "../components/head-set";
import { IPage } from "../models/page";

const highlights: {
  title: string;
  description: string | ReactNode;
  image?: string;
  imageRight?: boolean;
}[] = [
  {
    title: "Your Server - Your Choice",
    description:
      "With XP, you have complete control over what you see and use. Whether it's MessageXP, a specific command, or the entire Leaderboard, the choice is yours.",
    image: "https://qwq.sh/9zx2dg",
  },
  {
    title: "Stay in control - always",
    description:
      "XP is highly customizable, with the ability to adjust almost every aspect to fit the needs of your unique community.",
    image: "https://qwq.sh/rfnvqh",
    imageRight: true,
  },
  {
    title: "Reward Users - Keep Users",
    description:
      "Award and recognize your users' achievements with XP's automatic role assignment. As users reach specific milestones, XP assigns designated roles, making it easy to acknowledge and celebrate their growth within your community.",
    image: "https://qwq.sh/tbdlz3",
  },
  {
    title: "Embrace uniqueness",
    description:
      "Ranking Cards are the ultimate tool for your users to express their personality in your community.",
    image: "https://qwq.sh/aymj7o",
    imageRight: true,
  },
  {
    title: "Stay competitive",
    description:
      "XP is the perfect tool to get your users to spend more time on your Community.",
    image: "https://qwq.sh/b5ymys",
  },
  // {
  //   title: "Keep it confined",
  //   description:
  //     "Are you planning on running an event confined to a couple of channels or have a channel you'd like to ignore? No problem, just ignore it!",
  //   image: "https://qwq.sh/fyyaqs",
  //   imageRight: true,
  // },
  {
    title: "Designed to be free. Forever.",
    description:
      "Born from the frustration of using bloated bots with hidden costs and locked features, XP was created with simplicity in mind. We believe that everyone should have access to basic features without having to pay for them. That's why, from the start, we made the decision to keep XP and its essential features completely free.",
  },
  {
    title: "Get XP now",
    description: (
      <>
        Invite XP below or check out our guides on how to get started!
        <div className="flex w-full flex-row justify-center gap-5 pt-5">
          <Link href="https://get.xp-bot.net/">
            <BlockButton variant={BlockButtonVariant.inPanel}>
              Invite XP
            </BlockButton>
          </Link>
          <Link href="/blog#guides">
            <BlockButton variant={BlockButtonVariant.inPanel}>
              Guides
            </BlockButton>
          </Link>
        </div>
      </>
    ),
  },
];

type IndexProps = IPage;

const Index: NextPage<IndexProps> = () => {
  const layout = useLayout();
  const bp = useBreakpoints();
  const user = useUser();
  // const { flags } = useFlags();

  const [openImage, setOpenImage] = useState<string | undefined>();

  useEffect(() => {
    layout.changeHeader(<HeaderIndex />, `index`);
  }, []);

  if (user.isLoggedIn) return <></>;

  return (
    <div>
      <HeadSet title="Reimagine your Community" />
      {bp.isLg && (
        <div
          onClick={() => {
            document
              .getElementById("index_scroll_target")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="FeatureArrow"
        >
          <p>features</p>
          <ThinArrowDown />
        </div>
      )}

      <div id="index_scroll_target" />
      <div className="flex flex-col gap-10 pt-5 lg:gap-20">
        {map(highlights, (highlight, idx) => (
          <IndexEmpBG key={`index_emp_${idx}`} empBG={idx % 2 !== 0}>
            <IndexHighlight
              rightImage={highlight.imageRight}
              requestImageZoom={(image) => {
                setOpenImage(image);
              }}
              description={highlight.description}
              title={highlight.title}
              image={highlight.image}
            />
          </IndexEmpBG>
        ))}

        <div className="flex w-full flex-col items-center justify-center gap-1 text-xs text-darkText opacity-75 dark:text-darkText-darkMode">
          <span>Copyright © 2019 - 2023 XP</span>
          <span className="flex flex-row gap-2">
            <Link href="/legal/privacy">Privacy Policy</Link>
            <span>•</span>
            <Link href="/blog/contributing_to_user_safety_and_service_guidelines_1657056506533">
              Safety Guidelines
            </Link>
          </span>
          <span>❤️ Made with Love ❤️</span>
        </div>
        {bp.isLg && (
          <Modal
            isOpen={!isUndefined(openImage)}
            requestClose={() => {
              setOpenImage(undefined);
            }}
            customKey={`index_image_zoom_${openImage || `closed`}`}
          >
            <div className="aspect-video overflow-hidden rounded-md border border-input-border dark:border-input-border-darkMode lg:max-w-5xl">
              <FallBackImage
                className="h-full w-full object-cover shadow-md"
                src={openImage}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  // const blogPosts = await apiRoutes.blog.get.posts();
  return {
    props: {
      // blogPosts: blogPosts.success ? blogPosts.body : [],
    },
  };
}

export default Index;
