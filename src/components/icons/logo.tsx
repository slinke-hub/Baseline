export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 200 150"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <rect width="200" height="150" fill="white" />
    <defs>
      <linearGradient id="baseline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#1E2A5D' }} />
        <stop offset="100%" style={{ stopColor: '#C62828' }} />
      </linearGradient>
    </defs>

    {/* Main 'B' structure */}
    <g>
      {/* Red fill of the B */}
      <path
        d="M65,10 L110,10 V85 H65 V10 Z M65,10 C50,10 50,25 65,35 L105,35 V15 L65,15 V10 M65,45 L105,45 C125,45 125,65 105,75 L65,75 V45 Z"
        fill="#C62828"
      />
      {/* Blue outline and structure */}
      <path
        d="M60,5 L110,5 V90 H60 V5 Z M60,5 C40,5 40,30 60,40 M60,40 V90 M60,40 H105 C130,40 130,70 105,80 H60"
        fill="none"
        stroke="#1E2A5D"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </g>

    {/* Court inside B */}
    <g>
      {/* Red court background */}
      <path d="M68,15 L102,15 V35 H68 V15 Z" fill="#C62828" />
      {/* White court lines */}
      <circle cx="85" cy="25" r="8" fill="none" stroke="white" strokeWidth="1" />
      <path
        d="M68,15 H102 M68,35 H102 M75,15 V35 M95,15 V35"
        fill="none"
        stroke="white"
        strokeWidth="1"
      />
      <rect x="80" y="15" width="10" height="8" fill="none" stroke="white" strokeWidth="1" />
    </g>
    
    {/* Hoop and Net */}
    <g>
      <path d="M82,35 H88" stroke="white" strokeWidth="1.5" />
      <path d="M83,36 L84,39 L85,36 L86,39 L87,36" fill="none" stroke="white" strokeWidth="0.5" />
    </g>

    {/* Swooshes */}
    <g fill="none" strokeLinecap="round">
      {/* Blue swoosh */}
      <path d="M55,60 C30,70 40,100 65,95" stroke="#1E2A5D" strokeWidth="4" />
      {/* Red swoosh */}
      <path d="M115,30 C140,20 150,50 120,65" stroke="#C62828" strokeWidth="4" />
    </g>

    {/* Basketball */}
    <g>
        <circle cx="100" cy="70" r="15" fill="#D87C4A"/>
        <path d="M100,55 V85 M85,70 H115 M90,58 a 15 15 0 0 1 20,24 M90,82 a 15 15 0 0 0 20,-24" stroke="#1E2A5D" strokeWidth="1" fill="none" />
    </g>

    {/* BASELINE Text */}
    <text
      x="50%"
      y="120"
      textAnchor="middle"
      fontSize="24"
      fontFamily="sans-serif"
      fontWeight="bold"
      fill="url(#baseline-gradient)"
      fontStyle="italic"
    >
      BASELINE
    </text>
  </svg>
);
