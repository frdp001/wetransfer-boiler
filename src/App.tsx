/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { ContactPage } from './pages/Contact';
import { NotFoundPage } from './pages/NotFound';
import { SecurityProvider } from './components/SecurityProvider';

const TidGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tid = params.get('tid');

  if (!tid) {
    return <NotFoundPage />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <SecurityProvider>
      <Router>
        <TidGuard>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </TidGuard>
      </Router>
    </SecurityProvider>
  );
}
