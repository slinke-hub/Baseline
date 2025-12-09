export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 160 120"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>Baseline Logo</title>
      <defs>
        <linearGradient id="baseline-text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" />
          <stop offset="70%" stopColor="white" />
          <stop offset="100%" stopColor="#C41E3A" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <g transform="translate(10, 0)">
        {/* Main B Shape */}
        <g>
          {/* Red shadow swoosh */}
          <path d="M 20 60 C 40 40, 80 50, 110 40 C 95 65, 70 80, 45 95 C 60 90, 75 80, 85 70 C 65 65, 40 70, 20 60 Z" fill="#C41E3A" transform="translate(3,3)" opacity="0.7"/>

          {/* Top part of B */}
          <path d="M 20,10 L 60,10 C 85,10 85,35 60,40 L 20,40 V 10 Z" fill="#C41E3A" stroke="white" strokeWidth="3"/>
          
          {/* Bottom part of B */}
          <path d="M 20,45 L 60,45 C 90,45 90,70 60,75 L 20,75 V 45 Z" fill="#C41E3A" stroke="white" strokeWidth="3"/>

          {/* White swoosh */}
          <path d="M 20 60 C 40 40, 80 50, 110 40 C 95 65, 70 80, 45 95 C 60 90, 75 80, 85 70 C 65 65, 40 70, 20 60 Z" fill="white"/>

          {/* Court inside B */}
          <path d="M 25,15 L 55,15 L 55,35 L 25,35 Z" fill="#1E2A5D" opacity="0.5" />
          <path d="M 35,15 A 10 10 0 0 0 35 35" fill="none" stroke="white" strokeWidth="1" />
          <path d="M 25,49 L 55,49 L 55,70 L 25,70 Z" fill="#1E2A5D" opacity="0.5" />
          <path d="M 35,49 A 10 10 0 0 1 35 70" fill="none" stroke="white" strokeWidth="1" />

          {/* Hoop and Net */}
          <g transform="translate(32, 38)">
            <path d="M 0,0 C 4,5 12,5 16,0" fill="none" stroke="#C41E3A" strokeWidth="1.2" />
            <path d="M 1,1 L 2,8 L 3,1 M 4,1 L 5,8 L 6,1 M 7,1 L 8,8 L 9,1 M 10,1 L 11,8 L 12,1 M 13,1 L 14,8 L 15,1" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M 1,3 C 8,4 12,4 15,3 M 1.5,6 C 8,7 12,7 14.5,6" stroke="white" strokeWidth="0.5" fill="none" />
          </g>
        </g>
        
        {/* Basketball */}
        <g transform="translate(75, 60)">
          <circle cx="0" cy="0" r="14" fill="#D95E0C" />
          <path d="M0,-14 A14,14 0 0,1 0,14" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
          <path d="M-14,0 A14,14 0 0,0 14,0" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
          <path d="M-10.5,-9.5 A12,12 0 0,1 10.5,9.5" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
          <path d="M-10.5,9.5 A12,12 0 0,0 10.5,-9.5" fill="none" stroke="#1E2A5D" strokeWidth="1"/>
        </g>
      </g>
      
      <text x="30" y="105" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="bold" fontStyle="italic" fill="url(#baseline-text-gradient)" filter="url(#glow)">
        BASEL<tspan dy="-3" fontSize="14">'</tspan><tspan dy="3">INE</tspan>
      </text>
    </svg>
  );