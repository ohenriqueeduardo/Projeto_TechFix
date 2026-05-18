import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import ClientLayout from "@/components/layout/ClientLayout";

// Pages
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ExploreServicesPage from "@/pages/client/ExploreServicesPage";
import ServiceDetailsPage from "@/pages/client/ServiceDetailsPage";
import ClientDashboardPage from "@/pages/client/ClientDashboardPage";
import CheckoutFlow from "@/pages/client/CheckoutFlow";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
          </Route>

          {/* Client Routes */}
          <Route path="/cliente" element={<ClientLayout />}>
            <Route path="dashboard" element={<ClientDashboardPage />} />
            <Route path="servicos" element={<ExploreServicesPage />} />
            <Route path="busca" element={<ExploreServicesPage />} />
            <Route path="servico/:id" element={<ServiceDetailsPage />} />
            <Route path="contratar/:id/*" element={<CheckoutFlow />} />
            <Route path="meus-pedidos" element={<div className="p-8"><h1>Meus Pedidos</h1></div>} />
            <Route path="perfil" element={<div className="p-8"><h1>Perfil</h1></div>} />
            <Route path="chat/:id" element={<div className="p-8"><h1>Chat</h1></div>} />
          </Route>

          {/* Professional & Admin placeholders */}
          <Route path="/profissional/dashboard" element={<div className="p-8"><h1>Professional Dashboard</h1></div>} />
          <Route path="/admin/dashboard" element={<div className="p-8"><h1>Admin Dashboard</h1></div>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;