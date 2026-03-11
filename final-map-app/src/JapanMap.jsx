import React, { useRef, useState, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const GEO_URL = "https://raw.githubusercontent.com/dataofjapan/land/master/japan.topojson";

const PREFECTURE_NAME_TO_ID = {
  '北海道': 'JP-01', '青森県': 'JP-02', '岩手県': 'JP-03', '宮城県': 'JP-04',
  '秋田県': 'JP-05', '山形県': 'JP-06', '福島県': 'JP-07', '茨城県': 'JP-08',
  '栃木県': 'JP-09', '群馬県': 'JP-10', '埼玉県': 'JP-11', '千葉県': 'JP-12',
  '東京都': 'JP-13', '神奈川県': 'JP-14', '新潟県': 'JP-15', '富山県': 'JP-16',
  '石川県': 'JP-17', '福井県': 'JP-18', '山梨県': 'JP-19', '長野県': 'JP-20',
  '岐阜県': 'JP-21', '静岡県': 'JP-22', '愛知県': 'JP-23', '三重県': 'JP-24',
  '滋賀県': 'JP-25', '京都府': 'JP-26', '大阪府': 'JP-27', '兵庫県': 'JP-28',
  '奈良県': 'JP-29', '和歌山県': 'JP-30', '鳥取県': 'JP-31', '島根県': 'JP-32',
  '岡山県': 'JP-33', '広島県': 'JP-34', '山口県': 'JP-35', '徳島県': 'JP-36',
  '香川県': 'JP-37', '愛媛県': 'JP-38', '高知県': 'JP-39', '福岡県': 'JP-40',
  '佐賀県': 'JP-41', '長崎県': 'JP-42', '熊本県': 'JP-43', '大分県': 'JP-44',
  '宮崎県': 'JP-45', '鹿児島県': 'JP-46', '沖縄県': 'JP-47',
};

const getPrefectureFromAddress = (address) => {
  if (!address) return null;
  for (const pref in PREFECTURE_NAME_TO_ID) {
    if (address.includes(pref)) return pref;
  }
  return null;
};

// GeoJSON Feature から重心座標 [lng, lat] を計算
const getFeatureCentroid = (geo) => {
  const { geometry } = geo;
  let ring;
  if (geometry.type === 'Polygon') {
    ring = geometry.coordinates[0];
  } else if (geometry.type === 'MultiPolygon') {
    // 最大ポリゴンを選択
    ring = geometry.coordinates.reduce((a, b) =>
      a[0].length > b[0].length ? a : b
    )[0];
  }
  if (!ring || ring.length === 0) return [137, 37];
  return [
    ring.reduce((s, c) => s + c[0], 0) / ring.length,
    ring.reduce((s, c) => s + c[1], 0) / ring.length,
  ];
};

// ズーム時のピンオフセット（経度・緯度）
const PIN_GEO_OFFSETS = [
  [-0.4, 0.3], [0, 0.3], [0.4, 0.3],
  [-0.4, -0.3], [0, -0.3], [0.4, -0.3],
];

function JapanMap({ posts, onPrefectureClick }) {
  const transformRef = useRef(null);
  const [zoomedPrefId, setZoomedPrefId] = useState(null);
  const centroidsRef = useRef({});

  const topPostByPrefecture = useMemo(() => {
    const map = new Map();
    posts.forEach(post => {
      if (!post.image) return;
      const prefName = getPrefectureFromAddress(post.address);
      if (!prefName) return;
      const prefId = PREFECTURE_NAME_TO_ID[prefName];
      const existing = map.get(prefId);
      if (!existing || (post.likes || 0) > (existing.likes || 0)) {
        map.set(prefId, post);
      }
    });
    return map;
  }, [posts]);

  const postCountByPrefecture = useMemo(() => {
    const counts = new Map();
    posts.forEach(post => {
      const prefName = getPrefectureFromAddress(post.address);
      if (!prefName) return;
      const prefId = PREFECTURE_NAME_TO_ID[prefName];
      counts.set(prefId, (counts.get(prefId) || 0) + 1);
    });
    return counts;
  }, [posts]);

  const zoomedPrefName = zoomedPrefId
    ? Object.entries(PREFECTURE_NAME_TO_ID).find(([, id]) => id === zoomedPrefId)?.[0]
    : null;
  const postsInZoomed = zoomedPrefName
    ? posts.filter(p => getPrefectureFromAddress(p.address) === zoomedPrefName)
    : [];

  const handlePrefClick = (prefName, prefId) => {
    setZoomedPrefId(prefId);
    onPrefectureClick(prefName);
    setTimeout(() => {
      if (transformRef.current) {
        const el = document.getElementById(prefId);
        if (el) transformRef.current.zoomToElement(el, undefined, 400, 'easeOut');
      }
    }, 50);
  };

  const handleReset = () => {
    setZoomedPrefId(null);
    if (transformRef.current) transformRef.current.resetTransform(400);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
      {zoomedPrefId && (
        <button className="map-reset-btn" onClick={handleReset}>
          ← 地図に戻る
        </button>
      )}
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.5}
        maxScale={20}
        centerOnInit
      >
        <TransformComponent>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [137, 38], scale: 1600 }}
            width={900}
            height={1000}
            style={{ width: '100%', height: '100%', maxHeight: 'calc(100vh - 56px)' }}
          >
            <defs>
              {Array.from(topPostByPrefecture.entries()).map(([prefId, post]) => (
                <pattern
                  key={prefId}
                  id={`pattern-${prefId}`}
                  x="0" y="0"
                  width="1" height="1"
                  viewBox="0 0 1 1"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <image
                    href={`http://localhost:3001/uploads/${post.image}`}
                    x="0" y="0"
                    width="1" height="1"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              ))}
            </defs>

            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const prefId = `JP-${String(geo.properties.id).padStart(2, '0')}`;
                  const prefName = Object.entries(PREFECTURE_NAME_TO_ID)
                    .find(([, id]) => id === prefId)?.[0];
                  if (!prefName) return null;

                  const centroid = getFeatureCentroid(geo);
                  centroidsRef.current[prefId] = centroid;

                  const post = topPostByPrefecture.get(prefId);
                  const count = postCountByPrefecture.get(prefId);

                  return (
                    <React.Fragment key={geo.rsmKey}>
                      <Geography
                        id={prefId}
                        geography={geo}
                        fill={post ? `url(#pattern-${prefId})` : '#dce8ec'}
                        stroke="white"
                        strokeWidth={0.8}
                        onClick={() => handlePrefClick(prefName, prefId)}
                        style={{
                          default: { outline: 'none', cursor: 'pointer' },
                          hover: {
                            outline: 'none',
                            cursor: 'pointer',
                            filter: 'brightness(1.18) drop-shadow(0 0 5px rgba(44,143,160,0.55))',
                          },
                          pressed: { outline: 'none', filter: 'brightness(0.9)' },
                        }}
                      />
                      {count && (
                        <Marker coordinates={centroid}>
                          <circle r={9} fill="rgba(255,255,255,0.92)" stroke="#a2d7dd" strokeWidth={1.5} />
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={9}
                            fontWeight="bold"
                            fill="#0077aa"
                          >
                            {count}
                          </text>
                        </Marker>
                      )}
                    </React.Fragment>
                  );
                })
              }
            </Geographies>

            {/* ズーム時の投稿ピン */}
            {zoomedPrefId && postsInZoomed.slice(0, 6).map((post, i) => {
              const base = centroidsRef.current[zoomedPrefId] || [137, 37];
              const [dlng, dlat] = PIN_GEO_OFFSETS[i] || [0, 0];
              return (
                <Marker key={`pin-${post.id}`} coordinates={[base[0] + dlng, base[1] + dlat]}>
                  <circle r={5} fill="#ff5252" stroke="white" strokeWidth={1.5} />
                  <text y={12} textAnchor="middle" fontSize={7} fill="#333">
                    {(post.username || '匿名').slice(0, 3)}
                  </text>
                </Marker>
              );
            })}
          </ComposableMap>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default JapanMap;
