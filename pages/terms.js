//* Public Page
import React from 'react';
import Layout from '../components/Layout';
import djTerms from '/utils/djTerms';

export default function Terms() {
  return (
    <Layout>
      <div className="min-h-full p-10">
        <h1 className="mx-auto text-primary dark:text-primaryDark mt-20 text-5xl md:text-7xl font-medium">
          Terms
        </h1>
        <div className="col-span-1 space-y-4">
          <p className="mt-12">
            If you accept our offer to place you at a gig, these are the terms
            of the agreement you enter into:
          </p>
          <ul className="space-y-4 list-disc">
            {djTerms.map((term, i) => {
              return (
                <div key={i} className="space-y-4">
                  <h3 className="text-xl">{`${i + 1}. ${term.title}`}</h3>
                  <p>{`${term.content}`}</p>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
