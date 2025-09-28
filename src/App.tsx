import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GroupLeaderRegistration from './components/GroupLeaderRegistration';
import MemberJoin from './components/MemberJoin';
import ManagingDashboard from './components/ManagingDashboard';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GroupLeaderRegistration />} />
          <Route path="join" element={<MemberJoin />} />
          <Route path="dashboard" element={<ManagingDashboard />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;