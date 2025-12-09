export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="100"
    height="100"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Baseline Logo</title>
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(var(--primary))" />
        <stop offset="100%" stop-color="hsl(var(--primary) / 0.8)" />
      </linearGradient>
    </defs>
    <path
      d="M50 10 C 27.9 10, 10 27.9, 10 50 C 10 72.1, 27.9 90, 50 90 C 72.1 90, 90 72.1, 90 50 C 90 27.9, 72.1 10, 50 10 Z M 50 15 C 69.3 15, 85 30.7, 85 50 C 85 69.3, 69.3 85, 50 85 C 30.7 85, 15 69.3, 15 50 C 15 30.7, 30.7 15, 50 15 Z"
      fill="url(#logo-gradient)"
    />
    <path
      d="M40 30 C 60 30, 65 40, 65 50 C 65 60, 60 70, 40 70 L 35 70 L 35 30 Z"
      fill="hsl(var(--background))"
    />
    <circle cx="50" cy="50" r="10" fill="#D95E0C" />
    <path
      d="M50 40 A 10 10 0 0 1 50 60"
      fill="none"
      stroke="black"
      stroke-width="1.2"
    />
    <path
      d="M40 50 A 10 10 0 0 0 60 50"
      fill="none"
      stroke="black"
      stroke-width="1.2"
    />
    <path
      d="M42 42 A 8 8 0 0 1 58 58"
      fill="none"
      stroke="black"
      stroke-width="1.2"
    />
    <path
      d="M42 58 A 8 8 0 0 0 58 42"
      fill="none"
      stroke="black"
      stroke-width="1.2"
    />
  </svg>
);
