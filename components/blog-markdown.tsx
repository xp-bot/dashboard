import Markdown from 'markdown-to-jsx';
import { useTheme } from 'next-themes';
import { FC } from 'react';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import slug from 'remark-slug';
import { isDark } from 'utils/theme-utils';

import FallBackImage from './fallback-image';

interface IBlogMarkdownProps {
  body: string;
  html?: boolean;
}

const BlogMarkdown: FC<IBlogMarkdownProps> = ({ body, html }) => {
  const theme = useTheme();
  return (
    <>
      <Markdown
        options={{
          overrides: {
            img: { component: FallBackImage },
            // h1: { component: BlogH1 },
            // h2: { component: BlogH2 },
          },
        }}
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={`markdown-body w-full overflow-hidden break-words ${
          isDark(theme.theme, theme.systemTheme) ? `dark` : `light`
        }`}
        rehypePlugins={[...(html ? [rehypeRaw] : [])]}
        skipHtml={!html}
        remarkPlugins={[remarkGfm, slug]}
      >
        {body}
      </Markdown>
    </>
  );
};

export default BlogMarkdown;
