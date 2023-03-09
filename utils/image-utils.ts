import { extractColorsFromSrc } from 'extract-colors';
import html2canvas from 'html2canvas';
import { isUndefined } from 'lodash';

export const captureRankingBackground = async () => {
  const el = document.getElementById('RankingCapture');
  if (!el) return undefined;
  const resIMG = await html2canvas(el, { width: 450, height: 351 });
  return resIMG;
};

export const calculateLuminance = (r: number, g: number, b: number) =>
  parseFloat((0.2126 * r + 0.7152 * g + 0.0722 * b).toFixed(2));

export const getAverageImageColors = async (
  image: string,
  luminance?: (luminance: number) => boolean
) => {
  return extractColorsFromSrc(
    `${process.env.BACKEND_DOMAIN}/internal/imagetunnel?url=${image}`,
    {
      crossOrigin: 'use-credentials',
      pixels: 10,
      colorValidator: (r, g, b) =>
        !isUndefined(luminance)
          ? luminance(calculateLuminance(r, g, b))
          : calculateLuminance(r, g, b) < 100,
    }
  );
};
