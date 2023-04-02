import { useUser } from 'context/user-context';
import { useTheme } from 'next-themes';

import ButtonCluster from './button-cluster';

const DebugMenu = () => {
  const user = useUser();
  const { theme, setTheme } = useTheme();
  return (
    <div className="pointer-events-none fixed right-10 top-10 z-50 h-fit rounded-md border-2 border-red-500 border-opacity-[.5] bg-red-400 bg-opacity-[.5] p-5 text-right shadow-sm backdrop-blur-md">
      <h2>Debug Menu</h2>
      <div className="my-2" />
      <p>
        <span>Me Requests: {user.debug.meRequests}</span>
        <br />
        <span>Guild Requests: {user.debug.guildRequests}</span>
      </p>
      <br />
      <div className="pointer-events-auto">
        <ButtonCluster
          buttons={[
            {
              text: `toggle dark`,
              onClick: () => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default DebugMenu;
