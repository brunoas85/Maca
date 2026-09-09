import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ProductPage } from "./pages/ProductPage";

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-svh flex-col">
      <Header onCartClick={() => setCartOpen(true)} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/cervezas/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
