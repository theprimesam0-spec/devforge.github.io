import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MenuBar from './components/layout/MenuBar';
import Footer from './components/layout/Footer';
import MarqueeStrip from './components/layout/MarqueeStrip';
import Hero from './components/home/Hero';
import ServicesGrid from './components/home/ServicesGrid';
import ScriptConverter from './components/home/ScriptConverter';
import LocalSupport from './components/home/LocalSupport';
import DevForgeAI from './components/ai/DevForgeAI';
const DescriptionSection = lazy(() => import('./components/home/DescriptionSection'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
import SignInPage from './components/auth/SignInPage';
import { useEffect } from 'react';
import BackgroundVideo from './components/layout/BackgroundVideo';

function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <ScriptConverter />
      <LocalSupport />
      <Suspense fallback={null}>
        <DescriptionSection />
      </Suspense>
    </>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    let lastTriggeredAt = 0;
    const handleKeyDown = (event: KeyboardEvent) => {
      // Secure admin shortcut: Ctrl + Windows (Meta) + Alt
      // Order doesn't matter; using modifier flags keeps it reliable.
      if (event.ctrlKey && event.altKey && event.metaKey) {
        const now = Date.now();
        if (now - lastTriggeredAt < 800) return;
        lastTriggeredAt = now;
        event.preventDefault();
        navigate('/admin');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <Routes>
      {/* Sign-in page: full-screen, no MenuBar/Footer */}
      <Route path="/sign-in/*" element={<SignInPage />} />

      {/* All other pages: with MenuBar + Footer */}
      <Route
        path="*"
        element={
          <>
            <BackgroundVideo />
            <MenuBar />
            <main style={{ flex: 1, paddingTop: 'var(--menu-bar-height)' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={null}>
                      <AdminDashboard />
                    </Suspense>
                  }
                />
              </Routes>
            </main>
            <MarqueeStrip />
            <Footer />
            <DevForgeAI />
          </>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  );
}
