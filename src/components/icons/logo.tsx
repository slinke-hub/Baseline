export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fontFamily="sans-serif"
  >
    <title>Baseline Logo</title>
    <defs>
      <linearGradient id="red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E53935" />
        <stop offset="100%" stopColor="#C62828" />
      </linearGradient>
      <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="100%" stopColor="#1C2B5D" />
      </linearGradient>
      <filter id="text-shadow" x="-0.025" y="-0.025" width="1.05" height="1.05">
        <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Background */}
    <circle cx="50" cy="50" r="48" fill="white" />
    
    {/* Outer Rings */}
    <circle cx="50" cy="50" r="46" fill="none" stroke="url(#blue-grad)" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="43" fill="none" stroke="url(#red-grad)" strokeWidth="2.5" />

    {/* B Shape */}
    <g transform="translate(25, 15) scale(0.6)">
        {/* Main B body */}
        <path d="M 20,0 L 50,0 C 75,0 80,20 65,40 L 65,40 C 85,60 75,80 50,80 L 20,80 L 20,0 Z" fill="#1C2B5D" />
        {/* Court inside B */}
        <path d="M 25,5 L 50,5 C 65,5 70,20 60,35 L 25,35 L 25,5 Z" fill="#D12727" />
        <path d="M 25,45 L 55,45 C 70,45 70,60 55,75 L 25,75 L 25,45 Z" fill="#D12727" />
        {/* Hoop */}
        <path d="M 58 25 A 8 4 0 0 0 42 25" fill="none" stroke="white" strokeWidth="1.5" />
        <path d="M 43 25 L 45 32 L 55 32 L 57 25" fill="none" stroke="white" strokeWidth="1" />
        {/* Court lines */}
        <path d="M 25 20 H 45" stroke="white" strokeWidth="1.5" />
        <path d="M 35 5 V 35" stroke="white" strokeWidth="1.5" />
        <path d="M 25 60 H 50" stroke="white" strokeWidth="1.5" />
    </g>

    {/* Basketball */}
    <circle cx="68" cy="58" r="12" fill="#F97316" />
    <path d="M 68 46 A 12 12 0 0 1 68 70" fill="none" stroke="black" strokeWidth="0.8"/>
    <path d="M 56 58 A 12 12 0 0 0 80 58" fill="none" stroke="black" strokeWidth="0.8"/>
    <path d="M 59 50 A 10 10 0 0 1 77 66" fill="none" stroke="black" strokeWidth="0.8"/>
    <path d="M 59 66 A 10 10 0 0 0 77 50" fill="none" stroke="black" strokeWidth="0.8"/>

    {/* Text */}
    <text x="50" y="86" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1C2B5D" filter="url(#text-shadow)">BASELINE</text>
    <text x="50" y="94" textAnchor="middle" fontSize="5" fontWeight="600" fill="#D12727" letterSpacing="0.1">PERSONAL TRAINING</text>
    
    {/* Lightning Bolts */}
    <g strokeWidth="1.5">
        <path d="M 80 20 l 10 -5 l -5 10 l 8 -6" stroke="#D12727" fill="none" />
        <path d="M 82 22 l 10 -5 l -5 10 l 8 -6" stroke="#1C2B5D" fill="none" />
        <path d="M 20 80 l -10 5 l 5 -10 l -8 6" stroke="#D12727" fill="none" />
        <path d="M 18 78 l -10 5 l 5 -10 l -8 6" stroke="#1C2B5D" fill="none" />
    </g>
  </svg>
);
