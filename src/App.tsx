import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import Produto from "./pages/Produto";
import Acessorios from "./pages/Acessorios";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";
import CheckoutSucesso from "./pages/CheckoutSucesso";
import Favoritos from "./pages/Favoritos";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Conta from "./pages/Conta";
import PoliticaReserva from "./pages/PoliticaReserva";
import Termos from "./pages/Termos";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";
import AgendarVisita from "./pages/AgendarVisita";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/:slug" element={<Produto />} />
          <Route path="/acessorios" element={<Acessorios />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/sucesso" element={<CheckoutSucesso />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/conta" element={<Conta />} />
          <Route path="/politica-de-reserva" element={<PoliticaReserva />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/agendar-visita" element={<AgendarVisita />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
