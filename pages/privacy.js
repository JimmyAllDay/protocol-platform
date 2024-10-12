//* Public Page
import React from 'react';
import Layout from '../components/Layout';
import privacyPolicyInfo from '/utils/privacyPolicy';

export default function Privacy() {
  return (
    <Layout>
      <div className="min-h-full p-10">
        <h1 className="mx-auto text-primary dark:text-primaryDark mt-20 text-5xl md:text-7xl font-medium">
          Privacy{' '}
        </h1>
        <div className="col-span-1 space-y-4">
          <p className="mt-12">Here&apos;s our privacy policy:</p>
          <ul className="space-y-6 list-disc">
            {privacyPolicyInfo.map((policy, i) => {
              return (
                <div key={i} className="space-y-4">
                  <h3 className="text-xl font-bold">{`${i + 1}. ${
                    policy.title
                  }`}</h3>
                  <p>{`${policy.content}`}</p>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
