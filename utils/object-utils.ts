import { clone, compact, forEach, size } from 'lodash';
import { ServerRoutes } from 'page-tabs/server-tabs/server-routes';
import { UserRoutes } from 'page-tabs/user-tabs/user-routes';

const test = Object.entries(UserRoutes);

const splitArrayByMarginLeft = (array: typeof test): any[] => {
  const splitArray: (typeof array)[] = [];
  let editArray: typeof array = [];

  // eslint-disable-next-line consistent-return
  forEach(array, (item) => {
    if (item[1].marginLeft) {
      if (size(editArray) === 0) {
        editArray.push(item);
      } else {
        splitArray.push(clone(editArray));
        editArray = [];
        editArray.push(item);
      }
    } else {
      editArray.push(item);
    }
  });

  return compact([...splitArray, editArray]);
};

const server = Object.entries(ServerRoutes);

export const splitServerArrayByMarginLeft = (
  array: typeof server
): (typeof server)[] => {
  return splitArrayByMarginLeft(array as any);
};

const users = Object.entries(UserRoutes);

export const splitUserArrayByMarginLeft = (
  array: typeof users
): (typeof users)[] => {
  return splitArrayByMarginLeft(array as any);
};
