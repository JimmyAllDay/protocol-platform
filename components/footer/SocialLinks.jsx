import Link from 'next/link';
import Image from 'next/image';

import { SiTiktok, SiFacebook, SiInstagram } from 'react-icons/si';

function SocialLinks({ col }) {
  return (
    <ul className={`flex ${col && 'flex-col'} gap-2 w-12`}>
      <li className="">
        <Link href="https://www.facebook.com/">
          <div className="bg-accentGrey bg-opacity-50 p-3 text-2xl rounded-md hover:text-accent hover:bg-opacity-90">
            <SiFacebook />
          </div>
        </Link>
      </li>

      <li className="">
        <Link href="https://www.instagram.com/tikt">
          <div className="bg-accentGrey bg-opacity-50 p-3 text-2xl rounded-md hover:text-accent hover:bg-opacity-90">
            <SiInstagram />
          </div>
        </Link>
      </li>
      <li className="">
        <Link href="https://www.facebook.com/">
          <div className="bg-accentGrey bg-opacity-50 p-3 text-2xl rounded-md hover:text-accent hover:bg-opacity-90">
            <SiTiktok />
          </div>
        </Link>
      </li>
    </ul>
  );
}

export default SocialLinks;
