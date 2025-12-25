# FastCMS Plus - Adobe Edge Delivery Services Project

This is an **Adobe Edge Delivery Services (EDS)** project (also known as Franklin or Helix). It's a document-based CMS where content is authored in Google Docs and code is synced via GitHub.

## Quick Reference

- **Run linting:** `npm run lint`
- **Start dev server:** `aem up` (requires `@adobe/aem-cli`)
- **Content source:** Google Drive (see fstab.yaml)

## Project Structure

```
/blocks/          # Block components (JS + CSS + docs)
/scripts/         # Core scripts (aem.js, scripts.js, delayed.js)
/styles/          # Global styles and fonts
/config/          # Configuration files
/tools/           # Development tools
/docs/            # Documentation
/.claude/         # Claude Code configuration (skills, commands, hooks)
```

## Core EDS Concepts

1. **Document-based authoring:** Content created in Google Docs/Microsoft Word
2. **Block-based development:** Self-contained blocks with JS, CSS, and documentation
3. **E-L-D loading pattern:** Eager, Lazy, and Delayed loading for performance
4. **Vanilla JS only:** No frameworks - use native JavaScript and CSS3

## Block Development

### Block Structure

Each block lives in `/blocks/blockname/` with these files:

```
blockname.js      # Main JavaScript (exports async decorate function)
blockname.css     # Block-specific styles
README.md         # Documentation for the block
EXAMPLE.md        # Copy-paste example for content authors
example-*.json    # Sample JSON data (if block needs data)
example-*.csv     # CSV version of JSON data
```

### JavaScript Pattern

```javascript
export default async function decorate(block) {
  // File paths defined at top
  const inputData = '/path/to/data.json';

  // DOM manipulation
  const container = document.createElement('div');
  block.appendChild(container);

  // Event listeners
  container.addEventListener('click', () => {
    // Handle interaction
  });

  // Data fetching with async/await
  try {
    const response = await fetch(inputData);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    // Process data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
  }

  block.classList.add('blockname--initialized');
}
```

### CSS Pattern

```css
.blockname {
  /* Base styles - mobile first */
}

@media (min-width: 768px) {
  .blockname {
    /* Desktop styles */
  }
}
```

## JSON Data Structure

When blocks need JSON data, use this structure:

```json
{
  "total": 1,
  "offset": 0,
  "limit": 1,
  "data": [
    {
      "path": "/example-path",
      "title": "Example Title",
      "image": "/media_example.png",
      "description": "Description here",
      "lastModified": "1724942455"
    }
  ],
  ":type": "sheet"
}
```

## Code Style Requirements

- Follow **Airbnb JavaScript Style Guide**
- Use `async/await` instead of `.then()` for async code
- Precede console statements with `// eslint-disable-next-line no-console`
- Define file paths as constants at the top of functions
- Use semantic HTML and ARIA attributes for accessibility
- Mobile-first responsive design
- The core library is `aem.js` (renamed from `lib-franklin.js`)

## Available Blocks (30+)

accordion, bio, blogs, cards, cards-logo, carousel, clients, columns, comment, cookie-declaration, dynamic, embed, footer, form, fragment, header, hero, hero-video, info-graphic, list, maps, modal, profile-cards, profile-modal, quote, tags, teleprompter, text, video, webpagetest

## When Creating New Blocks

1. Create all required files: JS, CSS, README.md, EXAMPLE.md
2. Add example JSON/CSV if the block requires data
3. EXAMPLE.md format: `# blockname` followed by markdown table
4. README.md must include: Usage, Authoring, Styling, Behavior, Accessibility sections
5. All markdown files must end with a newline
6. Lists in markdown must be surrounded by blank lines

## Sample Images for Documentation

When examples need images, use:
- `https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png`
- `https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg`
- `https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg`

## Performance Goals

- Target 100 in Lighthouse for performance, SEO, and accessibility
- Lazy load images and non-critical content
- Minimize DOM manipulation
- Apply E-L-D loading pattern appropriately

## Custom Commands

- `/new-block` - Create a new EDS block
- `/test-block` - Run tests for a block
- `/check-block` - Architecture review for a block
- `/lint-all` - Run all linting checks
- `/start-cdd` - Start Content Driven Development process
