//* Public Page
import React from 'react';
import Layout from '../components/Layout';
import faqs from '/utils/faqs';

export default function FAQs() {
  return (
    <Layout>
      <div className="min-h-full p-10">
        <h1 className="mx-auto text-primary dark:text-primaryDark mt-20 text-5xl md:text-7xl font-medium">
          FAQs{' '}
        </h1>
        <div className="col-span-1 space-y-4">
          <p className="mt-12">
            Answers to questions that may or may not be asked frequently:
          </p>
          <ul className="space-y-6 list-disc">
            {faqs.map((faq, i) => {
              return (
                <div key={i} className="space-y-4">
                  <h3 className="text-xl">{`${faq.question}`}</h3>
                  <p>{`${faq.answer}`}</p>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
