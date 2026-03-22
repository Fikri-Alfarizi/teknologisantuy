import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GeminiChat from '../components/GeminiChat';
import AnalyticsTracker from '../components/AnalyticsTracker';

export default function MainLayout({ children }) {
  return (
    <>
      <AnalyticsTracker />
      <Navbar />
      {children}
      <Footer />
      <GeminiChat />
    </>
  );
}
