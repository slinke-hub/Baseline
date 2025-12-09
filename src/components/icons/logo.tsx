export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 140 100"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <title>Baseline Logo</title>
    <defs>
      <linearGradient id="baseline-text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1E2A5D" />
        <stop offset="60%" stopColor="#C41E3A" />
        <stop offset="100%" stopColor="#C41E3A" />
      </linearGradient>
    </defs>
    
    <g transform="translate(10, -5)">
      {/* Main B Shape */}
      <path d="M20,10 L20,75 L50,75 C70,75 70,55 50,50 C70,45 70,25 50,15 L20,10 Z" fill="none" stroke="#1E2A5D" strokeWidth="6" />
      <path d="M22,13 L48,16 V38 L22,40 Z" fill="#C41E3A"/>
      <path d="M22,45 L48,48 C65,50 65,65 50,72 L22,72 Z" fill="#C41E3A" />

      {/* Backboard */}
      <path d="M28,18 L42,19 L42,30 L28,31 Z" fill="#FFFFFF" />
      <path d="M30,20 L40,21 V29 L30,28 Z" fill="none" stroke="#C41E3A" strokeWidth="0.8" />
      <path d="M32,23 L38,24 V29 L32,27 Z" fill="none" stroke="#C41E3A" strokeWidth="0.8" />
      
      {/* Hoop and Net */}
      <path d="M28,32 C32,36 38,36 42,32" fill="none" stroke="#C41E3A" strokeWidth="1" />
      <path d="M29,33 L30,40 L31,33 M32,33 L33,40 L34,33 M35,33 L36,40 L37,33 M38,33 L39,40 L40,33 M41,33 L40,40" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
      <path d="M29,35 C35,37 38,37 41,35 M29.5,38 C35,40 38,40 40.5,38" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
      
      {/* Swooshes */}
      <path d="M15,55 C40,35 70,45 90,40 C80,60 60,70 45,85 C55,80 65,75 70,65 C60,60 40,65 15,55 Z" fill="#1E2A5D" transform="translate(0, -2)" />
      <path d="M15,50 C40,30 70,40 90,35 C80,55 60,65 45,80 C55,75 65,70 70,60 C60,55 40,60 15,50 Z" fill="#C41E3A" transform="translate(0, -2)" />
      
      {/* Basketball */}
      <g transform="translate(60, 58)">
        <circle cx="0" cy="0" r="12" fill="#D95E0C" />
        <path d="M0,-12 A12,12 0 0,1 0,12" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
        <path d="M-12,0 A12,12 0 0,0 12,0" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
        <path d="M-9.5,-7.5 A10,10 0 0,1 9.5,7.5" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
        <path d="M-9.5,7.5 A10,10 0 0,0 9.5,-7.5" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
      </g>
    </g>
    
    <text x="25" y="95" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="bold" fontStyle="italic" fill="url(#baseline-text-gradient)">
      BASELINE
    </text>
  </svg>
));