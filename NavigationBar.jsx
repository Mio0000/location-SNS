// NavigationBar.jsx

import { IoHome, IoSearch, IoAddCircle, IoPerson } from "react-icons/io5";
import './NavigationBar.css'; // スタイルは別のCSSファイルに書くとキレイ！

function NavigationBar() {
  return (
    <nav className="navbar">
      <IoHome size={28} />      {/* ホーム */}
      <IoSearch size={28} />   {/* 検索 */}
      <IoAddCircle size={40} /> {/* 投稿 */}
      <IoPerson size={28} />   {/* マイページとか */}
    </nav>
  );
}

export default NavigationBar;