# Anagram Circle

A tool to help identify word anagrams, inspired by the book [Minute Cryptic](https://a.co/d/eJdJrUb).

<img width="300" height="596" alt="image" src="https://github.com/user-attachments/assets/aa2415fc-5aff-4aab-b368-7d1184cb327c" />

## How It Works

1. **Enter Letters**: Input the candidate letters. The letters are automatically shuffled and arranged in a circle.

2. **Build Words**: Click or tap letters in the circle to build words. As you select letters, they're connected with visual lines showing your path.

3. **Rewind & Reset**:

   - Click any used letter to rewind back to that point
   - Click the first letter to clear everything and start fresh
   - Use the × button in the input field to clear all letters and start over

4. **Shuffle**: Click the "Shuffle" button to rearrange the letters in a new random order.

5. **Copy Word**: Click or tap the built word displayed at the bottom to copy it to your clipboard. A clipboard emoji will briefly appear to confirm the copy.

## Features

- **Visual Graph**: See your word-building path as you create it
- **Built Word Display**: Your current word is shown at the bottom of the screen
- **Copy to Clipboard**: Click the built word to copy it instantly
- **Mobile-Friendly**: Responsive design that works on mobile devices
- **PWA Support**: Install as an app on your Android device's home screen

## Tech Stack

- React 18 + TypeScript
- Vite
- Progressive Web App (PWA) with manifest and icons

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
