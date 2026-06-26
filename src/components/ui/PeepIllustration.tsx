/** Stylised "locked-in" student — flat illustration in the brand tones. */
export function PeepIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 200"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* soft ground shadow */}
      <ellipse cx="60" cy="190" rx="34" ry="6" fill="#1a1714" opacity=".10" />

      {/* back leg */}
      <path d="M54 138 L48 178" stroke="#2c2622" strokeWidth="15" />
      <path d="M40 180 q-3 4 5 5 l11 0 q4 -1 1 -6 l-9 -3 z" fill="#1a1714" />
      {/* front leg */}
      <path d="M70 140 L72 178" stroke="#3a322c" strokeWidth="15" />
      <path d="M64 180 q-3 4 5 5 l11 0 q4 -1 1 -6 l-9 -3 z" fill="#1a1714" />

      {/* hoodie body */}
      <path d="M40 96 q20 -10 40 0 l4 44 q-24 9 -48 0 z" fill="#C8402F" />
      {/* hoodie shading */}
      <path d="M62 92 l22 48 q-11 4 -22 5 z" fill="#A93223" opacity=".55" />
      {/* pocket seam */}
      <path
        d="M48 124 q12 6 24 0"
        stroke="#8f2a1d"
        strokeWidth="2.4"
        opacity=".6"
      />

      {/* arms / sleeves */}
      <path d="M44 100 q-12 16 -6 34" stroke="#C8402F" strokeWidth="14" />
      <path d="M76 100 q12 14 7 30" stroke="#C8402F" strokeWidth="14" />
      {/* hands */}
      <circle cx="39" cy="132" r="6.5" fill="#e0a37a" />
      <circle cx="84" cy="128" r="6.5" fill="#e0a37a" />

      {/* neck */}
      <rect x="54" y="80" width="12" height="14" rx="6" fill="#cf9069" />
      {/* head */}
      <ellipse cx="60" cy="62" rx="22" ry="23" fill="#e0a37a" />
      {/* face shadow */}
      <path d="M60 40 a22 23 0 0 1 0 45 z" fill="#cf9069" opacity=".4" />
      {/* hair */}
      <path
        d="M38 60 q-2 -30 22 -30 q24 0 22 30 q-6 -12 -22 -12 q-16 0 -22 12 z"
        fill="#1a1714"
      />
      {/* headphones */}
      <path d="M38 58 q22 -26 44 0" stroke="#1a1714" strokeWidth="5" fill="none" />
      <rect x="32" y="56" width="9" height="16" rx="4.5" fill="#2c2622" />
      <rect x="79" y="56" width="9" height="16" rx="4.5" fill="#2c2622" />
      {/* face */}
      <circle cx="52" cy="64" r="2.4" fill="#1a1714" />
      <circle cx="68" cy="64" r="2.4" fill="#1a1714" />
      <path d="M55 73 q5 4 10 0" stroke="#9c5b39" strokeWidth="2.2" fill="none" />
      {/* cheek blush */}
      <circle cx="48" cy="70" r="3" fill="#C8402F" opacity=".18" />
      <circle cx="72" cy="70" r="3" fill="#C8402F" opacity=".18" />
    </svg>
  );
}
