import React from 'react';

/**
 * Cozy Video Studio Scene: Tripod camera, softbox, whiteboard diagram & potted plant.
 * Hovering the parent `.group` gently rotates lens ring, pulses REC dot & floats diagram badge.
 */
export function VideoStudioIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <pattern id="risoDotsVideo" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#D95D39" opacity="0.22" />
        </pattern>
      </defs>

      {/* Soft ambient Risograph offset blobs */}
      <ellipse cx="245" cy="115" rx="95" ry="78" fill="#FBE3D7" opacity="0.65" />
      <circle cx="95" cy="135" r="58" fill="#E1ECE3" opacity="0.6" />
      <rect x="175" y="28" width="150" height="104" rx="14" fill="url(#risoDotsVideo)" />

      {/* Ground baseline */}
      <path d="M24 194 H336" stroke="#D5C7AE" strokeWidth="2" strokeLinecap="round" />

      {/* Whiteboard / Storyboard Easel on Right */}
      <g className="transition-transform duration-500 ease-out group-hover:-translate-y-1">
        {/* Easel legs */}
        <path d="M225 130 L208 194 M285 130 L302 194 M255 130 L255 194" stroke="#221E1C" strokeWidth="2.5" strokeLinecap="round" />
        {/* Board */}
        <rect x="184" y="34" width="142" height="98" rx="10" fill="#FCFBF8" stroke="#221E1C" strokeWidth="2.5" />
        <rect x="192" y="42" width="126" height="82" rx="6" fill="#FAF7F2" stroke="#E5DCCF" strokeWidth="1.5" />
        {/* Flowchart nodes inside board */}
        <rect x="202" y="54" width="36" height="20" rx="5" fill="#FDF3EE" stroke="#D95D39" strokeWidth="1.8" />
        <path d="M242 64 H262 M257 60 L263 64 L257 68" stroke="#221E1C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="268" y="54" width="38" height="20" rx="5" fill="#E1ECE3" stroke="#467352" strokeWidth="1.8" />
        <path d="M287 78 V92" stroke="#221E1C" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" />
        <rect x="202" y="94" width="104" height="18" rx="5" fill="#F5EBD0" stroke="#C88A2E" strokeWidth="1.6" />
        {/* Highlight badge */}
        <circle cx="316" cy="38" r="10" fill="#D95D39" />
        <path d="M312 38 L315 41 L321 35" stroke="#FCFBF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Camera on Wooden Tripod on Left */}
      <g className="transition-transform duration-500 ease-out group-hover:translate-x-1">
        {/* Tripod legs */}
        <path d="M98 122 L72 194 M98 122 L124 194 M98 122 V194" stroke="#221E1C" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M82 162 H114" stroke="#C88A2E" strokeWidth="2.5" strokeLinecap="round" />
        {/* Camera Body */}
        <rect x="66" y="80" width="64" height="42" rx="9" fill="#221E1C" />
        <rect x="72" y="86" width="32" height="30" rx="5" fill="#FAF7F2" />
        {/* Flip-out monitor */}
        <rect x="38" y="88" width="26" height="20" rx="4" fill="#FDF3EE" stroke="#221E1C" strokeWidth="2" />
        <circle cx="51" cy="98" r="4" fill="#D95D39" />
        {/* Camera Lens pointing right */}
        <rect x="130" y="88" width="18" height="26" rx="4" fill="#D95D39" stroke="#221E1C" strokeWidth="2.2" />
        <ellipse cx="149" cy="101" rx="4" ry="11" fill="#FAF7F2" stroke="#221E1C" strokeWidth="2" />
        {/* Top Mic & Blinking REC indicator */}
        <rect x="82" y="68" width="28" height="9" rx="4.5" fill="#645B55" stroke="#221E1C" strokeWidth="1.8" />
        <circle cx="118" cy="89" r="3.5" fill="#D95D39" className="animate-pulse" />
      </g>

      {/* Cozy Potted Plant */}
      <g transform="translate(148, 146)" className="transition-transform duration-500 group-hover:rotate-3">
        <path d="M6 26 H28 L25 48 H9 Z" fill="#D95D39" stroke="#221E1C" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M17 26 C15 12 4 6 2 14 C1 20 11 24 17 26 Z" fill="#467352" stroke="#221E1C" strokeWidth="2" />
        <path d="M17 26 C19 8 31 4 33 13 C34 19 23 24 17 26 Z" fill="#467352" stroke="#221E1C" strokeWidth="2" />
        <path d="M17 26 C17 6 12 0 18 0 C24 0 18 10 17 26 Z" fill="#659472" stroke="#221E1C" strokeWidth="2" />
      </g>
    </svg>
  );
}

/**
 * Open-Source Maker Workbench: Pegboard, spinning interlocking gears, code blueprint & succulent.
 */
export function OpenSourceWorkbenchIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <ellipse cx="180" cy="112" rx="135" ry="82" fill="#E1ECE3" opacity="0.55" />
      <circle cx="275" cy="70" r="52" fill="#F5EBD0" opacity="0.7" />

      {/* Workbench surface */}
      <path d="M22 188 H338" stroke="#221E1C" strokeWidth="2.5" strokeLinecap="round" />

      {/* Blueprint Code Card */}
      <g className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
        <rect x="46" y="48" width="146" height="122" rx="14" fill="#FCFBF8" stroke="#221E1C" strokeWidth="2.5" />
        <rect x="46" y="48" width="146" height="28" rx="14" fill="#F3EDE3" />
        <line x1="46" y1="76" x2="192" y2="76" stroke="#221E1C" strokeWidth="2" />
        <circle cx="64" cy="62" r="4" fill="#D95D39" />
        <circle cx="77" cy="62" r="4" fill="#C88A2E" />
        <circle cx="90" cy="62" r="4" fill="#467352" />
        {/* Code branches */}
        <circle cx="72" cy="98" r="5" fill="#467352" stroke="#221E1C" strokeWidth="2" />
        <circle cx="72" cy="138" r="5" fill="#D95D39" stroke="#221E1C" strokeWidth="2" />
        <circle cx="104" cy="118" r="5" fill="#C88A2E" stroke="#221E1C" strokeWidth="2" />
        <path d="M72 103 V133 M72 103 C72 114 99 108 99 118" stroke="#221E1C" strokeWidth="2" strokeLinecap="round" />
        <rect x="118" y="93" width="54" height="8" rx="4" fill="#221E1C" />
        <rect x="118" y="114" width="42" height="8" rx="4" fill="#D95D39" />
        <rect x="90" y="135" width="76" height="8" rx="4" fill="#645B55" opacity="0.65" />
      </g>

      {/* Interlocking Gears (rotate on hover!) */}
      <g
        style={{ transformOrigin: '242px 92px' }}
        className="transition-transform duration-700 ease-out group-hover:rotate-45"
      >
        <circle cx="242" cy="92" r="30" fill="#FDF3EE" stroke="#221E1C" strokeWidth="2.5" />
        <circle cx="242" cy="92" r="12" fill="#D95D39" stroke="#221E1C" strokeWidth="2.2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="237"
            y="55"
            width="10"
            height="10"
            rx="2.5"
            fill="#D95D39"
            stroke="#221E1C"
            strokeWidth="2"
            transform={`rotate(${deg} 242 92)`}
          />
        ))}
      </g>

      <g
        style={{ transformOrigin: '295px 136px' }}
        className="transition-transform duration-700 ease-out group-hover:-rotate-45"
      >
        <circle cx="295" cy="136" r="21" fill="#E1ECE3" stroke="#221E1C" strokeWidth="2.3" />
        <circle cx="295" cy="136" r="8" fill="#467352" stroke="#221E1C" strokeWidth="2" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <rect
            key={deg}
            x="291"
            y="109"
            width="8"
            height="8"
            rx="2"
            fill="#467352"
            stroke="#221E1C"
            strokeWidth="1.8"
            transform={`rotate(${deg} 295 136)`}
          />
        ))}
      </g>

      {/* Modular Stack Blocks */}
      <rect x="206" y="152" width="54" height="36" rx="8" fill="#F5EBD0" stroke="#221E1C" strokeWidth="2.3" />
      <path d="M222 170 H244" stroke="#221E1C" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Community & Coffee Chat Scene: Steaming ceramic cups, gliding paper airplanes & notebooks.
 */
export function CommunityCafeIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <ellipse cx="180" cy="122" rx="135" ry="75" fill="#F5EBD0" opacity="0.55" />
      <circle cx="105" cy="84" r="46" fill="#FBE3D7" opacity="0.65" />

      {/* Table Line */}
      <path d="M28 186 H332" stroke="#221E1C" strokeWidth="2.4" strokeLinecap="round" />

      {/* Dashed Flight Arc */}
      <path
        d="M72 116 C125 48 228 46 284 96"
        stroke="#D95D39"
        strokeWidth="2"
        strokeDasharray="5 5"
        strokeLinecap="round"
      />

      {/* Gliding Paper Airplane */}
      <g className="transition-transform duration-500 ease-out group-hover:translate-x-3 group-hover:-translate-y-2">
        <path
          d="M170 64 L216 48 L194 86 L184 72 Z"
          fill="#FCFBF8"
          stroke="#221E1C"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M184 72 L216 48" stroke="#D95D39" strokeWidth="2" />
      </g>

      {/* Left Ceramic Mug with Steam */}
      <g transform="translate(68, 128)">
        <path
          d="M16 -8 C12 -18 22 -24 18 -34 M30 -6 C26 -16 36 -22 32 -32"
          stroke="#C88A2E"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="transition-transform duration-500 group-hover:-translate-y-1.5"
        />
        <path d="M4 6 H44 V44 C44 52 38 58 30 58 H18 C10 58 4 52 4 44 Z" fill="#D95D39" stroke="#221E1C" strokeWidth="2.4" />
        <path d="M44 16 H52 C57 16 60 20 60 26 C60 32 57 36 52 36 H44" stroke="#221E1C" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="24" cy="6" rx="20" ry="4.5" fill="#FCFBF8" stroke="#221E1C" strokeWidth="2.2" />
      </g>

      {/* Open Letter / Note Card in Center-Right */}
      <g className="transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <rect x="164" y="106" width="128" height="80" rx="12" fill="#FCFBF8" stroke="#221E1C" strokeWidth="2.4" />
        <path d="M166 112 L228 150 L290 112" stroke="#221E1C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="228" cy="146" r="10" fill="#467352" stroke="#221E1C" strokeWidth="2" />
        <path d="M224 146 L227 149 L233 143" stroke="#FCFBF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
