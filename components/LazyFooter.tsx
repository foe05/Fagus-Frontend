import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('./Footer'), {
  loading: () => (
    <footer role="contentinfo" className="bg-primary text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-white/60">Loading...</div>
        </div>
      </div>
    </footer>
  ),
  ssr: true,
});

export default Footer;
