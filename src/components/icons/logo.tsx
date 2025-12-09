export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 40"
    fill="none"
  >
    <title>Baseline Logo</title>
    <text
      x="60"
      y="18"
      fontFamily="Verdana, sans-serif"
      fontSize="14"
      fontWeight="bold"
      fill="#0d3a85"
      textAnchor="middle"
      letterSpacing="0.5"
      transform="rotate(-5 60 18)"
    >
      BASELINE
    </text>
    <g transform="translate(45 20)">
      <path d="M15 30 C 6.71 30 0 23.28 0 15 C 0 6.71 6.71 0 15 0 C 23.28 0 30 6.71 30 15 C 30 23.28 23.28 30 15 30 Z" fill="#f97316"/>
      <path d="M15,0 A15,15 0 0,1 15,30" stroke="#0d3a85" strokeWidth="1" fill="none"/>
      <path d="M0,15 A15,15 0 0,1 30,15" stroke="#0d3a85" strokeWidth="1" fill="none"/>
      <path d="M3.75,7.5 A15,15 0 0,1 26.25,22.5" stroke="#0d3a85" strokeWidth="1" fill="none"/>
      <path d="M3.75,22.5 A15,15 0 0,0 26.25,7.5" stroke="#0d3a85" strokeWidth="1" fill="none"/>
      <path d="M-5 15 A 20 5 0 0 0 35 15" stroke="#0d3a85" strokeWidth="2" fill="none" />
      <path d="M-5 15 A 20 5 0 0 1 35 15" stroke="#f9a825" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
    </g>
  </svg>
);
