// MapView.jsx
import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoContains, geoCentroid } from "d3-geo";

const geoUrl = "/japan-prefectures.json"; // public フォルダに置いた GeoJSON

function MapView() {
  const [posts, setPosts] = useState([]);

  // バックエンドから投稿データを取得
  useEffect(() => {
    fetch("http://localhost:3001/posts")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  // 投稿がこの都道府県にあるか判定
  const findPostForPrefecture = (geo) =>
    posts.find(post => post.latitude && post.longitude && geoContains(geo, [post.longitude, post.latitude]));

  return (
    <ComposableMap projection="geoMercator" width={800} height={1000}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const post = findPostForPrefecture(geo);
            const clipId = `clip-${geo.rsmKey}`;

            // 都道府県の中心座標を取得
            const [cx, cy] = geoCentroid(geo);

            return (
              <g key={geo.rsmKey}>
                {/* 投稿写真がある場合、clipPathを作る */}
                {post && (
                  <clipPath id={clipId}>
                    <path d={geo.path} />
                  </clipPath>
                )}

                {/* 投稿写真を都道府県形にマスク */}
                {post && (
                  <image
                    href={post.photo}          // 投稿写真
                    width={100}                 // 写真サイズ
                    height={100}
                    clipPath={`url(#${clipId})`}
                    x={cx - 50}                // 中心に合わせて調整
                    y={cy - 50}
                    preserveAspectRatio="xMidYMid slice"
                  />
                )}

                {/* 都道府県の枠線 */}
                <Geography geography={geo} stroke="#999" />
              </g>
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}

export default MapView;
