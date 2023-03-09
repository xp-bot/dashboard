export const ArrowUp = (props: { white?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="10"
    viewBox="0 0 14.107 10.591"
  >
    <path
      id="b8630468b0aed7fa65976ef23ceaa8c3"
      d="M13.235,18.221a.7.7,0,0,1-1.245-.021L5.968,8.934C5.634,8.42,5.862,8,6.474,8h12.8c.612,0,.826.41.475.912Z"
      transform="translate(19.921 18.591) rotate(180)"
      className={`${
        props.white
          ? `fill-lightText dark:fill-lightText-darkMode`
          : `fill-[#5ae75c]`
      }`}
    />
  </svg>
);

export const ArrowDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="10"
    viewBox="0 0 14.107 10.591"
  >
    <path
      id="b8630468b0aed7fa65976ef23ceaa8c3"
      d="M13.235,18.221a.7.7,0,0,1-1.245-.021L5.968,8.934C5.634,8.42,5.862,8,6.474,8h12.8c.612,0,.826.41.475.912Z"
      transform="translate(-5.814 -8)"
      fill="#e75a70"
    />
  </svg>
);

export const ThinArrowDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12.158"
    height="8.157"
    viewBox="0 0 12.158 8.157"
  >
    <g transform="translate(-886.089 -7.92)">
      <line
        x1="4.668"
        y2="5.335"
        transform="translate(892.168 9.331)"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <line
        x2="4.668"
        y2="5.335"
        transform="translate(887.5 9.331)"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </g>
  </svg>
);

export const Neutral = () => (
  <svg
    style={{ display: `flex` }}
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="2"
    viewBox="0 0 14 2"
  >
    <line
      id="Line_4"
      data-name="Line 4"
      x2="12"
      transform="translate(1 1)"
      fill="none"
      strokeLinecap="round"
      strokeWidth="2"
      className="stroke-darkText dark:stroke-darkText-darkMode"
    />
  </svg>
);
