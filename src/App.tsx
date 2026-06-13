import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { NotificationsProvider } from "@/context/NotificationsContext";
import ScrollToTop from "@/components/ScrollToTop";

// Layouts

import PublicLayout from "@/components/layout/PublicLayout";
import ClientLayout from "@/components/layout/ClientLayout";
import ProfessionalLayout from "@/components/layout/ProfessionalLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Pages
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import CompleteProfilePage from "@/pages/auth/CompleteProfilePage";
import RecoverPasswordPage from "@/pages/auth/RecoverPasswordPage";
import NewPasswordPage from "@/pages/auth/NewPasswordPage";
import PasswordResetSuccessPage from "@/pages/auth/PasswordResetSuccessPage";
import CategoriesPage from "@/pages/public/CategoriesPage";

// Public Institutional Pages
import ProtectedPaymentPage from "@/pages/public/ProtectedPaymentPage";
import VerifiedSpecialistsPage from "@/pages/public/VerifiedSpecialistsPage";
import SatisfactionGuaranteePage from "@/pages/public/SatisfactionGuaranteePage";
import SecurityPage from "@/pages/public/SecurityPage";
import HowItWorksPage from "@/pages/public/HowItWorksPage";
import BeATechnicianPage from "@/pages/public/BeATechnicianPage";
import TermsOfUsePage from "@/pages/public/TermsOfUsePage";

// Client Pages
import ServiceDetailsPage from "@/pages/client/ServiceDetailsPage";
import ClientDashboardPage from "@/pages/client/ClientDashboardPage";
import CheckoutFlow from "@/pages/client/CheckoutFlow";
import HelpPage from "@/pages/client/HelpPage";
import SettingsPage from "@/pages/client/SettingsPage";
import MyOrdersPage from "@/pages/client/MyOrdersPage";
import ProfilePage from "@/pages/client/ProfilePage";
import OrderStatusPage from "@/pages/client/OrderStatusPage";
import NewServiceRequestPage from "@/pages/client/NewServiceRequestPage";
import NotificationsPage from "@/pages/client/NotificationsPage";
import LevelsPage from "@/pages/client/LevelsPage";
import BuscaPage from "@/pages/client/BuscaPage";
import ExploreServicesPage from "@/pages/client/ExploreServicesPage";
import ProfessionalProfilePage from "@/pages/client/ProfessionalProfilePage";
import CheckoutCounterOfferPage from "@/pages/client/CheckoutCounterOfferPage";
import OrderReceiptPage from "@/pages/client/OrderReceiptPage";

// Professional Pages
import ProfessionalDashboardPage from "@/pages/professional/ProfessionalDashboardPage";
import ProfessionalServicesPage from "@/pages/professional/ProfessionalServicesPage";
import ProfessionalFinancePage from "@/pages/professional/ProfessionalFinancePage";
import ProfessionalSettingsPage from "@/pages/professional/ProfessionalSettingsPage";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminWithdrawalsPage from "@/pages/admin/AdminWithdrawalsPage";
import AdminServicesPage from "@/pages/admin/AdminServicesPage";
import NotFound from "@/pages/NotFound";
import { useAutoLogout } from "@/hooks/useAutoLogout";

const queryClient = new QueryClient();

const AutoLogoutHandler = () => {
  useAutoLogout();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <NotificationsProvider>
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <BrowserRouter>
            <AutoLogoutHandler />
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cadastro" element={<RegisterPage />} />
                <Route path="/completar-cadastro" element={<CompleteProfilePage />} />
                <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
                <Route path="/nova-senha" element={<NewPasswordPage />} />
                <Route path="/senha-resetada" element={<PasswordResetSuccessPage />} />
                <Route path="/categorias" element={<CategoriesPage />} />
                
                {/* Institutional / Safety Footer Pages */}
                <Route path="/pagamento-protegido" element={<ProtectedPaymentPage />} />
                <Route path="/especialistas-verificados" element={<VerifiedSpecialistsPage />} />
                <Route path="/garantia-satisfacao" element={<SatisfactionGuaranteePage />} />
                <Route path="/seguranca" element={<SecurityPage />} />
                <Route path="/como-funciona" element={<HowItWorksPage />} />
                <Route path="/seja-um-tecnico" element={<BeATechnicianPage />} />
                <Route path="/termos-de-uso" element={<TermsOfUsePage />} />
              </Route>

              <Route path="/cliente" element={<ClientLayout />}>
                <Route path="dashboard" element={<ClientDashboardPage />} />
                <Route path="busca" element={<BuscaPage />} />
                <Route path="servicos" element={<ExploreServicesPage />} />
                <Route path="niveis" element={<LevelsPage />} />
                <Route path="servico/:id" element={<ServiceDetailsPage />} />
                <Route path="contratar/:id/*" element={<CheckoutFlow />} />
                <Route path="meus-pedidos" element={<MyOrdersPage />} />
                <Route path="perfil" element={<ProfilePage />} />
                <Route path="ajuda" element={<HelpPage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
                <Route path="pedido/:id/status" element={<OrderStatusPage />} />
                <Route path="pedido/:id/os" element={<OrderReceiptPage />} />
                <Route path="novo-servico" element={<NewServiceRequestPage />} />
                <Route path="notificacoes" element={<NotificationsPage />} />
                <Route path="profissional/:id" element={<ProfessionalProfilePage />} />
                <Route path="pedido/:id/pagamento" element={<CheckoutCounterOfferPage />} />
              </Route>

              {/* Standalone Notificações Route using ClientLayout structure */}
              <Route path="/notificacoes" element={<ClientLayout />}>
                <Route index element={<NotificationsPage />} />
              </Route>

              {/* Professional Routes */}
              <Route path="/profissional" element={<ProfessionalLayout />}>
                <Route path="dashboard" element={<ProfessionalDashboardPage />} />
                <Route path="servicos" element={<ProfessionalServicesPage />} />
                <Route path="financeiro" element={<ProfessionalFinancePage />} />
                <Route path="configuracoes" element={<ProfessionalSettingsPage />} />
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
      </NotificationsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;