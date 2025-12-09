export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fontFamily="sans-serif"
  >
    <title>Baseline Logo</title>
    <defs>
      <linearGradient id="red-grad-new" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D81E27" />
        <stop offset="100%" stopColor="#A0161D" />
      </linearGradient>
      <linearGradient id="blue-grad-new" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E2A5D" />
        <stop offset="100%" stopColor="#101733" />
      </linearGradient>
    </defs>

    <g transform="translate(0, -2)">
        {/* Outer Rings */}
        <circle cx="50" cy="52" r="45" fill="none" stroke="#1E2A5D" strokeWidth="2.5" />
        <circle cx="50" cy="52" r="42" fill="none" stroke="#D81E27" strokeWidth="2.5" />

        {/* B Shape & swooshes */}
        <g transform="translate(26, 20) scale(0.65)">
            {/* Top part of B */}
            <path d="M 18,10 L 50,10 L 50,40 L 22,40 C 35,20 25,12 18,10 Z" fill="#1E2A5D" />
            {/* Bottom part of B */}
            <path d="M 20,45 L 50,45 C 70,45 70,65 50,75 L 20,75 L 20,45 Z" fill="#1E2A5D" />
            
            {/* Court inside B */}
            <path d="M 22,15 L 45,15 L 45,35 L 25,35 C 32,27 28,18 22,15 Z" fill="#D81E27"/>
            <path d="M 25,50 L 48,50 C 60,50 60,65 48,70 L 25,70 L 25,50 Z" fill="#D81E27"/>

            {/* Backboard and Hoop */}
            <path d="M 35 20 H 45 V 30 H 35 Z" fill="white" stroke="#1E2A5D" strokeWidth="0.5"/>
            <path d="M 37 22 H 43 V 28 H 37 Z" fill="none" stroke="#D81E27" strokeWidth="0.5"/>
            <ellipse cx="40" cy="29" rx="4" ry="2" fill="none" stroke="#D81E27" strokeWidth="1" />
            <path d="M 37 29 L 38 34 L 42 34 L 43 29" fill="none" stroke="#D81E27" strokeWidth="0.5" />

            {/* Red swoosh top */}
            <path d="M 15,10 C 40,0 70,15 80,25" fill="none" stroke="#D81E27" strokeWidth="2.5" />
            {/* Blue swoosh bottom */}
            <path d="M 20,80 C 40,90 70,85 85,70" fill="none" stroke="#1E2A5D" strokeWidth="2.5" />
        </g>

        {/* Basketball */}
        <g transform="translate(3,3)">
            <circle cx="62" cy="58" r="11" fill="#D95E0C" />
            <path d="M 62 47 A 11 11 0 0 1 62 69" fill="none" stroke="black" strokeWidth="0.8"/>
            <path d="M 51 58 A 11 11 0 0 0 73 58" fill="none" stroke="black" strokeWidth="0.8"/>
            <path d="M 53 50 A 9 9 0 0 1 71 66" fill="none" stroke="black" strokeWidth="0.8"/>
            <path d="M 53 66 A 9 9 0 0 0 71 50" fill="none" stroke="black" strokeWidth="0.8"/>
        </g>
        
        {/* Lightning Bolts */}
        <g strokeWidth="2">
            {/* Top right */}
            <path d="M 80 20 l 10 -5 l -5 10 l 8 -6" stroke="#D81E27" fill="none" />
            <path d="M 82 22 l 10 -5 l -5 10 l 8 -6" stroke="#1E2A5D" fill="none" />
            {/* Bottom left */}
            <path d="M 20 85 l -10 5 l 5 -10 l -8 6" stroke="#D81E27" fill="none" />
            <path d="M 18 83 l -10 5 l 5 -10 l -8 6" stroke="#1E2A5D" fill="none" />
        </g>
        
        {/* Text */}
        <text x="50" y="86" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E2A5D" fontStyle="italic">
            <tspan fill="url(#red-grad-new)">BASE</tspan>LINE
        </text>
        <text x="50" y="93" textAnchor="middle" fontSize="5" fontWeight="600" fill="#D81E27" letterSpacing="0.1">PERSONAL TRAINING</text>
    </g>
  </svg>
);
