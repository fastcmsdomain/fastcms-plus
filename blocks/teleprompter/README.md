# Teleprompter2

The Teleprompter2 block is an advanced Franklin component that provides a customizable teleprompter functionality for web pages.

## Usage

To use the Teleprompter2 block, simply add it to your Franklin page using the following structure:

| Teleprompter2 |
|---------------|
|               |

## Authoring

No specific content is required within the Teleprompter2 block in Google Docs or Microsoft Word. The block will automatically extract and display all text content from the page below its position.

## Styling

The Teleprompter2 block comes with pre-defined styles. You can customize its appearance by modifying the CSS variables or adding custom classes.

## Behavior

1. Initially, a clickable teleprompter icon (📙) is displayed in the top-left corner of the viewport.
2. Clicking the icon activates the teleprompter, which appears centered on the screen.
3. The teleprompter displays the page title and content, with the current line highlighted.
4. Users can scroll through the content using the mouse wheel or arrow keys.
5. The spacebar toggles between play and pause states.
6. Pressing the Esc key closes the teleprompter and returns to the icon view.
7. The teleprompter window is draggable for repositioning.

## Accessibility

- The teleprompter icon is keyboard focusable and has an appropriate aria-label.
- All keyboard controls are fully functional for navigation and control.

## Dependencies

This block has no external dependencies beyond the core Franklin libraries.

## Suggestions for Improvement

1. Add font size controls for better readability customization.
2. Implement a speed control feature for automatic scrolling.
3. Add a color theme switcher for different viewing preferences.
4. Include an option to save and load teleprompter sessions.
5. Implement multi-language support for internationalization.

These enhancements would make the Teleprompter2 block even more versatile and user-friendly.