import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import Description from '../components/home/Description';
import HowItWorks from '../components/home/HowItWorks';
import CallToAction from '../components/home/CallToAction';

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <Description />
      <HowItWorks />
      <CallToAction />
    </Layout>
  );
};

export default Home;
