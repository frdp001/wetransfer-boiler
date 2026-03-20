/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { ContactPage } from './pages/Contact';
import { ReportPhishingPage } from './pages/ReportPhishing';
import { SecurityProvider } from './components/SecurityProvider';

export default function App() {
  return (
    <SecurityProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/report-phishing" element={<ReportPhishingPage />} />
          </Routes>
        </Layout>
      </Router>
    </SecurityProvider>
  );
}
