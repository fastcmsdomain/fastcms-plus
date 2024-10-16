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

async function fetchLighthouseScores(url, apiKey, strategy) {
  const params = new URLSearchParams({
    url,
    key: apiKey,
    strategy,
  });

  WEBPAGETEST_CONFIG.CATEGORIES.forEach(category => {
    params.append('category', category);
  });

  try {
    console.log(`Fetching scores for ${strategy} strategy...`);
    const response = await fetch(`${WEBPAGETEST_CONFIG.API_URL}?${params}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    console.log(`Received data for ${strategy}:`, data);
    return data.lighthouseResult.categories;
  } catch (error) {
    console.error(WEBPAGETEST_CONFIG.ERROR_MESSAGE, error);
    throw error;
  }
}

function createScoreElement(category, score) {
  const scoreValue = Math.round(score * 100);
  const scoreClass = getScoreClass(scoreValue);

  return `
    <td>
      <div class="score">
        <h3 class="score-value ${scoreClass}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${scoreValue}" style="--value:${scoreValue}">
          ${scoreValue}
        </h3>
        <h4>${category}</h4>
      </div>
    </td>
  `;
}

function createScoreTable(scores, strategy) {
  console.log(`Creating table for ${strategy} with scores:`, scores);
  return `
    <table class="strategy-scores ${strategy}">
      <caption>${strategy.charAt(0).toUpperCase() + strategy.slice(1)} Scores</caption>
      <tr>
        ${WEBPAGETEST_CONFIG.CATEGORIES.map(category => 
          createScoreElement(category, scores[category].score)
        ).join('')}
      </tr>
    </table>
  `;
}

export default async function decorate(block) {
  console.log('Decorating WebPageTest block...');
  const rows = block.querySelectorAll(':scope > div');
  const apiKey = rows[0]?.querySelector('div')?.textContent.trim();
  const optionsText = rows[1]?.querySelector('div')?.textContent.trim().toLowerCase() || 'desktop,mobile';
  const options = optionsText.split(',').map(option => option.trim());

  console.log('API Key:', apiKey);
  console.log('Options:', options);

  if (!apiKey) {
    block.innerHTML = '<p>Please provide a valid Google PageSpeed Insights API key in the block content.</p>';
    return;
  }

  // Remove all existing content from the block
  block.innerHTML = '';

  let url = window.location.href;
  
  if (url.includes('localhost') || url.includes('internal-domain')) {
    url = 'https://www.adobe.com';
  }

  console.log('URL to test:', url);

  try {
    for (const strategy of options) {
      if (strategy === 'desktop' || strategy === 'mobile') {
        console.log(`Fetching scores for ${strategy}...`);
        const scores = await fetchLighthouseScores(url, apiKey, strategy);
        console.log(`Scores received for ${strategy}:`, scores);
        const tableHTML = createScoreTable(scores, strategy);
        console.log(`Table HTML for ${strategy}:`, tableHTML);
        block.innerHTML += tableHTML;
      }
    }
  } catch (error) {
    console.error('Error in decorate function:', error);
    if (error.message.includes('API key expired') || error.message.includes('API_KEY_INVALID')) {
      block.innerHTML = '<p>The provided API key is invalid or has expired. Please update your API key.</p>';
    } else {
      block.innerHTML = '<p>Unable to fetch Lighthouse scores. Please check the console for more details.</p>';
    }
  }
}
