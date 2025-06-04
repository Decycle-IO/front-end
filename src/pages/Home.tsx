import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ProblemSolution from '../components/home/ProblemSolution';
import HowItWorks from '../components/home/HowItWorks';
import Technology from '../components/home/Technology';
import CallToAction from '../components/home/CallToAction';

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <Technology />
      <CallToAction />
    </Layout>
  );
};

export default Home;
