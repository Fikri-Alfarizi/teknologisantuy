import GameStoreClient from './GameStoreClient';

export const metadata = {
  title: "Request Game - Teknologi Santuy",
  description: "Cari dan request game dari katalog Steam untuk di-upload ke Discord teknologi santuy.",
};

export default function RequestGamePage() {
  return (
    <>
      <GameStoreClient />
    </>
  );
}
