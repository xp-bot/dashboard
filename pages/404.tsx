import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useLayout } from 'context/layout-context';
import type { NextPage } from 'next';
import { useEffect } from 'react';

import ButtonCluster from '../components/button-cluster';
import HeadSet from '../components/head-set';
import { IPage } from '../models/page';

type NotFoundPageProps = IPage
const NotFoundPage: NextPage<NotFoundPageProps> = () => {
  const layout = useLayout();
  useEffect(() => {
    layout.changeHeader(
      <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
        <h1>Oh.. wait.. what?</h1>
        <h4>
          Reality is an illusion. The universe is a hologram. Buy gold. Bye!
        </h4>
      </div>,
      `404`
    );
  }, []);
  return (
    <>
      <HeadSet title="This is your User Profile" />
      <ButtonCluster
        buttons={[{ text: `Home`, icon: faHome, link: `/` }]}
        title="Let's get you back on track!"
      />
    </>
  );
};

export default NotFoundPage;
