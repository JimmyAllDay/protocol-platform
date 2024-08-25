import React from 'react';
import Link from 'next/link';

import { SiTiktok, SiFacebook, SiInstagram } from 'react-icons/si';

function SocialLinks({ axis }) {
  return (
    <div className="flex">
      <ul
        className={`flex flex-col items-center mx-auto ${
          axis ? axis : 'sm:flex-row lg:flex-col'
        } gap-2`}
      >
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
    </div>
  );
}

export default SocialLinks;
