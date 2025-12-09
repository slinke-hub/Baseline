export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Predators Basketball Club Logo</title>
      <defs>
        <path id="arcTop" d="M 15 50 A 35 35 0 1 1 85 50" />
        <path id="arcBottom" d="M 15 50 A 35 35 0 0 0 85 50" />
      </defs>
      
      {/* Background and Borders */}
      <circle cx="50" cy="50" r="48" fill="#1a1a1a" stroke="white" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="45" fill="#1a1a1a" stroke="#E67E22" strokeWidth="2" />
      <circle cx="50" cy="50" r="38" fill="#E67E22" />

      {/* Basketball Lines */}
      <path d="M 50 12 V 88 M 12 50 H 88" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      <path d="M 25,25 a 25 25 0 0 1 50,50 M 25,75 a 25 25 0 0 0 50,-50" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>

      {/* Wings and Claws */}
      <g fill="#555" stroke="#1a1a1a" strokeWidth="0.5" strokeLinejoin="round">
        {/* Left Wing */}
        <path d="M40 35 C 30 25, 10 30, 5 50 C 15 55, 25 50, 40 35 Z" />
        <path d="M35 38 C 28 32, 15 35, 12 52 C 20 56, 30 52, 35 38 Z" fill="#666" />
        <path d="M30 42 C 25 38, 18 40, 16 54 C 25 57, 32 54, 30 42 Z" fill="#777" />
        
        {/* Right Wing */}
        <path d="M60 35 C 70 25, 90 30, 95 50 C 85 55, 75 50, 60 35 Z" />
        <path d="M65 38 C 72 32, 85 35, 88 52 C 80 56, 70 52, 65 38 Z" fill="#666" />
        <path d="M70 42 C 75 38, 82 40, 84 54 C 75 57, 68 54, 70 42 Z" fill="#777" />
        
        {/* Left Claw */}
        <path d="M40 65 C 35 75, 30 85, 25 80 C 30 75, 35 70, 40 65 Z" />
        <path d="M42 68 L 30 85 L 33 87 L 45 70 Z" fill="#444" />
        <path d="M44 72 L 35 88 L 38 90 L 47 74 Z" fill="#444" />
        <path d="M30 85 l-3 3 l2-5z M35 88 l-3 3 l2-5z" fill="white" stroke="none" />

        {/* Right Claw */}
        <path d="M60 65 C 65 75, 70 85, 75 80 C 70 75, 65 70, 60 65 Z" />
        <path d="M58 68 L 70 85 L 67 87 L 55 70 Z" fill="#444" />
        <path d="M56 72 L 65 88 L 62 90 L 53 74 Z" fill="#444" />
        <path d="M70 85 l3 3 l-2-5z M65 88 l3 3 l-2-5z" fill="white" stroke="none" />
      </g>

      {/* Text */}
      <text fill="#F5F5F5" fontSize="10" fontWeight="bold" letterSpacing="0.5">
        <textPath href="#arcTop" startOffset="50%" textAnchor="middle">
          PREDATORS
        </textPath>
      </text>
      <text fill="#F5F5F5" fontSize="7" fontWeight="bold" letterSpacing="0.5">
        <textPath href="#arcBottom" startOffset="50%" textAnchor="middle">
          BASKETBALL CLUB
        </textPath>
      </text>
    </svg>
  );
  
