import React from 'react';

// すべての都道府県のパスデータをオブジェクトとして定義
const JAPAN_MAP_PATHS = {
  'JP-01': 'M513,11L481,25L456,23L441,31L439,49L425,52L446,73L432,102L456,123L479,121L514,142L540,119L569,112L569,88L538,59L529,32z',
  'JP-02': 'M473,158L456,177L452,203L481,207L481,180z',
  'JP-03': 'M485,178L485,208L501,234L486,252L488,271L474,271L473,212z',
  'JP-04': 'M489,274L476,275L478,317L492,317z',
  'JP-05': 'M451,214L435,232L436,264L452,284L468,269L467,233z',
  'JP-06': 'M453,288L437,300L448,333L468,321L469,286z',
  'JP-07': 'M470,324L450,336L452,360L493,353L491,320z',
  'JP-08': 'M495,356L514,359L511,382L495,383z',
  'JP-09': 'M470,356L492,355L493,383L469,383z',
  'JP-10': 'M449,338L432,349L426,373L451,358z',
  'JP-11': 'M468,362L454,374L467,392L484,385z',
  'JP-12': 'M496,386L496,404L513,410L510,385z',
  'JP-13': 'M486,388L469,395L473,411L494,403z',
  'JP-14': 'M474,414L453,423L468,443L488,432z',
  'JP-15': 'M424,310L400,320L405,355L425,375L446,334z',
  'JP-16': 'M398,357L378,367L385,392L402,388z',
  'JP-17': 'M376,368L351,378L361,408L382,391z',
  'JP-18': 'M359,410L338,421L355,448L378,433z',
  'JP-19': 'M450,393L434,405L435,429L450,422z',
  'JP-20': 'M424,378L401,390L412,423L432,431L448,390z',
  'JP-21': 'M399,392L380,418L410,422L409,393z',
  'JP-22': 'M451,425L425,438L429,463L452,475L466,442z',
  'JP-23': 'M423,439L396,456L408,482L427,477z',
  'JP-24': 'M381,468L359,481L380,504L406,484z',
  'JP-25': 'M379,420L357,450L380,465L394,453z',
  'JP-26': 'M355,452L331,465L356,478L377,463z',
  'JP-27': 'M329,493L309,513L331,512L352,492z',
  'JP-28': 'M329,466L301,481L308,511L330,511L354,490z',
  'JP-29': 'M354,480L332,492L357,502L378,485z',
  'JP-30': 'M330,514L307,522L332,544L355,505z',
  'JP-31': 'M299,455L270,466L275,492L300,479z',
  'JP-32': 'M268,468L240,480L247,510L273,494z',
  'JP-33': 'M299,483L273,495L280,520L305,509z',
  'JP-34': 'M271,497L243,512L254,538L278,519z',
  'JP-35': 'M238,514L210,525L226,558L252,537z',
  'JP-36': 'M307,533L287,542L296,561L316,550z',
  'JP-37': 'M303,512L282,522L288,540L308,531z',
  'JP-38': 'M280,542L258,552L268,574L294,560z',
  'JP-39': 'M285,563L262,575L276,596L297,581z',
  'JP-40': 'M224,560L196,570L208,600L234,588L248,560z',
  'JP-41': 'M194,572L178,588L193,612L206,599z',
  'JP-42': 'M176,590L150,602L168,634L191,611z',
  'JP-43': 'M208,604L184,620L200,645L220,627z',
  'JP-44': 'M236,590L210,602L222,628L245,614z',
  'JP-45': 'M224,630L202,647L218,672L240,655z',
  'JP-46': 'M216,674L192,690L213,715L238,695L238,670z',
  'JP-47': 'M150,750L130,760L140,780L160,770z'
};

const PREFECTURE_NAME_TO_ID = {
  '北海道': 'JP-01','青森県': 'JP-02', 
  '岩手県': 'JP-03', '宮城県': 'JP-04', 
  '秋田県': 'JP-05','山形県': 'JP-06', 
  '福島県': 'JP-07', '茨城県': 'JP-08', 
  '栃木県': 'JP-09', '群馬県': 'JP-10', 
  '埼玉県': 'JP-11','千葉県': 'JP-12',
  '東京都': 'JP-13', '神奈川県': 'JP-14', 
  '新潟県': 'JP-15', '富山県': 'JP-16', 
  '石川県': 'JP-17', '福井県': 'JP-18', 
  '山梨県': 'JP-19', '長野県': 'JP-20',
  '岐阜県': 'JP-21', '静岡県': 'JP-22',
  '愛知県': 'JP-23', '三重県': 'JP-24', 
  '滋賀県': 'JP-25', '京都府': 'JP-26', 
  '大阪府': 'JP-27', '兵庫県': 'JP-28', 
  '奈良県': 'JP-29', '和歌山県': 'JP-30', 
  '鳥取県': 'JP-31', '島根県': 'JP-32', 
  '岡山県': 'JP-33', '広島県': 'JP-34', 
  '山口県': 'JP-35', '徳島県': 'JP-36', 
  '香川県': 'JP-37', '愛媛県': 'JP-38', 
  '高知県': 'JP-39', '福岡県': 'JP-40', 
  '佐賀県': 'JP-41', '長崎県': 'JP-42', 
  '熊本県': 'JP-43', '大分県': 'JP-44', 
  '宮崎県': 'JP-45', '鹿児島県': 'JP-46', '沖縄県': 'JP-47'
};

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
  const postsByPrefectureId = React.useMemo(() => {
    const map = new Map();
    posts.forEach(post => {
      const prefectureName = getPrefectureFromAddress(post.address);
      if (prefectureName) {
        map.set(PREFECTURE_NAME_TO_ID[prefectureName], post);
      }
    });
    return map;
  }, [posts]);

  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <svg width="500" height="500" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {posts.map(post => (
            <pattern
              key={post.id}
              id={`pattern-${post.id}`}
              x="0" y="0"
              width="1" height="1"
              viewBox="0 0 1 1"
              preserveAspectRatio="xMidYMid slice"
            >
              <image href={`http://localhost:3001/uploads/${post.image}`} x="0" y="0" width="1" height="1" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          ))}
        </defs>
        <g id="japan">
          {Object.keys(PREFECTURE_NAME_TO_ID).map(prefName => {
            const prefectureId = PREFECTURE_NAME_TO_ID[prefName];
            const post = postsByPrefectureId.get(prefectureId);
            return (
              <path
                key={prefectureId}
                id={prefectureId}
                className="prefecture"
                d={JAPAN_MAP_PATHS[prefectureId]} // パスデータをオブジェクトから取得
                fill={post ? `url(#pattern-${post.id})` : '#a2d7dd'}
                style={{ stroke: 'white', strokeWidth: 2 }}
                onClick={() => {
                  if (post) onPinClick(post);
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default JapanMap;
