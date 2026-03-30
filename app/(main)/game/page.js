import GameStoreClient from './GameStoreClient';
import ErrorReportClient from './ErrorReportClient';

export const metadata = {
  title: "Game Store - Teknologi Santuy",
  description: "Katalog download game gratis dengan interface ala Steam. Pilih dan request game untuk di-upload ke Discord kami.",
};

export default function GamePage() {
  return (
    <>
      {/* Murni me-render Client Component Steam Store */}
      <GameStoreClient />
      
      {/* Tetap pertahankan error report client in case user visits from old link */}
      <ErrorReportClient />
    </>
  );
}
