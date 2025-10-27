const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v'];

function getVideoSource(block) {
  const selector = VIDEO_EXTENSIONS
    .map((ext) => `a[href$=".${ext}"], a[href*=".${ext}?"]`)
    .join(', ');
  return block.querySelector(selector);
}

function extractPoster(mediaContainer) {
  const picture = mediaContainer?.querySelector('picture');
  if (!picture) return '';

  const img = picture.querySelector('img');
  const poster = img?.currentSrc || img?.src || '';
  picture.remove();
  return poster;
}

function buildVideoElement(sourceUrl, poster) {
  const video = document.createElement('video');
  video.className = 'hero-video__video';
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('preload', 'auto');

  if (poster) {
    video.setAttribute('poster', poster);
  }

  const extension = sourceUrl.split('?')[0].split('.').pop();
  const mimeType = extension ? `video/${extension.toLowerCase()}` : 'video/mp4';

  const source = document.createElement('source');
  source.setAttribute('src', sourceUrl);
  source.setAttribute('type', mimeType);
  video.append(source);

  return video;
}

function extractContent(contentColumn) {
  if (!contentColumn) {
    return {
      titleText: '',
      subtitleText: '',
      extraContent: document.createDocumentFragment(),
    };
  }

  const children = [...contentColumn.children];

  const textOnlyCandidates = children.filter((child) => {
    const text = child.textContent?.trim();
    if (!text) return false;
    if (child.classList.contains('button-container')) return false;
    return !child.querySelector('a, button, input, video, picture');
  });

  const titleNode = textOnlyCandidates.shift();
  const subtitleNode = textOnlyCandidates.shift();

  const titleText = titleNode?.textContent.trim() || '';
  const subtitleText = subtitleNode?.textContent.trim() || '';

  titleNode?.remove();
  subtitleNode?.remove();

  const fragment = document.createDocumentFragment();
  [...contentColumn.children].forEach((child) => {
    fragment.append(child);
  });

  return {
    titleText,
    subtitleText,
    extraContent: fragment,
  };
}

export default function decorate(block) {
  block.classList.add('hero-video-initialized');

  const rows = [...block.children];
  const firstRow = rows[0];
  const columns = firstRow ? [...firstRow.children] : [];

  let mediaColumn = columns[0] || block;
  let contentColumn = columns[1] || rows[1] || null;

  const videoAnchor = getVideoSource(mediaColumn) || getVideoSource(block);
  if (!videoAnchor) {
    return;
  }

  const videoUrl = videoAnchor.href;
  const poster = extractPoster(mediaColumn);
  videoAnchor.closest('p')?.remove();
  videoAnchor.remove();

  const content = extractContent(contentColumn);

  const inner = document.createElement('div');
  inner.className = 'hero-video__inner';

  const media = document.createElement('div');
  media.className = 'hero-video__media';

  const video = buildVideoElement(videoUrl, poster);
  media.append(video);

  const overlay = document.createElement('div');
  overlay.className = 'hero-video__overlay';

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-video__content';

  if (content.titleText) {
    const title = document.createElement('h1');
    title.className = 'hero-video__title';
    title.textContent = content.titleText;
    contentWrapper.append(title);
  }

  if (content.subtitleText) {
    const subtitle = document.createElement('p');
    subtitle.className = 'hero-video__subtitle';
    subtitle.textContent = content.subtitleText;
    contentWrapper.append(subtitle);
  }

  if (content.extraContent && content.extraContent.childNodes.length > 0) {
    const extra = document.createElement('div');
    extra.className = 'hero-video__extra';
    extra.append(content.extraContent);
    contentWrapper.append(extra);
  }

  inner.append(media);
  inner.append(overlay);
  inner.append(contentWrapper);

  block.innerHTML = '';
  block.append(inner);

  if (typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.removeAttribute('loop');
    video.pause();
    video.setAttribute('controls', '');
  }
}
