import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PortfolioSection from '../components/PortfolioSection';
import ArtDialog from '../components/ArtDialog';

export default function Portfolio() {
  const [artworks, setArtworks] = useState([]);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch artworks and footer data
        const [artworksRes, footerRes] = await Promise.all([
          fetch('/api/artworks'),
          fetch('/api/footer')
        ]);

        const [artworksData, footerData] = await Promise.all([
          artworksRes.ok ? artworksRes.json() : { success: false, data: [] },
          footerRes.ok ? footerRes.json() : { success: false, data: null }
        ]);

        setArtworks(Array.isArray(artworksData.data) ? artworksData.data : []);
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

  // Handle dialog URL parameters for shared links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dialogOpen = urlParams.get('dialog') === 'true';
    const artworkId = urlParams.get('id');

    if (dialogOpen && artworkId && artworks.length > 0) {
      const artwork = artworks.find(art => art.id.toString() === artworkId);
      if (artwork) {
        setSelectedArtwork(artwork);
      }
    }
  }, [artworks]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-amber-950 to-green-950 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-amber-100 text-xl">Loading gallery...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-amber-950 to-green-950 flex items-center justify-center pt-20">
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
      <div className="pt-20">
        <PortfolioSection
          artworks={artworks}
          showExploreButton={false}
          onArtworkSelect={setSelectedArtwork}
        />
      </div>
      {selectedArtwork && (
        <ArtDialog artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
      )}
    </Layout>
  );
}
