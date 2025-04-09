
import React from 'react';
import Layout from '@/components/layout/Layout';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <SignupForm />
      </div>
    </Layout>
  );
};

export default SignupPage;
