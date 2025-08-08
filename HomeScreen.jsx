// HomeScreen.jsx

import MapView from './MapView';
import NavigationBar from './NavigationBar';
import './HomeScreen.css';

function HomeScreen() {
  return (
    <div className="home-screen">
      {/* ここがメインのコンテンツ表示エリア */}
      <main className="content">
        <MapView /> {/* とりあえず地図コンポーネントを置いとく */}
      </main>

      {/* ナビゲーションバーを一番下に配置 */}
      <NavigationBar />
    </div>
  );
}

export default HomeScreen;