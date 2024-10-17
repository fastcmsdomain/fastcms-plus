const WEBPAGETEST_CONFIG = {
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

async function fetchLighthouseScores(url, apiKey) {
  const params = new URLSearchParams({
    url,
    key: apiKey,
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
    throw error;
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
  const apiKeyElement = block.querySelector('.score');
  const apiKey = apiKeyElement?.textContent.trim();
  
  if (!apiKey) {
    block.innerHTML = '<p>Please provide a valid Google PageSpeed Insights API key.</p>';
    return;
  }

  // Remove the API key from the visible content
  apiKeyElement.parentElement.remove();

  let url = window.location.href;
  
  // If we're on a local or development environment, use a known public URL
  if (url.includes('localhost') || url.includes('internal-domain')) {
    url = 'https://www.adobe.com'; // Or any other public URL you want to test
  }

  try {
    const scores = await fetchLighthouseScores(url, apiKey);
    block.innerHTML = WEBPAGETEST_CONFIG.CATEGORIES.map(category => 
      createScoreElement(category, scores[category].score)
    ).join('');
  } catch (error) {
    if (error.message.includes('API key expired') || error.message.includes('API_KEY_INVALID')) {
      block.innerHTML = '<p>The provided API key is invalid or has expired. Please update your API key.</p>';
    } else {
      block.innerHTML = '<p>Unable to fetch Lighthouse scores. Please check the console for more details.</p>';
    }
  }
}
