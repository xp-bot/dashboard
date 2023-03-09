import { isNaN, join } from 'lodash';

export const getAnnounceMessage = (
  message: string,
  tag?: string,
  mention?: string,
  level?: string,
  oldlevel?: string,
  climbed?: string
) => {
  return message
    .replace(/({TAG})+/g, tag || `Clyde#0000`)
    .replace(/({MNT})+/g, mention || `@Clyde`)
    .replace(/({LVL})+/g, level || `262`)
    .replace(/({OLDLVL})+/g, oldlevel || `260`)
    .replace(/({CMB})+/g, climbed || `2`);
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
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `.`);
};

export function getTimeByMillis(millis: number) {
  const response: any = {};
  response.milliseconds = (millis % 1000) / 100;
  response.seconds = Math.floor((millis / 1000) % 60);
  response.minutes = Math.floor((millis / (1000 * 60)) % 60);
  response.hours = response.minutes / 60;
  response.days = Math.floor(response.hours / 60);
  response.hours = Math.floor((millis / (1000 * 60 * 60)) % 24);
  return response as {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
  };
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
