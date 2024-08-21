import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LaboratoryDashboard from './laboratory-dashboard.component';

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={`${window.spaBase}/home/laboratory`}>
      <Routes>
        <Route path="/" element={<LaboratoryDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
