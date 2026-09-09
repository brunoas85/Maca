import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CartDrawer } from "./components/CartDrawer";
import { Header } from "./components/Header";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ProductPage } from "./pages/ProductPage";

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-svh">
      <Header onCartClick={() => setCartOpen(true)} />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/cervezas/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
