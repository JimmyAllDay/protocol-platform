import axios from 'axios';
import Layout from '../components/Layout';
import { useState } from 'react';

export default function Wordpress() {
  const [result, setResult] = useState('Not clicked');
  const handler = async () => {
    try {
      const response = await axios.get(
        'http://protocol-headless.local/wp-json/'
      );
      console.log('Headless wordpress api respnose: ', response);
      if (response.statusText === 'OK') {
        setResult('Check console for routes');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl text-primary mt-10">Wordpress CMS test page</h1>
      <button onClick={handler} className="primary-button max-w-xs mt-4">
        Fetch
      </button>
      <h1 className="text-xl text-primary mt-10">{result}</h1>
    </Layout>
  );
}
