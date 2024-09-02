export default function decorate(block) {
  // Add a class to the main block for styling
  block.classList.add('accordion');

  // Get all direct child divs, which represent accordion items
  const accordionItems = block.querySelectorAll(':scope > div');

  accordionItems.forEach((item, index) => {
    // Check if the item has the expected structure
    if (item.children.length < 2) {
      console.warn(`Accordion item ${index} does not have the expected structure. Skipping.`);
      return;
    }

    const [header, content] = item.children;

    // Create accordion item structure
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';
    accordionItem.id = `accordion-item-${index}`;

    // Create header
    const accordionHeader = document.createElement('button');
    accordionHeader.className = 'accordion-header';
    accordionHeader.textContent = header.textContent;
    accordionHeader.setAttribute('aria-expanded', 'false');
    accordionHeader.setAttribute('aria-controls', `accordion-content-${index}`);

    // Create content wrapper
    const accordionContent = document.createElement('div');
    accordionContent.className = 'accordion-content';
    accordionContent.id = `accordion-content-${index}`;
    accordionContent.setAttribute('aria-labelledby', `accordion-item-${index}`);
    accordionContent.hidden = true;
    accordionContent.innerHTML = content.innerHTML;

    // Add click event to toggle accordion
    accordionHeader.addEventListener('click', () => {
      const isExpanded = accordionHeader.getAttribute('aria-expanded') === 'true';
      
      // Close all other accordions
      accordionItems.forEach((otherItem, otherIndex) => {
        if (index !== otherIndex) {
          const otherHeader = otherItem.querySelector('.accordion-header');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherHeader && otherContent) {
            otherHeader.setAttribute('aria-expanded', 'false');
            otherContent.hidden = true;
          }
        }
      });

      // Toggle current accordion
      accordionHeader.setAttribute('aria-expanded', !isExpanded);
      accordionContent.hidden = isExpanded;

      // Smooth scroll to the header if it's being opened
      if (!isExpanded) {
        accordionHeader.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Append elements to accordion item
    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionContent);

    // Replace original content with new accordion structure
    item.replaceWith(accordionItem);
  });

  // Open the first accordion by default
  const firstHeader = block.querySelector('.accordion-header');
  const firstContent = block.querySelector('.accordion-content');
  if (firstHeader && firstContent) {
    firstHeader.setAttribute('aria-expanded', 'true');
    firstContent.hidden = false;
  }
}