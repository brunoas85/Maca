import { useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ProductPage } from "./pages/ProductPage";
import { AdminBeersPage } from "./pages/admin/AdminBeersPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";

function PublicLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-svh flex-col">
      <Header onCartClick={() => setCartOpen(true)} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/cervezas/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOrdersPage />} />
        <Route path="cervezas" element={<AdminBeersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
