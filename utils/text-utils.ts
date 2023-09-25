// eslint-disable-next-line lodash/import-scope
import _, { isNaN, join, replace } from 'lodash';

export const getAnnounceMessage = (
  message: string,
  tag?: string,
  mention?: string,
  level?: string,
  oldlevel?: string,
  climbed?: string
) => {
  return _.chain(message)
    .replace(/({TAG})+/g, tag || `Clyde#0000`)
    .replace(/({MNT})+/g, mention || `@Clyde`)
    .replace(/({LVL})+/g, level || `262`)
    .replace(/({OLDLVL})+/g, oldlevel || `260`)
    .replace(/({CMB})+/g, climbed || `2`).value();
};

export const fixDiscordMarkdownFormat = (message: string) => {
  return message
    .replaceAll(/\n/gm, `<br/>`)
    .replaceAll(/(<:.*?:.*?>)/gm, ``) // emote
    .replaceAll(/\*\*(.*?)\*\*/gm, (a, b) => {
      return `<b>${b}</b>`;
    })
    .replaceAll(/\*\*(.*?)\*\*/gm, (a, b) => {
      return `<b>${b}</b>`;
    })
    .replaceAll(/(\\n)/gm, `\n`)
    .replaceAll(/_(.*?)_/gm, (a, b) => {
      return `<i>${b}</i>`;
    })
    .replaceAll(/\*(.*?)\*/gm, (a, b) => {
      return `<i>${b}</i>`;
    })
    .replaceAll(/~~(.*?)~~/gm, (a, b) => {
      return `<strike>${b}</strike>`;
    });
};

export const stripHtml = (document: Document, html: string) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const calculateLevel = (xp: number) => {
  const level = Math.floor(Math.sqrt(2 * xp + 5) / 10);

  if (isNaN(level)) return 0;

  return level;
};

export const formatNumber = (number: number) => {
  return replace(number.toString(), /\B(?=(\d{3})+(?!\d))/g, `.`);
};

import { floor } from 'lodash';

export function getTimeByMillis(millis: number) {
  const response = {
    milliseconds: floor((millis % 1000) / 100),
    seconds: floor((millis / 1000) % 60),
    minutes: floor((millis / (1000 * 60)) % 60),
    hours: floor((millis / (1000 * 60 * 60)) % 24),
    days: floor(millis / (1000 * 60 * 60 * 24)),
  };
  return response;
}


export const formatVoiceTime = (duration: number) => {
  const d = getTimeByMillis(duration);
  const time = [];
  if (d.days !== 0) time.push(`${d.hours}d`);
  if (d.hours !== 0) time.push(`${d.hours}h`);
  if (d.minutes !== 0) time.push(`${d.minutes}m`);
  time.push(`${d.seconds}s`);
  return join(time, `, `);
};
