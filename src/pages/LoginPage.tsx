
import React from 'react';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;
