import Link from 'next/link';
import Image from 'next/image';

import { SiTiktok, SiFacebook, SiInstagram } from 'react-icons/si';

function SocialLinks() {
  return (
    <ul className="flex flex-col justify-end space-y-2">
      <li className="ms-auto">
        <Link href="https://www.facebook.com/">
          <div className="bg-accentGrey bg-opacity-50 p-3 text-2xl rounded-md mr-4 hover:text-accent hover:bg-opacity-90 ms-auto">
            <SiFacebook />
          </div>
        </Link>
      </li>

      <li className="ms-auto">
        <Link href="https://www.instagram.com/tikt">
          <div className="bg-accentGrey bg-opacity-50 p-3 text-2xl rounded-md mr-4 hover:text-accent hover:bg-opacity-90">
            <SiInstagram />
          </div>
        </Link>
      </li>
      <li className="ms-auto">
        <Link href="https://www.facebook.com/">
          <div className="bg-accentGrey bg-opacity-50 p-3 text-2xl rounded-md mr-4 hover:text-accent hover:bg-opacity-90">
            <SiTiktok />
          </div>
        </Link>
      </li>
    </ul>
  );
}

export default SocialLinks;
