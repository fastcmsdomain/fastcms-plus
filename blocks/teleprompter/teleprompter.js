import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const teleprompterIcon = document.createElement('div');
  teleprompterIcon.className = 'teleprompter2-icon';
  teleprompterIcon.innerHTML = '📙';
  teleprompterIcon.setAttribute('tabindex', '0');
  teleprompterIcon.setAttribute('aria-label', 'Open Teleprompter');

  const teleprompterContainer = document.createElement('div');
  teleprompterContainer.className = 'teleprompter2-container';
  teleprompterContainer.style.display = 'none';

  const title = document.createElement('h2');
  const timer = document.createElement('div');
  timer.className = 'teleprompter2-timer';
  const content = document.createElement('div');
  content.className = 'teleprompter2-content';

  teleprompterContainer.appendChild(title);
  teleprompterContainer.appendChild(timer);
  teleprompterContainer.appendChild(content);

  block.appendChild(teleprompterIcon);
  block.appendChild(teleprompterContainer);

  let allLines = [];
  let currentLineIndex = 0;
  let isPlaying = false;
  let startTime;
  let pausedTime = 0;
  let animationFrameId;

  function extractContent() {
    const h1 = document.querySelector('h1');
    title.textContent = h1 ? h1.textContent : 'Teleprompter';

    const textNodes = [];
    function extractTextNodes(node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        textNodes.push(node.textContent.trim());
      } else if (node.nodeType === Node.ELEMENT_NODE && node !== block) {
        node.childNodes.forEach(extractTextNodes);
      }
    }
    document.body.childNodes.forEach(extractTextNodes);
    allLines = textNodes;
  }

  function updateDisplay() {
    if (allLines.length === 0) {
      content.textContent = 'No content available for teleprompter.';
      return;
    }

    const currentLine = allLines[currentLineIndex];
    const nextLines = allLines.slice(currentLineIndex + 1, currentLineIndex + 4);

    content.innerHTML = `
      <p class="current-line">${currentLine}</p>
      ${nextLines.map(line => `<p>${line}</p>`).join('')}
    `;
  }

  function updateTimer() {
    if (!isPlaying) return;

    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime + pausedTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    timer.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

    animationFrameId = requestAnimationFrame(updateTimer);
  }

  function startTeleprompter() {
    isPlaying = true;
    startTime = new Date().getTime();
    updateTimer();
  }

  function pauseTeleprompter() {
    isPlaying = false;
    pausedTime += new Date().getTime() - startTime;
    cancelAnimationFrame(animationFrameId);
    content.innerHTML = '<p class="paused-message">PAUSED</p>' + content.innerHTML;
  }

  function resumeTeleprompter() {
    isPlaying = true;
    startTime = new Date().getTime();
    content.querySelector('.paused-message')?.remove();
    updateTimer();
  }

  function stopTeleprompter() {
    isPlaying = false;
    pausedTime = 0;
    currentLineIndex = 0;
    cancelAnimationFrame(animationFrameId);
    teleprompterContainer.style.display = 'none';
    teleprompterIcon.style.display = 'block';
  }

  function scrollTeleprompter(direction) {
    if (direction === 'up' && currentLineIndex > 0) {
      currentLineIndex--;
    } else if (direction === 'down' && currentLineIndex < allLines.length - 1) {
      currentLineIndex++;
    }
    updateDisplay();
  }

  teleprompterIcon.addEventListener('click', () => {
    extractContent();
    updateDisplay();
    teleprompterIcon.style.display = 'none';
    teleprompterContainer.style.display = 'block';
    startTeleprompter();
  });

  let isDragging = false;
  let dragStartX, dragStartY;

  teleprompterContainer.addEventListener('mousedown', (e) => {
    if (e.target === teleprompterContainer || e.target === title || e.target === timer) {
      isDragging = true;
      dragStartX = e.clientX - teleprompterContainer.offsetLeft;
      dragStartY = e.clientY - teleprompterContainer.offsetTop;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const left = e.clientX - dragStartX;
      const top = e.clientY - dragStartY;
      teleprompterContainer.style.left = `${left}px`;
      teleprompterContainer.style.top = `${top}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  document.addEventListener('keydown', (e) => {
    if (teleprompterContainer.style.display === 'block') {
      switch (e.key) {
        case 'Escape':
          stopTeleprompter();
          break;
        case ' ':
          isPlaying ? pauseTeleprompter() : resumeTeleprompter();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          scrollTeleprompter('up');
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          scrollTeleprompter('down');
          break;
      }
    }
  });

  teleprompterContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    scrollTeleprompter(e.deltaY > 0 ? 'down' : 'up');
  });
}