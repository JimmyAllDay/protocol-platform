import React from 'react';
import Link from 'next/link';

import { SiTiktok, SiFacebook, SiInstagram } from 'react-icons/si';

function SocialLinksHorizontal({ axis }) {
  return (
    <ul className={`flex gap-2 mx-auto`}>
      <li className="">
        <Link href="https://www.facebook.com/">
          <div className="social-link">
            <SiFacebook />
          </div>
        </Link>
      </li>

      <li className="">
        <Link href="https://www.instagram.com/tikt">
          <div className="social-link">
            <SiInstagram />
          </div>
        </Link>
      </li>
      <li className="">
        <Link href="https://www.facebook.com/">
          <div className="social-link">
            <SiTiktok />
          </div>
        </Link>
      </li>
    </ul>
  );
}

export default SocialLinksHorizontal;
