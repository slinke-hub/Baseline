export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 200 150"
    xmlns="http://www.w3.org/2000/svg"
    fontFamily="sans-serif"
  >
    <rect width="200" height="150" fill="#F5F1E8" />
    <g transform="translate(0, -10)">
      {/* Basketball */}
      <g>
        <circle cx="100" cy="50" r="35" fill="#F37321" />
        <path
          d="M65,50 A35,35 0 0,0 135,50 M100,15 V85 M70,25 A35,35 0 0,0 130,75 M70,75 A35,35 0 0,1 130,25"
          stroke="#0D2344"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* Baseline Graphic */}
      <path
        d="M30,90 L115,90 L125,80 L170,80"
        stroke="#0D2344"
        strokeWidth="6"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Text */}
      <text
        x="100"
        y="130"
        fontSize="38"
        fontWeight="bold"
        fill="#0D2344"
        textAnchor="middle"
      >
        BASELINE
      </text>
    </g>
  </svg>
);
