import { headerGradientTypes } from 'components/header';
import { useLayout } from 'context/layout-context';
import type { NextPage } from 'next';
import { useEffect } from 'react';

import HeadSet from '../components/head-set';
import { IPage } from '../models/page';

interface NotFoundPageProps extends IPage {}
const NotFoundPage: NextPage<NotFoundPageProps> = () => {
  const layout = useLayout();
  useEffect(() => {
    layout.changeHeader(
      <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
        <h1>Oh.. wait.. what?</h1>
        <h4>We are currently undergoing maintenance. Check back later!</h4>
      </div>,
      `404`,
      undefined,
      undefined,
      headerGradientTypes.premium
    );
  }, []);
  return (
    <>
      <HeadSet title="This is your User Profile" />
    </>
  );
};

export default NotFoundPage;
