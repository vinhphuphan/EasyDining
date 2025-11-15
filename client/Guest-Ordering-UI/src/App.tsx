import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { CartProvider } from "./contexts/CartContext";


const App = () => (
    <Provider store={store}>
        <CartProvider>
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    </Provider>
);

export default App;
