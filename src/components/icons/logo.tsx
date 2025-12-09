export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <title>Baseline Logo</title>
    <defs>
      <linearGradient id="baseline-text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1E2A5D" />
        <stop offset="100%" stopColor="#C41E3A" />
      </linearGradient>
    </defs>
    
    <g transform="scale(0.95) translate(2, 2)">
      {/* Main B shape */}
      <path
        d="M20,10 L50,10 L50,40 L30,40 C40,25 30,15 20,10 Z"
        fill="#C41E3A"
      />
      <path
        d="M20,45 L50,45 C75,45 75,70 50,80 L20,80 Z"
        fill="#1E2A5D"
      />
      <path d="M20 10 L20 80" stroke="#1E2A5D" strokeWidth="6" fill="none"/>

      {/* Red swoosh */}
      <path 
        d="M15,55 C40,35 70,45 90,40 C80,60 60,70 45,85 C55,80 65,75 70,65 C60,60 40,65 15,55 Z"
        fill="#C41E3A"
      />
      {/* Blue swoosh */}
      <path 
        d="M15,50 C40,30 70,40 90,35 C80,55 60,65 45,80 C55,75 65,70 70,60 C60,55 40,60 15,50 Z"
        fill="#1E2A5D"
      />

      {/* Backboard */}
      <path d="M30,15 L45,15 L45,30 L30,30 Z" fill="#FFFFFF" />
      <path d="M32,17 L43,17 L43,28 L32,28 Z" fill="none" stroke="#C41E3A" strokeWidth="1" />
      <path d="M35,21 L40,21 L40,28 L35,28 Z" fill="none" stroke="#C41E3A" strokeWidth="1" />
      
      {/* Hoop */}
      <path d="M32,30 C35,35 40,35 43,30" fill="none" stroke="#C41E3A" strokeWidth="1.5" />
      {/* Net */}
      <path d="M33,31 L34,38 L35,31 M36,31 L37,38 L38,31 M39,31 L40,38 L41,31 M42,31 L41,38" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
      <path d="M33,33 C37,35 40,35 42,33 M33.5,36 C37,38 40,38 41.5,36" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />

      {/* Basketball */}
      <g transform="translate(55, 55)">
        <circle cx="0" cy="0" r="12" fill="#D95E0C" />
        <path d="M0,-12 A12,12 0 0,1 0,12" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
        <path d="M-12,0 A12,12 0 0,0 12,0" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
        <path d="M-9.5,-7.5 A10,10 0 0,1 9.5,7.5" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
        <path d="M-9.5,7.5 A10,10 0 0,0 9.5,-7.5" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
      </g>
      
      {/* Text BASELINE */}
      <text x="5" y="95" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="bold" fontStyle="italic" fill="url(#baseline-text-gradient)">
        BASELINE
      </text>
    </g>
  </svg>
));
