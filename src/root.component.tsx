import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Laboratory from './laboratory.component';

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={`${window.spaBase}/home/laboratory`}>
      <Routes>
        <Route path="/" element={<Laboratory />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
