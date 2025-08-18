import React, { useEffect, useRef } from 'react';
import JapanSvg from './assets/japan_map.svg?raw';

const PREFECTURE_NAME_TO_ID = { '北海道': 'JP-01', '青森県': 'JP-02', '岩手県': 'JP-03', '宮城県': 'JP-04', '秋田県': 'JP-05', '山形県': 'JP-06', '福島県': 'JP-07', '茨城県': 'JP-08', '栃木県': 'JP-09', '群馬県': 'JP-10', '埼玉県': 'JP-11', '千葉県': 'JP-12', '東京都': 'JP-13', '神奈川県': 'JP-14', '新潟県': 'JP-15', '富山県': 'JP-16', '石川県': 'JP-17', '福井県': 'JP-18', '山梨県': 'JP-19', '長野県': 'JP-20', '岐阜県': 'JP-21', '静岡県': 'JP-22', '愛知県': 'JP-23', '三重県': 'JP-24', '滋賀県': 'JP-25', '京都府': 'JP-26', '大阪府': 'JP-27', '兵庫県': 'JP-28', '奈良県': 'JP-29', '和歌山県': 'JP-30', '鳥取県': 'JP-31', '島根県': 'JP-32', '岡山県': 'JP-33', '広島県': 'JP-34', '山口県': 'JP-35', '徳島県': 'JP-36', '香川県': 'JP-37', '愛媛県': 'JP-38', '高知県': 'JP-39', '福岡県': 'JP-40', '佐賀県': 'JP-41', '長崎県': 'JP-42', '熊本県': 'JP-43', '大分県': 'JP-44', '宮崎県': 'JP-45', '鹿児島県': 'JP-46', '沖縄県': 'JP-47' };

const getPrefectureFromAddress = (address) => {
  if (!address) return null;
  for (const pref in PREFECTURE_NAME_TO_ID) {
    if (address.includes(pref)) {
      return pref;
    }
  }
  return null;
};

function JapanMap({ posts, onPinClick }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !posts || posts.length === 0) return;

    // SVGがDOMに挿入されるのを待つ
    const observer = new MutationObserver(() => {
        const svgElement = mapContainerRef.current.querySelector('svg');
        if (!svgElement) return;

        let defs = svgElement.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svgElement.prepend(defs);
        }

        // 投稿に基づいてSVG内のパスを塗りつぶす
        posts.forEach(post => {
            const prefectureName = getPrefectureFromAddress(post.address);
            if (!prefectureName) return;

            const prefectureId = PREFECTURE_NAME_TO_ID[prefectureName];
            const prefectureElement = svgElement.querySelector(`#${prefectureId}`);
            if (prefectureElement) {
                // パターンを動的に作成
                const patternId = `pattern-${post.id}`;
                const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
                pattern.setAttribute('id', patternId);
                pattern.setAttribute('x', '0');
                pattern.setAttribute('y', '0');
                pattern.setAttribute('width', '100%');
                pattern.setAttribute('height', '100%');
                pattern.setAttribute('viewBox', '0 0 1 1');
                pattern.setAttribute('preserveAspectRatio', 'xMidYMid slice');

                const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                image.setAttribute('href', `http://localhost:3001/uploads/${post.image}`);
                image.setAttribute('x', '0');
                image.setAttribute('y', '0');
                image.setAttribute('width', '1');
                image.setAttribute('height', '1');
                image.setAttribute('preserveAspectRatio', 'xMidYMid slice');

                pattern.appendChild(image);
                defs.appendChild(pattern);

                // パスをパターンで塗りつぶし、イベントリスナーを追加
                prefectureElement.style.fill = `url(#${patternId})`;
                prefectureElement.style.cursor = 'pointer';

                // 重複して追加されないように注意
                prefectureElement.onclick = () => onPinClick(post);
            }
        });

        observer.disconnect();
    });

    observer.observe(mapContainerRef.current, { childList: true });

    // コンポーネントがアンマウントされたらイベントリスナーをクリーンアップ
    return () => {
        const svgElement = mapContainerRef.current?.querySelector('svg');
        if (svgElement) {
            posts.forEach(post => {
                const prefectureName = getPrefectureFromAddress(post.address);
                if (prefectureName) {
                    const prefectureId = PREFECTURE_NAME_TO_ID[prefectureName];
                    const prefectureElement = svgElement.querySelector(`#${prefectureId}`);
                    if (prefectureElement) {
                        prefectureElement.onclick = null;
                    }
                }
            });
        }
        observer.disconnect();
    };
  }, [posts, onPinClick]);

  return (
    <div style={{ position: 'relative' }}>
      <div 
        ref={mapContainerRef} 
        dangerouslySetInnerHTML={{ __html: JapanSvg }} 
        style={{ width: '100%', height: 'auto' }} 
      />
    </div>
  );
}

export default JapanMap;