import React from 'react';

const PREFECTURE_NAME_TO_ID = {
  '北海道': 'JP-01', '青森県': 'JP-02', '岩手県': 'JP-03', '宮城県': 'JP-04', '秋田県': 'JP-05', '山形県': 'JP-06', '福島県': 'JP-07', '茨城県': 'JP-08', '栃木県': 'JP-09', '群馬県': 'JP-10', '埼玉県': 'JP-11', '千葉県': 'JP-12', '東京都': 'JP-13', '神奈川県': 'JP-14', '新潟県': 'JP-15', '富山県': 'JP-16', '石川県': 'JP-17', '福井県': 'JP-18', '山梨県': 'JP-19', '長野県': 'JP-20', '岐阜県': 'JP-21', '静岡県': 'JP-22', '愛知県': 'JP-23', '三重県': 'JP-24', '滋賀県': 'JP-25', '京都府': 'JP-26', '大阪府': 'JP-27', '兵庫県': 'JP-28', '奈良県': 'JP-29', '和歌山県': 'JP-30', '鳥取県': 'JP-31', '島根県': 'JP-32', '岡山県': 'JP-33', '広島県': 'JP-34', '山口県': 'JP-35', '徳島県': 'JP-36', '香川県': 'JP-37', '愛媛県': 'JP-38', '高知県': 'JP-39', '福岡県': 'JP-40', '佐賀県': 'JP-41', '長崎県': 'JP-42', '熊本県': 'JP-43', '大分県': 'JP-44', '宮崎県': 'JP-45', '鹿児島県': 'JP-46', '沖縄県': 'JP-47'
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
          <path id="JP-01" class="prefecture" d="M513,11L481,25L456,23L441,31L439,49L425,52L446,73L432,102L456,123L479,121L514,142L540,119L569,112L569,88L538,59L529,32z" fill={postsByPrefectureId.get('JP-01') ? `url(#pattern-${postsByPrefectureId.get('JP-01').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-01'); if (post) onPinClick(post); }}/>
          <path id="JP-02" class="prefecture" d="M473,158L456,177L452,203L481,207L481,180z" fill={postsByPrefectureId.get('JP-02') ? `url(#pattern-${postsByPrefectureId.get('JP-02').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-02'); if (post) onPinClick(post); }}/>
          <path id="JP-05" class="prefecture" d="M451,214L435,232L436,264L452,284L468,269L467,233z" fill={postsByPrefectureId.get('JP-05') ? `url(#pattern-${postsByPrefectureId.get('JP-05').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-05'); if (post) onPinClick(post); }}/>
          <path id="JP-03" class="prefecture" d="M485,178L485,208L501,234L486,252L488,271L474,271L473,212z" fill={postsByPrefectureId.get('JP-03') ? `url(#pattern-${postsByPrefectureId.get('JP-03').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-03'); if (post) onPinClick(post); }}/>
          <path id="JP-06" class="prefecture" d="M453,288L437,300L448,333L468,321L469,286z" fill={postsByPrefectureId.get('JP-06') ? `url(#pattern-${postsByPrefectureId.get('JP-06').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-06'); if (post) onPinClick(post); }}/>
          <path id="JP-07" class="prefecture" d="M470,324L450,336L452,360L493,353L491,320z" fill={postsByPrefectureId.get('JP-07') ? `url(#pattern-${postsByPrefectureId.get('JP-07').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-07'); if (post) onPinClick(post); }}/>
          <path id="JP-04" class="prefecture" d="M489,274L476,275L478,317L492,317z" fill={postsByPrefectureId.get('JP-04') ? `url(#pattern-${postsByPrefectureId.get('JP-04').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-04'); if (post) onPinClick(post); }}/>
          <path id="JP-11" class="prefecture" d="M468,362L454,374L467,392L484,385z" fill={postsByPrefectureId.get('JP-11') ? `url(#pattern-${postsByPrefectureId.get('JP-11').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-11'); if (post) onPinClick(post); }}/>
          <path id="JP-10" class="prefecture" d="M449,338L432,349L426,373L451,358z" fill={postsByPrefectureId.get('JP-10') ? `url(#pattern-${postsByPrefectureId.get('JP-10').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-10'); if (post) onPinClick(post); }}/>
          <path id="JP-13" class="prefecture" d="M486,388L469,395L473,411L494,403z" fill={postsByPrefectureId.get('JP-13') ? `url(#pattern-${postsByPrefectureId.get('JP-13').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-13'); if (post) onPinClick(post); }}/>
          <path id="JP-12" class="prefecture" d="M496,386L496,404L513,410L510,385z" fill={postsByPrefectureId.get('JP-12') ? `url(#pattern-${postsByPrefectureId.get('JP-12').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-12'); if (post) onPinClick(post); }}/>
          <path id="JP-15" class="prefecture" d="M424,310L400,320L405,355L425,375L446,334z" fill={postsByPrefectureId.get('JP-15') ? `url(#pattern-${postsByPrefectureId.get('JP-15').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-15'); if (post) onPinClick(post); }}/>
          <path id="JP-14" class="prefecture" d="M474,414L453,423L468,443L488,432z" fill={postsByPrefectureId.get('JP-14') ? `url(#pattern-${postsByPrefectureId.get('JP-14').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-14'); if (post) onPinClick(post); }}/>
          <path id="JP-08" class="prefecture" d="M495,356L514,359L511,382L495,383z" fill={postsByPrefectureId.get('JP-08') ? `url(#pattern-${postsByPrefectureId.get('JP-08').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-08'); if (post) onPinClick(post); }}/>
          <path id="JP-09" class="prefecture" d="M470,356L492,355L493,383L469,383z" fill={postsByPrefectureId.get('JP-09') ? `url(#pattern-${postsByPrefectureId.get('JP-09').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-09'); if (post) onPinClick(post); }}/>
          <path id="JP-22" class="prefecture" d="M451,425L425,438L429,463L452,475L466,442z" fill={postsByPrefectureId.get('JP-22') ? `url(#pattern-${postsByPrefectureId.get('JP-22').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-22'); if (post) onPinClick(post); }}/>
          <path id="JP-20" class="prefecture" d="M424,378L401,390L412,423L432,431L448,390z" fill={postsByPrefectureId.get('JP-20') ? `url(#pattern-${postsByPrefectureId.get('JP-20').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-20'); if (post) onPinClick(post); }}/>
          <path id="JP-19" class="prefecture" d="M450,393L434,405L435,429L450,422z" fill={postsByPrefectureId.get('JP-19') ? `url(#pattern-${postsByPrefectureId.get('JP-19').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-19'); if (post) onPinClick(post); }}/>
          <path id="JP-21" class="prefecture" d="M399,392L380,418L410,422L409,393z" fill={postsByPrefectureId.get('JP-21') ? `url(#pattern-${postsByPrefectureId.get('JP-21').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-21'); if (post) onPinClick(post); }}/>
          <path id="JP-23" class="prefecture" d="M423,439L396,456L408,482L427,477z" fill={postsByPrefectureId.get('JP-23') ? `url(#pattern-${postsByPrefectureId.get('JP-23').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-23'); if (post) onPinClick(post); }}/>
          <path id="JP-16" class="prefecture" d="M398,357L378,367L385,392L402,388z" fill={postsByPrefectureId.get('JP-16') ? `url(#pattern-${postsByPrefectureId.get('JP-16').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-16'); if (post) onPinClick(post); }}/>
          <path id="JP-17" class="prefecture" d="M376,368L351,378L361,408L382,391z" fill={postsByPrefectureId.get('JP-17') ? `url(#pattern-${postsByPrefectureId.get('JP-17').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-17'); if (post) onPinClick(post); }}/>
          <path id="JP-18" class="prefecture" d="M359,410L338,421L355,448L378,433z" fill={postsByPrefectureId.get('JP-18') ? `url(#pattern-${postsByPrefectureId.get('JP-18').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-18'); if (post) onPinClick(post); }}/>
          <path id="JP-25" class="prefecture" d="M379,420L357,450L380,465L394,453z" fill={postsByPrefectureId.get('JP-25') ? `url(#pattern-${postsByPrefectureId.get('JP-25').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-25'); if (post) onPinClick(post); }}/>
          <path id="JP-24" class="prefecture" d="M381,468L359,481L380,504L406,484z" fill={postsByPrefectureId.get('JP-24') ? `url(#pattern-${postsByPrefectureId.get('JP-24').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-24'); if (post) onPinClick(post); }}/>
          <path id="JP-26" class="prefecture" d="M355,452L331,465L356,478L377,463z" fill={postsByPrefectureId.get('JP-26') ? `url(#pattern-${postsByPrefectureId.get('JP-26').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-26'); if (post) onPinClick(post); }}/>
          <path id="JP-29" class="prefecture" d="M354,480L332,492L357,502L378,485z" fill={postsByPrefectureId.get('JP-29') ? `url(#pattern-${postsByPrefectureId.get('JP-29').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-29'); if (post) onPinClick(post); }}/>
          <path id="JP-28" class="prefecture" d="M329,466L301,481L308,511L330,511L354,490z" fill={postsByPrefectureId.get('JP-28') ? `url(#pattern-${postsByPrefectureId.get('JP-28').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-28'); if (post) onPinClick(post); }}/>
          <path id="JP-27" class="prefecture" d="M329,493L309,513L331,512L352,492z" fill={postsByPrefectureId.get('JP-27') ? `url(#pattern-${postsByPrefectureId.get('JP-27').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-27'); if (post) onPinClick(post); }}/>
          <path id="JP-30" class="prefecture" d="M330,514L307,522L332,544L355,505z" fill={postsByPrefectureId.get('JP-30') ? `url(#pattern-${postsByPrefectureId.get('JP-30').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-30'); if (post) onPinClick(post); }}/>
          <path id="JP-33" class="prefecture" d="M299,483L273,495L280,520L305,509z" fill={postsByPrefectureId.get('JP-33') ? `url(#pattern-${postsByPrefectureId.get('JP-33').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-33'); if (post) onPinClick(post); }}/>
          <path id="JP-31" class="prefecture" d="M299,455L270,466L275,492L300,479z" fill={postsByPrefectureId.get('JP-31') ? `url(#pattern-${postsByPrefectureId.get('JP-31').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-31'); if (post) onPinClick(post); }}/>
          <path id="JP-32" class="prefecture" d="M268,468L240,480L247,510L273,494z" fill={postsByPrefectureId.get('JP-32') ? `url(#pattern-${postsByPrefectureId.get('JP-32').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-32'); if (post) onPinClick(post); }}/>
          <path id="JP-34" class="prefecture" d="M271,497L243,512L254,538L278,519z" fill={postsByPrefectureId.get('JP-34') ? `url(#pattern-${postsByPrefectureId.get('JP-34').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-34'); if (post) onPinClick(post); }}/>
          <path id="JP-35" class="prefecture" d="M238,514L210,525L226,558L252,537z" fill={postsByPrefectureId.get('JP-35') ? `url(#pattern-${postsByPrefectureId.get('JP-35').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-35'); if (post) onPinClick(post); }}/>
          <path id="JP-37" class="prefecture" d="M303,512L282,522L288,540L308,531z" fill={postsByPrefectureId.get('JP-37') ? `url(#pattern-${postsByPrefectureId.get('JP-37').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-37'); if (post) onPinClick(post); }}/>
          <path id="JP-36" class="prefecture" d="M307,533L287,542L296,561L316,550z" fill={postsByPrefectureId.get('JP-36') ? `url(#pattern-${postsByPrefectureId.get('JP-36').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-36'); if (post) onPinClick(post); }}/>
          <path id="JP-38" class="prefecture" d="M280,542L258,552L268,574L294,560z" fill={postsByPrefectureId.get('JP-38') ? `url(#pattern-${postsByPrefectureId.get('JP-38').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-38'); if (post) onPinClick(post); }}/>
          <path id="JP-39" class="prefecture" d="M285,563L262,575L276,596L297,581z" fill={postsByPrefectureId.get('JP-39') ? `url(#pattern-${postsByPrefectureId.get('JP-39').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-39'); if (post) onPinClick(post); }}/>
          <path id="JP-40" class="prefecture" d="M224,560L196,570L208,600L234,588L248,560z" fill={postsByPrefectureId.get('JP-40') ? `url(#pattern-${postsByPrefectureId.get('JP-40').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-40'); if (post) onPinClick(post); }}/>
          <path id="JP-41" class="prefecture" d="M194,572L178,588L193,612L206,599z" fill={postsByPrefectureId.get('JP-41') ? `url(#pattern-${postsByPrefectureId.get('JP-41').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-41'); if (post) onPinClick(post); }}/>
          <path id="JP-44" class="prefecture" d="M236,590L210,602L222,628L245,614z" fill={postsByPrefectureId.get('JP-44') ? `url(#pattern-${postsByPrefectureId.get('JP-44').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-44'); if (post) onPinClick(post); }}/>
          <path id="JP-42" class="prefecture" d="M176,590L150,602L168,634L191,611z" fill={postsByPrefectureId.get('JP-42') ? `url(#pattern-${postsByPrefectureId.get('JP-42').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-42'); if (post) onPinClick(post); }}/>
          <path id="JP-43" class="prefecture" d="M208,604L184,620L200,645L220,627z" fill={postsByPrefectureId.get('JP-43') ? `url(#pattern-${postsByPrefectureId.get('JP-43').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-43'); if (post) onPinClick(post); }}/>
          <path id="JP-45" class="prefecture" d="M224,630L202,647L218,672L240,655z" fill={postsByPrefectureId.get('JP-45') ? `url(#pattern-${postsByPrefectureId.get('JP-45').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-45'); if (post) onPinClick(post); }}/>
          <path id="JP-46" class="prefecture" d="M216,674L192,690L213,715L238,695L238,670z" fill={postsByPrefectureId.get('JP-46') ? `url(#pattern-${postsByPrefectureId.get('JP-46').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-46'); if (post) onPinClick(post); }}/>
          <path id="JP-47" class="prefecture" d="M150,750L130,760L140,780L160,770z" fill={postsByPrefectureId.get('JP-47') ? `url(#pattern-${postsByPrefectureId.get('JP-47').id})` : '#a2d7dd'} style={{ stroke: 'white' }} onClick={() => { const post = postsByPrefectureId.get('JP-47'); if (post) onPinClick(post); }}/>
        </g>
      </svg>
    </div>
  );
}

export default JapanMap;