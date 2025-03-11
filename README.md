# Murim Login Novel Reader

A clean, aesthetic web-based reader for the Murim Login novel. This application allows readers to browse and read chapters with a comfortable reading experience.

## Features

- **Home Page**: Grid view of all available chapters
- **Individual Chapter Pages**: Clean reading experience for each chapter
- **Dark/Light Mode**: Toggle between dark and light reading modes (default is dark mode)
- **Font Size Control**: Adjust text size for comfortable reading with a slider
- **Navigation**: Previous/Next chapter buttons for seamless reading
- **Responsive Design**: Works on desktop and mobile devices
- **Persistent Settings**: User preferences for theme and font size are saved between visits

## Installation

1. Clone this repository to your local machine
2. Make sure your directory structure has the novel chapters in the following format:
   ```
   data/
   ├── chapter-XXX/
   │   ├── chapter-XXX.txt (content)
   │   └── README.md (metadata)
   ```
3. Install Node.js dependencies:
   ```
   npm install
   ```

## Usage

### Running the Server (Recommended)

Start the Node.js server to properly load chapter content and metadata:

```bash
npm start
```

Then open your browser and navigate to `http://localhost:3000`.

### Alternative Methods

You can also use:

**Python HTTP Server:**
```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

**Node.js HTTP Server:**
```bash
# Install http-server if you haven't already
npm install -g http-server

# Run the server
http-server
```

## How It Works

- **index.html**: The home page that displays a grid of all available chapters
- **chapter.html**: Template for individual chapter pages, loaded with content dynamically
- **home.js**: Handles loading and displaying the chapter list
- **chapter.js**: Handles loading and displaying chapter content
- **styles.css**: Styling with dark/light mode support
- **server.js**: Simple Node.js server for local development

## Customization

- Modify `styles.css` to change the appearance and colors
- Adjust the theme variables in `:root` to change the color scheme

## License

This project is open-source and available for personal and educational use.

## Credits

- Original novel: Murim Login
- Translations: Various translators (credited in each chapter)
- Updated and maintained with ❤️ 