import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import ClientLayout from "@/components/layout/ClientLayout";
import ProfessionalLayout from "@/components/layout/ProfessionalLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Pages
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ExploreServicesPage from "@/pages/client/ExploreServicesPage";
import ServiceDetailsPage from "@/pages/client/ServiceDetailsPage";
import ClientDashboardPage from "@/pages/client/ClientDashboardPage";
import CheckoutFlow from "@/pages/client/CheckoutFlow";
import HelpPage from "@/pages/client/HelpPage";
import SettingsPage from "@/pages/client/SettingsPage";
import MyOrdersPage from "@/pages/client/MyOrdersPage";
import ProfilePage from "@/pages/client/ProfilePage";
import ChatPage from "@/pages/client/ChatPage";
import ProfessionalDashboardPage from "@/pages/professional/ProfessionalDashboardPage";
import ProfessionalServicesPage from "@/pages/professional/ProfessionalServicesPage";
import ProfessionalFinancePage from "@/pages/professional/ProfessionalFinancePage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminWithdrawalsPage from "@/pages/admin/AdminWithdrawalsPage";
import AdminServicesPage from "@/pages/admin/AdminServicesPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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
              <Route path="meus-pedidos" element={<MyOrdersPage />} />
              <Route path="perfil" element={<ProfilePage />} />
              <Route path="chat/:id" element={<ChatPage />} />
              <Route path="ajuda" element={<HelpPage />} />
              <Route path="configuracoes" element={<SettingsPage />} />
            </Route>

            {/* Professional Routes */}
            <Route path="/profissional" element={<ProfessionalLayout />}>
              <Route path="dashboard" element={<ProfessionalDashboardPage />} />
              <Route path="servicos" element={<ProfessionalServicesPage />} />
              <Route path="financeiro" element={<ProfessionalFinancePage />} />
              <Route path="chat/:id" element={<ChatPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="usuarios" element={<AdminUsersPage />} />
              <Route path="saques" element={<AdminWithdrawalsPage />} />
              <Route path="servicos" element={<AdminServicesPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;