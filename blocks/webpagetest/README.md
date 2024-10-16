# Web Page Test Block

This block fetches and displays Google Lighthouse scores for the current page using the PageSpeed Insights API.

## Usage

To use this block, simply add it to your Franklin page:

| Web Page Test |
|---------------|

## Authoring

No additional authoring is required. The block will automatically fetch and display the Lighthouse scores for the current page.

## Styling

The block uses CSS variables for colors and animations. You can customize the appearance by modifying the CSS file.

## Behavior

The block makes an API call to Google PageSpeed Insights to fetch Lighthouse scores for performance, accessibility, best practices, and SEO. It then displays these scores as circular progress indicators.

## Dependencies

This block requires an API key for Google PageSpeed Insights. Make sure to replace `YOUR_API_KEY_HERE` in the JavaScript file with your actual API key.

## Accessibility

The block uses ARIA attributes to ensure screen readers can interpret the score values correctly.
