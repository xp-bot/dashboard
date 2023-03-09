import { isUndefined } from 'lodash';

type XPEvents = `spooktober` | `christmas` | `lgbt`;

const XPBadges: {
  [key: string]: { DEFAULT: string; EVENTS?: { [eventKey: string]: string } };
} = {
  xptranslator: {
    DEFAULT:
      'http://cdn.namespace.media/s/2pDcXnCdKjHN9bk/download/xptranslator.png',
  },
  xpsupport: {
    DEFAULT:
      'http://cdn.namespace.media/s/Dde5rFDfCHjimbN/download/xpsupport.png',
    EVENTS: {
      spooktober:
        'http://cdn.namespace.media/s/6sWEk2snPZRC2sX/download/xpsupport.png',
    },
  },
  xpfeaturesmith: {
    DEFAULT:
      'http://cdn.namespace.media/s/6CNXr827ZNYYbW7/download/xpfeaturesmith.png',
  },
  xpboost: {
    DEFAULT:
      'http://cdn.namespace.media/s/rrcrwKdC7DmZ8BB/download/xpboost.png',
  },
  xpdev: {
    DEFAULT: 'http://cdn.namespace.media/s/HaMEsRdaWnBNcgP/download/xpdev.png',
    EVENTS: {
      spooktober:
        'http://cdn.namespace.media/s/WdPXEDfrQB5mzFb/download/xpdev.png',
    },
  },
  xppremium: {
    DEFAULT:
      'http://cdn.namespace.media/s/s4Kab8MnjEXgDGX/download/xppremium.png',
  },
  xpbughunter: {
    DEFAULT:
      'http://cdn.namespace.media/s/LsoB5Q4yZNgEK57/download/xpbughunter.png',
  },
};

export const getXPBadge = (badge: keyof typeof XPBadges, event?: XPEvents) => {
  const badgeOBJ = XPBadges[badge];
  return !isUndefined(event)
    ? isUndefined(badgeOBJ.EVENTS) || isUndefined(badgeOBJ.EVENTS[event])
      ? badgeOBJ.DEFAULT
      : badgeOBJ.EVENTS[event]
    : badgeOBJ.DEFAULT;
};
