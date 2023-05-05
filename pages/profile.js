import Layout from '../components/Layout';
import { useState } from 'react';

export default function About() {
  const [upload, setUpload] = useState(false);
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center h-full bg-primary text-primary font-mono space-y-4">
        <h1 className="text-2xl">Profile</h1>
        <div className="max-w-xl w-full h-3/4">
          <div className="border flex max-w-xl h-full">
            <div className="border flex flex-col w-1/4">
              <button
                className={`${
                  upload
                    ? 'bg-primary text-accentGray'
                    : 'bg-accent bg-opacity-30 text-accent'
                }`}
                onClick={() => setUpload(false)}
              >
                Details
              </button>
              <button
                className={`${
                  upload
                    ? 'bg-accent bg-opacity-30 text-accent'
                    : 'bg-primary text-accentGray'
                }`}
                onClick={() => setUpload(true)}
              >
                Upload
              </button>
            </div>
            <div className="border flex flex-col w-3/4">
              {upload ? <div>Upload</div> : <div>Details</div>}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
