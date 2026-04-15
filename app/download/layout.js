import Link from 'next/link';

export const metadata = {
  title: 'Download Game - Teknologi Santuy',
  description: 'Halaman download mandiri untuk game dan software di Teknologi Santuy.',
};

export default function DownloadLayout({ children }) {
  return (
    <div className="download-layout bg-slate-50 text-slate-900">
      {children}
    </div>
  );
}
