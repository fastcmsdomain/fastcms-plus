# Web Page Test Block

This block fetches and displays Google Lighthouse scores for the current page using the PageSpeed Insights API.

## Usage

To use this block, add it to your Franklin page and provide your Google PageSpeed Insights API key and test options:

| Web Page Test |
|---------------|
| YOUR_API_KEY_HERE |
| desktop,mobile |

Replace `YOUR_API_KEY_HERE` with your actual Google PageSpeed Insights API key.
The second row specifies the test options. You can use "desktop", "mobile", or both separated by a comma.

## Authoring

1. Obtain a Google PageSpeed Insights API key from the Google Cloud Console.
2. Add the block to your page and insert your API key as plain text in the first cell of the table.
3. In the second cell, specify the test options (desktop, mobile, or both).
4. The API key will be automatically removed from the visible content when the scores are displayed.

## Styling

The block uses CSS variables for colors and animations. You can customize the appearance by modifying the CSS file.

## Behavior

The block makes an API call to Google PageSpeed Insights to fetch Lighthouse scores for performance, accessibility, best practices, and SEO. It then displays these scores as circular progress indicators.

## Dependencies

This block requires a valid Google PageSpeed Insights API key.

## Accessibility

The block uses ARIA attributes to ensure screen readers can interpret the score values correctly.

## Troubleshooting

If you see an error message about an invalid or expired API key, please obtain a new API key from the Google Cloud Console and update the block.
