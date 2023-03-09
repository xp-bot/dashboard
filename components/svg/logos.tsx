export const XPLogo = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mt-[2px]"
  >
    <path
      d="M10.5 1.5V10.5"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M6.12915 4.797V10.4947"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M1.5 7.64624V10.4947"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const XPLoading = () => (
  <div className="flex w-fit flex-col items-center justify-center gap-[10px]">
    {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
    <div className="xp-loading flex h-[95px] w-[95px] flex-row  items-end gap-[10px]">
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="xp-loading-small" />
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="xp-loading-medium " />
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="xp-loading-big " />
    </div>
  </div>
);
