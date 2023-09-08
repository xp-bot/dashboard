import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { apiRoutes } from "apis/api-helper";
import BlogPostShowcasePanel from "components/blog-post-showcase-panel";
import ButtonCluster from "components/button-cluster";
import HeadSet from "components/head-set";
import HeaderBlogList from "components/header-content/header-blog-list";
import PageTitle from "components/page-title";
import { useLayout } from "context/layout-context";
import { useUser } from "context/user-context";
import { filter, map, orderBy, slice, startsWith } from "lodash";
import { IBlogPost } from "models/backend/blog-models";
import { IPage } from "models/page";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

interface HomeProps extends IPage {
  blogPosts: IBlogPost[];
}

const Blog: NextPage<HomeProps> = ({ blogPosts: posts }) => {
  const layout = useLayout();
  const user = useUser();
  const [blogPosts, setBlogPosts] = useState<IBlogPost[]>(posts);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const res = await apiRoutes.blog.get.posts();
      if (res.success) {
        setBlogPosts(res.body);
      }
    };
    if (user.currentUser?.developer) fetchBlogPosts();
  }, [user]);

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
          </>
        )}

        <div>
          <PageTitle title="Recent Blogposts" disableArrow />
          <div
            className={`grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3`}
          >
            {map(
              orderBy(
                filter(
                  blogPosts,
                  (post) => !startsWith(post.content.title, `Guide: `)
                ),
                (post) =>
                  post.content.created_at
                    ? new Date(post.content.created_at).valueOf()
                    : 0,
                "desc"
              ),
              (blogPost, idx) => (
                <BlogPostShowcasePanel key={idx} blogPost={blogPost} />
              )
            )}
          </div>
        </div>
        <div>
          <PageTitle title="Guides" disableArrow />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {map(
              slice(
                orderBy(
                  filter(blogPosts, (post) =>
                    startsWith(post.content.title, `Guide: `)
                  ),
                  (post) =>
                    post.content.created_at
                      ? new Date(post.content.created_at).valueOf()
                      : 0,
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
    revalidate: 5,
  };
}

export default Blog;
