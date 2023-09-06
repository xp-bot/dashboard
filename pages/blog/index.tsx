import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { apiRoutes } from "apis/api-helper";
import BlogPostShowcasePanel from "components/blog-post-showcase-panel";
import ButtonCluster from "components/button-cluster";
import HeadSet from "components/head-set";
import HeaderBlogList from "components/header-content/header-blog-list";
import { useLayout } from "context/layout-context";
import { useUser } from "context/user-context";
import { filter, map, orderBy, slice, startsWith } from "lodash";
import { IBlogPost } from "models/backend/blog-models";
import { IPage } from "models/page";
import type { NextPage } from "next";
import { useEffect } from "react";

interface HomeProps extends IPage {
  blogPosts: IBlogPost[];
}

const Blog: NextPage<HomeProps> = ({ blogPosts }) => {
  const layout = useLayout();
  const user = useUser();

  useEffect(() => {
    layout.changeHeader(<HeaderBlogList />, `blog`);
  }, []);
  return (
    <div className="container">
      <HeadSet
        title="Official XP Blog"
        description="An outlet for any thoughts from the XP dev team, XP updates or for information related to XP in general."
      />
      <div className="flex flex-col gap-[2.5rem]">
        {user.currentUser?.developer && (
          <>
            <div>
              <ButtonCluster
                title="Dev Zone"
                buttons={[
                  {
                    text: `Create new Post`,
                    link: `/blog/editor`,
                    icon: faAdd,
                  },
                ]}
              />
            </div>
            <hr />
          </>
        )}

        <div>
          <h2 className="mb-6">Recent Blogposts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {map(
              orderBy(
                filter(
                  blogPosts,
                  (post) => !startsWith(post.content.title, `Guide: `)
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
        <hr className="mt-1" />
        <div>
          <h2 id="guides" className="mb-6">
            Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {map(
              slice(
                orderBy(
                  filter(blogPosts, (post) =>
                    startsWith(post.content.title, `Guide: `)
                  ),
                  (post) => post.content.updated_at,
                  "desc"
                ),
                0,
                5
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
  const blogPosts = await apiRoutes.blog.get.posts();
  return {
    props: {
      blogPosts: blogPosts.success ? blogPosts.body : [],
    },
    revalidate: 1,
  };
}

export default Blog;
