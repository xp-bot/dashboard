import IndexEmpBG from 'components/index-emp-bg';
import IndexHighlight from 'components/index-panel';
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
        <h1>Playing with open cards ❤️</h1>
        <h4>
          We prioritize our product over profit and aim to show you where your
          money goes.
        </h4>
      </div>,
      `404`
    );
  }, []);
  return (
    <>
      <HeadSet title="This is your User Profile" />
      <div className="flex flex-col gap-10 pt-5 lg:gap-20">
        <IndexEmpBG>
          <IndexHighlight
            description={
              <>
                At the heart of XP is a commitment. The commitment to putting
                our product and customers first, rather than maximizing profits
                for ourselves.
                <br />
                <br />
                We believe that providing full transparency about what we earn
                and how we spend that money is essential in building trust with
                you - the users of XP. By offering clear information about where
                your money goes when you buy our product, we hope to create a
                long-lasting and positive relationship with you, based on mutual
                respect and honesty.
              </>
            }
            title={'XP is made for you.'}
          />
        </IndexEmpBG>
        <IndexEmpBG empBG={true}>
          <IndexHighlight
            title={'Up to date Statistics'}
            description={
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <span>
                    <b>Total Users</b>:
                  </span>
                  <span>392.231.239 +</span>{' '}
                </div>
                <div className="flex flex-row gap-2">
                  <span>
                    <b>Active Servers</b>:
                  </span>
                  <span>392.231.239 +</span>{' '}
                </div>
                <div className="flex flex-row gap-2">
                  <span>
                    <b>Daily Messages</b>:
                  </span>
                  <span>392.231.239 +</span>{' '}
                </div>
              </div>
            }
            image="https://qwq.sh/wqn62i"
          />
        </IndexEmpBG>
        <IndexEmpBG>
          <IndexHighlight
            rightImage
            title={'Financial Overview'}
            description={
              <div className="flex flex-col gap-2 text-end">
                <div className="grid grid-cols-[1fr_120px] justify-end gap-2 text-end">
                  <span>
                    <b>Patreon Income</b>:
                  </span>
                  <span>~ 260€ / m</span>{' '}
                  <span>
                    <b>Expenses</b>:
                  </span>
                  <span>~ 130€ / m</span>{' '}
                  <span>
                    <b>Payout to Staff</b>:
                  </span>
                  <span>0€ / m</span>{' '}
                </div>
              </div>
            }
            image="https://qwq.sh/odgcio"
          />
        </IndexEmpBG>
      </div>
    </>
  );
};

export default NotFoundPage;
