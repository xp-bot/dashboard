import { filter, forEach, isArray, isEmpty, isString, split } from 'lodash';
import { NextRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

export const getRouteParts = (route: NextRouter) =>
  filter(split(route.route, `/`), (item) => !isEmpty(item));

export const getQueryParamAsArray = (
  id: string,
  query: ParsedUrlQuery
): string[] | undefined =>
  isArray(query[id]) ? (query[id] as string[]) : undefined;

export const getQueryParamAsString = (
  id: string,
  query: ParsedUrlQuery
): string | undefined =>
  isString(query[id]) ? (query[id] as string) : undefined;

export const handleUrlArrayCodes = (
  codes: {
    target: string;
    callbacks: { codeRecieved: (code: string[]) => void };
  }[],
  router: NextRouter
) => {
  forEach(codes, ({ target, callbacks }) => {
    const detected = getQueryParamAsArray(target, router.query);
    if (detected) callbacks.codeRecieved(detected);
  });
};

export const handleUrlCodes = (
  codes: {
    target: string;
    callbacks: { codeRecieved: (code: string) => void };
  }[],
  router: NextRouter
) => {
  forEach(codes, ({ target, callbacks }) => {
    const detected = getQueryParamAsString(target, router.query);
    if (detected) callbacks.codeRecieved(detected);
  });
};

export const shareContent = (data: ShareData) => {
  try {
    navigator
      .share(data)
    // eslint-disable-next-line no-empty
  } catch (error) { }
};
