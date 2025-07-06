import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, footerData }) => {
  return (
    <div className="flex flex-col min-h-screen font-georgia">
      <Head>
        <title>Subekshya's Artistry</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Georgia&display=swap" rel="stylesheet" />
      </Head>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer footerData={footerData} />
    </div>
  );
};

export default Layout;
