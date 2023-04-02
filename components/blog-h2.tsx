import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

interface IBlogH2Props {
  children: ReactNode;
  id: string;
  className?: string;
}

const BlogH2: FC<IBlogH2Props> = ({ children, id, className }) => {
  const router = useRouter();

  return (
    <h2
      id={id}
      className={`${className || ``} group relative overflow-visible`}
    >
      <FontAwesomeIcon
        onClick={() => {
          navigator.clipboard.writeText(
            `https://xp-bot.net${router.asPath}#${id}`
          );
        }}
        className="absolute -left-12 top-1 scale-90 cursor-pointer opacity-0 transition ease-in-out hover:scale-100 active:scale-90 group-hover:opacity-75 group-hover:hover:opacity-100"
        icon={faLink}
      />
      {children}
    </h2>
  );
};

export default BlogH2;
