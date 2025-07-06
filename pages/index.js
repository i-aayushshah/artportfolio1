import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import PortfolioSection from '../components/PortfolioSection';
import ContactSection from '../components/ContactSection';

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [heroData, setHeroData] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [artworksRes, heroRes, aboutRes, footerRes] = await Promise.all([
          fetch('/api/artworks'),
          fetch('/api/hero'),
          fetch('/api/about'),
          fetch('/api/footer')
        ]);

        // Parse responses (don't throw error if some fail, use fallbacks)
        const [artworksData, heroData, aboutData, footerData] = await Promise.all([
          artworksRes.ok ? artworksRes.json() : { success: false, data: [] },
          heroRes.ok ? heroRes.json() : { success: false, data: null },
          aboutRes.ok ? aboutRes.json() : { success: false, data: null },
          footerRes.ok ? footerRes.json() : { success: false, data: null }
        ]);

        // Set state with safe fallbacks
        setArtworks(Array.isArray(artworksData.data) ? artworksData.data : []);
        setHeroData(heroData.data || null);
        setAboutData(aboutData.data || null);
        setFooterData(footerData.data || null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-amber-950 to-green-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-amber-100 text-xl">Loading your artistic journey...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-amber-950 to-green-950 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-amber-100 text-2xl mb-2">Oops! Something went wrong</h1>
            <p className="text-amber-200 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-900 text-amber-100 px-6 py-3 rounded-full hover:bg-amber-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout footerData={footerData}>
      <HeroSection data={heroData} />
      <AboutSection data={aboutData} />
      <PortfolioSection artworks={artworks} limit={6} showExploreButton={true} />
      <ContactSection />
    </Layout>
  );
}
