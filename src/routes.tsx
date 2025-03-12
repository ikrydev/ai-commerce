import { BrowserRouter, Routes, Route } from 'react-router';

import Home from './pages/home';
import ProductDetail from './pages/product-detail';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:path" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
