/* eslint-disable function-paren-newline */
/* eslint-disable import/extensions */
/* eslint-disable no-alert */

import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  a, div, li, p, h3, span, ul
} from '../../scripts/block-party/dom-helpers.js';
import ffetch from '../../scripts/block-party/ffetch.js';

export default async function decorate(block) {
  // Select the element by its class
  const element = document.querySelector('.dynamic-container');

  // Get the value of the 'data-maxreturn' attribute, or system value, or use the default value of 8
  let maxReturn = element.getAttribute('data-maxreturn') ||
    window.siteConfig?.['$meta:maxreturn$'] ||
    window.siteConfig?.['$system:maxreturn$'] ||
    '8';

  if (maxReturn === '-1') {
    maxReturn = 1000;
  }
  const content = await ffetch('/query-index.json').all();

  let targetNames = ['blog']; // Initialize targetNames with 'blog' as the default

  if (!window.location.pathname.endsWith('/')) {
    // Extract path segments excluding the domain
    const pathSegments = window.location.pathname.split('/').filter((segment) => segment.length > 0);

    // Use the pathname as target if there's more than one segment
    if (pathSegments.length > 1) {
      targetNames = [window.location.pathname];
    }
  }

  // Use additional class names as targets, excluding specific class names
  let bnames = block.className.replace(' block', '');
  if (bnames.startsWith('dynamic')) {
    bnames = bnames.replace('dynamic', '');
  }
  bnames = bnames.trim();
  if (bnames.split(' ').length > 1) {
    targetNames = bnames.split(' ');
  }

  // Filter content to exclude paths containing '/template' and the current page path
  const filteredContent = content.filter((card) => !card.path.includes('/template') && !card.path.includes('/test') &&
    card.path !== window.location.pathname && // Dynamically exclude the current page path
    targetNames.some((target) => card.path.includes(`/${target}/`)),
  );

  // Sort the filtered content by 'lastModified' in descending order
  const sortedContent = filteredContent.sort((adate, b) => {
    const dateA = new Date(adate.lastModified);
    const dateB = new Date(b.lastModified);
    return dateB - dateA;
  });

  const maxReturnNumber = parseInt(maxReturn, 10);

  // Append sorted and filtered content to the block, obeying limits
  const cardsContainer = ul(
    ...sortedContent.slice(0, maxReturnNumber).map((card) => li(
      div({ class: 'card-image' },
        a({ href: card.path }, // Link wrapping the image
          createOptimizedPicture(card.image, card.headline, false, [{ width: '750' }]),
        ),
      ),
      div({ class: 'cards-card-body' },
        span({ class: 'card-tag' }, card.service),
        span({ class: 'card-tag alt' }, card.resource),
        h3((card.headline)),
        p(card.description),
      ),
    )),
  );

  block.append(cardsContainer);

  // Filtering
  const serviceCounts = {};
  const resourceCounts = {};

  sortedContent.forEach(item => {
    item.service.split(', ').forEach(service => {
      if (!serviceCounts[service]) {
        serviceCounts[service] = 0;
      }
      serviceCounts[service]++;
    });
    item.resource.split(', ').forEach(resource => {
      if (!resourceCounts[resource]) {
        resourceCounts[resource] = 0;
      }
      resourceCounts[resource]++;
    });
  });

  // Helper function to get unique values
  const getUniqueValues = (data, key) => {
    return [...new Set(data.map(item => item[key].split(', ')).flat())];
  };

  // Get unique services and resources
  const uniqueServices = getUniqueValues(sortedContent, 'service');
  const uniqueResources = getUniqueValues(sortedContent, 'resource');

  // Create a list item with a button for each service and resource, including counts
  const serviceButtons = uniqueServices.map(service => `<li><button type="button" class="filter-btn service-btn" data-filter="${service}">${service} (${serviceCounts[service]})</button></li>`).join('');
  const resourceButtons = uniqueResources.map(resource => `<li><button type="button" class="filter-btn resource-btn" data-filter="${resource}">${resource} (${resourceCounts[resource]})</button></li>`).join('');

  // Create a block and class to append these lists
  const blocks = document.createElement('div');
  blocks.classList.add('filters');

  // Function to create a <ul>
  const list = (...content) => `<ul>${content.join('')}</ul>`;

  // Append as first child using innerHTML for demonstration (you might use DOM methods in actual deployment)
  blocks.innerHTML =
    `
  <div class="filter-service">${list(serviceButtons)}</div>
  <div class="filter-resource">${list(resourceButtons)}</div>
  `;

  // Assuming you have a root element to append this block
  block.prepend(blocks);

  // Add a paragraph element for "no results found" message
  const noResultsMessage = document.createElement('p');
  noResultsMessage.classList.add('no-results');
  noResultsMessage.innerHTML = '<strong>No results found.</strong><br>Try adjusting your filters or <a href="/contact-us">contact us</a> for more information.';
  noResultsMessage.style.display = 'none'; // Initially hidden
  block.insertBefore(noResultsMessage, cardsContainer);

  // Add event listeners for filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const activeFilters = { service: [], resource: [] };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Determine filter type
      const isService = button.classList.contains('service-btn');
      const filterType = isService ? 'service' : 'resource';

      // Toggle active class on the clicked button
      button.classList.toggle('active');

      // Update active filters
      const filterValue = button.getAttribute('data-filter');
      if (button.classList.contains('active')) {
        activeFilters[filterType].push(filterValue);
      } else {
        activeFilters[filterType] = activeFilters[filterType].filter(value => value !== filterValue);
      }

      // Apply filters
      applyFilters();
    });
  });

  function applyFilters() {
    const cards = cardsContainer.querySelectorAll('li');
    let hasVisibleCards = false;
    cards.forEach(card => {
      const tags = Array.from(card.querySelectorAll('.card-tag')).map(tag => tag.textContent);
      const matchesService = !activeFilters.service.length || activeFilters.service.some(filter => tags.includes(filter));
      const matchesResource = !activeFilters.resource.length || activeFilters.resource.some(filter => tags.includes(filter));

      if (matchesService && matchesResource) {
        card.style.display = 'flex';
        hasVisibleCards = true;
      } else {
        card.style.display = 'none';
      }
    });

    // Show "no results found" message if no cards are visible
    noResultsMessage.style.display = hasVisibleCards ? 'none' : 'block';
  }
}
