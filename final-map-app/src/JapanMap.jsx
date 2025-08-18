import React, { useState, useEffect, useRef } from 'react';
import JapanSvg from './assets/japan_map.svg?raw';

// 都道府県名からSVGで使うIDを引くための対応表
const PREFECTURE_NAME_TO_ID = {
  '北海道': 'JP-01', '青森県': 'JP-02', '岩手県': 'JP-03', '宮城県': 'JP-04',
  '秋田県': 'JP-05', '山形県': 'JP-06', '福島県': 'JP-07', '茨城県': 'JP-08',
  '栃木県': 'JP-09', '群馬県': 'JP-10', '埼玉県': 'JP-11', '千葉県': 'JP-12',
  '東京都': 'JP-13', '神奈川県': 'JP-14','新潟県': 'JP-15', '富山県': 'JP-16',
  '石川県': 'JP-17', '福井県': 'JP-18', '山梨県': 'JP-19', '長野県': 'JP-20',
  '岐阜県': 'JP-21', '静岡県': 'JP-22', '愛知県': 'JP-23', '三重県': 'JP-24',
  '滋賀県': 'JP-25', '京都府': 'JP-26', '大阪府': 'JP-27', '兵庫県': 'JP-28',
  '奈良県': 'JP-29', '和歌山県': 'JP-30','鳥取県': 'JP-31', '島根県': 'JP-32',
  '岡山県': 'JP-33', '広島県': 'JP-34', '山口県': 'JP-35', '徳島県': 'JP-36',
  '香川県': 'JP-37', '愛媛県': 'JP-38', '高知県': 'JP-39', '福岡県': 'JP-40',
  '佐賀県': 'JP-41', '長崎県': 'JP-42', '熊本県': 'JP-43', '大分県': 'JP-44',
  '宮崎県': 'JP-45', '鹿児島県': 'JP-46','沖縄県': 'JP-47'
};

// 住所の文字列から都道府県名を抜き出すための簡単な関数
const getPrefectureFromAddress = (address) => {
  if (!address) return null;
  for (const pref in PREFECTURE_NAME_TO_ID) {
    if (address.includes(pref)) {
      return pref;
    }
  }
  return null;
};

function JapanMap({ posts }) {
  const [imagePositions, setImagePositions] = useState([]);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !posts) return;

    const mapRect = mapContainerRef.current.getBoundingClientRect();
    const newPositions = [];

    posts.forEach(post => {
      const prefectureName = getPrefectureFromAddress(post.address);
      if (!prefectureName || !post.image) return;

      const prefectureId = PREFECTURE_NAME_TO_ID[prefectureName];
      const prefectureElement = mapContainerRef.current.querySelector(`#${prefectureId}`);

      if (prefectureElement) {
        const rect = prefectureElement.getBoundingClientRect();
        const x = rect.left - mapRect.left + rect.width / 2;
        const y = rect.top - mapRect.top + rect.height / 2;

        newPositions.push({
          id: post.id,
          x: x,
          y: y,
          image: post.image,
          text: post.text
        });
      }
    });
    setImagePositions(newPositions);
  }, [posts]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={mapContainerRef}
        dangerouslySetInnerHTML={{ __html: JapanSvg }}
        style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
      />
      {imagePositions.map(pos => (
        <img
          key={pos.id}
          src={`http://localhost:3001/uploads/${pos.image}`}
          alt={pos.text}
          style={{
            position: 'absolute',
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 0 5px rgba(0,0,0,0.5)',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        />
      ))}
    </div>
  );
}

export default JapanMap;