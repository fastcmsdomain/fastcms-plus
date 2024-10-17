const WEBPAGETEST_CONFIG = {
  API_KEY: 'AIzaSyDB9DYkn6l40rKU9bHDpmqT7vzbicA6sjk', // Verify this key
  API_URL: 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
  ERROR_MESSAGE: 'Error fetching Lighthouse scores:',
  CATEGORIES: ['performance', 'accessibility', 'best-practices', 'seo'],
  SCORE_CLASSES: {
    good: 'green',
    average: 'orange',
    poor: 'red',
  },
};
function getScoreClass(score) {
  if (score >= 90) return WEBPAGETEST_CONFIG.SCORE_CLASSES.good;
  if (score >= 50) return WEBPAGETEST_CONFIG.SCORE_CLASSES.average;
  return WEBPAGETEST_CONFIG.SCORE_CLASSES.poor;
}

async function fetchLighthouseScores(url) {
  const params = new URLSearchParams({
    url,
    key: WEBPAGETEST_CONFIG.API_KEY,
    category: WEBPAGETEST_CONFIG.CATEGORIES.join(','),
  });

  try {
    const response = await fetch(`${WEBPAGETEST_CONFIG.API_URL}?${params}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    return data.lighthouseResult.categories;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(WEBPAGETEST_CONFIG.ERROR_MESSAGE, error);
    // eslint-disable-next-line no-console
    console.error('Request URL:', `${WEBPAGETEST_CONFIG.API_URL}?${params}`);
    return null;
  }
}

function createScoreElement(category, score) {
  const scoreValue = Math.round(score * 100);
  const scoreClass = getScoreClass(scoreValue);

  return `
    <div class="column">
      <div class="score">
        <h3 class="score-value ${scoreClass}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${scoreValue}" style="${scoreValue}">
          ${scoreValue}
        </h3>
        <h4>${category}</h4>
      </div>
    </div>
  `;
}

export default async function decorate(block) {
  let url = window.location.href;
  
  // If we're on a local or development environment, use a known public URL
  if (url.includes('localhost') || url.includes('internal-domain')) {
    url = 'https://www.adobe.com'; // Or any other public URL you want to test
  }

  const scores = await fetchLighthouseScores(url);

  if (scores) {
    block.innerHTML = WEBPAGETEST_CONFIG.CATEGORIES.map(category => 
      createScoreElement(category, scores[category].score)
    ).join('');
  } else {
    block.innerHTML = '<p>Unable to fetch Lighthouse scores. Please check the console for more details.</p>';
  }
}
