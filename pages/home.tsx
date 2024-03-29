import { apiRoutes } from "apis/api-helper";
import { useLayout } from "context/layout-context";
import { useAccessRestriction } from "hooks/use-access-restriction";
// import { useFlags } from 'flags/client';
import { filter, map, orderBy, slice, startsWith } from "lodash";
import { IBlogPost } from "models/backend/blog-models";
import type { NextPage } from "next";
import { useEffect } from "react";

import BlogPostShowcasePanel from "../components/blog-post-showcase-panel";
import HeadSet from "../components/head-set";
import HeaderHome from "../components/header-content/header-home";
import { IPage } from "../models/page";

interface HomeProps extends IPage {
  blogPosts: IBlogPost[];
}

const Home: NextPage<HomeProps> = ({ blogPosts }) => {
  const layout = useLayout();
  // const { flags } = useFlags();
  useAccessRestriction(true, false, `/`);

  useEffect(() => {
    layout.changeHeader(<HeaderHome />, `home`);
  }, []);
  return (
    <div className="container">
      <HeadSet title="Reimagine your Community" />
      <div className="flex flex-col gap-[2.5rem] pt-2">
        <div>
          <h2 className="mb-6">Recent Blogposts</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {map(
              slice(
                orderBy(
                  filter(
                    blogPosts,
                    (post) => !startsWith(post.content.title, `Guide: `)
                  ),
                  (post) => post.content.updated_at,
                  "desc"
                ),
                0,
                4
              ),
              (blogPost, idx) => (
                <BlogPostShowcasePanel key={idx} blogPost={blogPost} />
              )
            )}
          </div>
        </div>
        <hr className="mt-1" />
        <div>
          <h2 className="mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {map(
              orderBy(
                filter(blogPosts, (post) =>
                  startsWith(post.content.title, `Guide: `)
                ),
                (post) => post.content.updated_at,
                "desc"
              ),
              (blogPost, idx) => (
                <BlogPostShowcasePanel key={idx} blogPost={blogPost} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const blogPosts = await apiRoutes.blog.get.posts();
    return {
      props: {
        blogPosts: blogPosts.success ? blogPosts.body : [],
      },
      revalidate: 10,
    };
  } catch (error) {
    return {
      notFound: true,
      revalidate: 10,
    };
  }
}

export default Home;
