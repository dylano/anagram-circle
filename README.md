# Anagram Circle

A tool to help identify word anagrams, inspired by the book [Minute Cryptic](https://a.co/d/eJdJrUb).

<img width="300" height="596" alt="image" src="https://github.com/user-attachments/assets/aa2415fc-5aff-4aab-b368-7d1184cb327c" />

## How It Works

1. **Enter Letters**: Input the candidate letters. The letters are automatically shuffled and arranged in a circle.

2. **Build Words**: Click or tap letters in the circle to build words. As you select letters, they're connected with visual lines showing your path.

3. **Visual Path Tracking**:

   - **Green solid dot**: Marks the starting letter
   - **Hollow circles**: Show intermediate letters in your path
   - **Black solid dot**: Appears when you've used all available letters (complete path)

4. **Rewind & Reset**:

   - Click any used letter to rewind back to that point
   - Click the first letter to clear everything and start fresh
   - Use the × button in the input field to clear the current word

5. **Shuffle**: Click the "Shuffle" button to rearrange the letters in a new random order.

## Features

- **Visual Graph**: See your word-building path as you create it
- **Mobile-Friendly**: Responsive design that works on mobile devices
- **PWA Support**: Install as an app on your Android device's home screen

## Tech Stack

- React 18 + TypeScript
- Vite
- CSS Modules
- Progressive Web App (PWA) with manifest and icons

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm build

# Preview production build
npm preview
```

## Icons

Icons are generated using `generate-icons.js`. To regenerate:

```bash
node generate-icons.js
```
