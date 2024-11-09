import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from 'public/assets/images/Proground Logo - Black - Flat.png';
import logoStacked from 'public/assets/images/Proground Logo - Black - Stacked.png';
import logoDark from 'public/assets/images/Proground Logo - White - Flat.png';
import logoDarkStacked from 'public/assets/images/Proground Logo - White - Stacked.png';
import { useTheme } from 'context/ThemeContext';

function Logo({ stacked = false, width = 150, preferred = null }) {
  const { theme } = useTheme();

  // Determine logo based on override prop or theme
  let selectedLogo;

  if (preferred) {
    switch (preferred) {
      case 'stacked':
        selectedLogo = logoStacked;
        break;
      case 'dark':
        selectedLogo = logoDark;
        break;
      case 'darkStacked':
        selectedLogo = logoDarkStacked;
        break;
      default:
        selectedLogo = logo;
        break;
    }
  } else {
    // Default theme-based selection
    selectedLogo =
      theme === 'light'
        ? stacked
          ? logoStacked
          : logo
        : stacked
        ? logoDarkStacked
        : logoDark;
  }

  return (
    <Link href="/">
      <Image src={selectedLogo} alt="Logo" width={width} height="auto" />
    </Link>
  );
}

export default React.memo(Logo);
