# FastCMS Plus - Claude Code Guide

## Project Overview

FastCMS Plus is an **Adobe Edge Delivery Services (EDS)** project built on the AEM boilerplate, extended with the PlusPlus framework. It uses document-based authoring (Google Docs) with block-based component architecture.

## Quick Reference

### Development Commands

```bash
# Install dependencies
npm i

# Start development server (opens localhost:3000)
aem up

# Lint all code
npm run lint

# Lint JavaScript only
npm run lint:js

# Lint CSS only
npm run lint:css

# Auto-fix ESLint issues
npx eslint . --fix
```

### Project-Specific Slash Commands

- `/new-block` - Create new EDS block with CDD workflow
- `/test-block` - Run tests for a specific block
- `/lint-all` - Run all linting checks
- `/check-block` - Architecture review and suggestions
- `/check-security` - Security checklist validation
- `/deploy-block` - Deploy from build/ to blocks/

## Architecture

### Directory Structure

```
blocks/          # 32 reusable component blocks
scripts/         # Core JS (aem.js, scripts.js)
styles/          # Global styles (styles.css, fonts.css, lazy-styles.css)
config/          # Environment-specific configuration and tracking
plusplus/        # PlusPlus framework extensions
tools/           # Development tools (sidekick)
.claude/         # Claude Code configuration (commands, skills, hooks)
```

### Block Structure

Each block follows this pattern:
```
blocks/blockname/
├── blockname.js     # Decoration function (exports default async decorate)
├── blockname.css    # Scoped block styles
└── README.md        # Block documentation
```

## Code Conventions

### JavaScript

- **Style Guide**: Airbnb JavaScript (enforced via ESLint)
- **Imports**: Always include `.js` extensions
- **Async**: Use `async/await` instead of `.then()`
- **Console logs**: Prefix with `// eslint-disable-next-line no-console`

### Block Decoration Pattern

```javascript
export default async function decorate(block) {
  // 1. Query and manipulate DOM
  const items = block.querySelectorAll('.item');

  // 2. Fetch data if needed
  const data = await fetch('/path/to/data.json').then(r => r.json());

  // 3. Add event listeners
  block.addEventListener('click', handleClick);

  // 4. Mark as initialized
  block.classList.add('blockname--initialized');
}
```

### CSS

- Use CSS variables: `--spacing-xl`, `--color-white`, `--heading-font-size-xl`
- Mobile-first responsive design
- BEM-inspired naming: `blockname`, `blockname-item`, `blockname--modifier`
- Block-scoped styles (no global pollution)

### Loading Strategy (E-L-D)

- **Eager**: Hero blocks, above-fold content
- **Lazy**: Images, non-critical content
- **Delayed**: Analytics, third-party scripts

## Important Files

| File | Purpose |
|------|---------|
| `scripts/aem.js` | Core EDS decoration and utilities |
| `scripts/scripts.js` | Site-specific initialization |
| `fstab.yaml` | Google Drive content source mapping |
| `.cursorrules` | Comprehensive development guidelines (6000+ lines) |
| `config/defaults.json` | Fallback configuration |

## Code Quality

### Linting

- **ESLint**: Airbnb config with Babel parser
- **StyleLint**: Standard CSS rules
- CI enforces linting on every push via GitHub Actions

### Testing

- No automated test framework; tests are content-driven
- Test via local `aem up` development server
- Use `test.html` files in block directories for manual testing
- Target Lighthouse scores: 100 in Performance, SEO, Accessibility

## PlusPlus Framework

Located in `/plusplus/`, provides:
- Environment-specific configuration (prod, stage, preview, local)
- Adobe DataLayer integration
- JSON-LD metadata handling
- External tracking setup (Adobe Launch, ABTasty, etc.)
- Block Party utilities (modal, DOM helpers)

## Key Patterns

### Fetching Data

```javascript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Error:', error);
}
```

### Naming Classes

```javascript
import { toClassName } from '../../scripts/aem.js';
const className = toClassName(text); // Converts "My Text" to "my-text"
```

### Getting Metadata

```javascript
import { getMetadata } from '../../scripts/aem.js';
const template = getMetadata('template');
```

## Content Driven Development (CDD)

1. Design content model first (how authors will structure content in Google Docs)
2. Create test content in Google Doc
3. Build block to consume that structure
4. Test locally via `aem up`
5. Push to GitHub (triggers CI linting)
6. Deploy via AEM Code Sync

## Notes

- Content authored in Google Docs/Word, synced via GitHub
- Serverless architecture - no backend needed
- Accessibility (WCAG) and SEO are priorities
- All blocks must be self-contained and reusable
