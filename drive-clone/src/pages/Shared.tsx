import React from 'react';
import Layout from '../components/Layout';
import { Users } from 'lucide-react';

const Shared: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Shared with me</h3>
          <p className="mt-1 text-sm text-gray-500">
            Sharing is not set up yet. Items shared with you will appear here.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Shared;


