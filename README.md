# TheLawn - Lawn Area Calculator

A professional lawn area calculator with integrated pesticide/foliar and topdress sand calculators for lawn care in Malaysia.

## Features

- **Interactive Map-Based Area Calculator**
  - Click to add measurement points
  - Drag points to adjust boundaries
  - Right-click to remove points
  - Switch between satellite and street views
  - Real-time area calculation in m² and sqft

- **Pesticide/Foliar Mixing Calculator**
  - Calculate proper mixing ratios based on product labels
  - Convert between different units (ml/liter for liquids, ft²/m²/hectare for area)
  - Automatic calculation based on your lawn area

- **Topdress Sand Calculator**
  - Calculate sand volume needed for topdressing
  - Input thickness in mm and area in sqft
  - Results shown in m³ and cubic feet

- **Location Services**
  - Search for any location worldwide
  - Use your current GPS location
  - High-resolution satellite imagery

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **JavaScript (ES6+)** - Interactive functionality
- **Leaflet.js** - Interactive map library
- **OpenStreetMap** - Street map tiles
- **Esri World Imagery** - Satellite map tiles
- **Nominatim API** - Location search

## Getting Started

### Option 1: Direct File Access

Simply open `index.html` in a web browser. All dependencies are loaded from CDNs.

### Option 2: Local Web Server

For the best experience, serve the files through a web server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `lawn-calculator`)
4. Choose "Public" (required for free GitHub Pages)
5. Click "Create repository"

### Step 2: Upload Files

**Method A: Using Git (Recommended)**

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Lawn area calculator"

# Add remote repository (replace USERNAME and REPO with your values)
git remote add origin https://github.com/USERNAME/REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Method B: Using GitHub Web Interface**

1. On your repository page, click "uploading an existing file"
2. Drag and drop all files (`index.html`, `app.js`, `README.md`)
3. Click "Commit changes"

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### Step 4: Access Your Site

After a few minutes, your site will be live at:
```
https://USERNAME.github.io/REPO/
```

Replace `USERNAME` with your GitHub username and `REPO` with your repository name.

## Usage Guide

### Measuring Your Lawn Area

1. **Find Your Location**
   - Use the search bar to find your address
   - Or click "My Location" to use GPS

2. **Switch to Satellite View**
   - Click the "Satellite" button for better visibility

3. **Mark Boundaries**
   - Click on the map to place points around your lawn
   - Drag points to adjust position
   - Right-click on a point to remove it

4. **View Results**
   - Area is calculated automatically with 3+ points
   - Results shown in both m² and sqft

### Using the Pesticide Calculator

1. Enter the product label specifications:
   - Amount of pesticide/foliar (from bottle label)
   - Amount of water to mix with
   - Coverage area (from bottle label)

2. Enter your lawn area (auto-filled from map measurement)

3. Click "Kira" (Calculate) to get:
   - Required pesticide amount
   - Required water amount

### Using the Sand Calculator

1. Enter the desired topdress thickness in mm
2. Enter your lawn area in sqft (auto-filled from map)
3. Click "Kira" to get sand volume needed

## File Structure

```
lawn-calculator/
│
├── index.html          # Main HTML file
├── app.js             # JavaScript functionality
└── README.md          # Documentation
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

**Note:** Geolocation requires HTTPS (works on localhost and GitHub Pages)

## Customization

### Changing Default Location

Edit `app.js` line 2:
```javascript
const map = L.map('map').setView([YOUR_LAT, YOUR_LNG], 13);
```

### Changing Colors

Edit the CSS in `index.html`:
- Primary color: `#059669` (green)
- Amber color: `#d97706` (orange)

### Adding More Map Layers

Add additional tile layers in `app.js`:
```javascript
const customLayer = L.tileLayer('TILE_URL', {
    attribution: 'YOUR_ATTRIBUTION',
    maxZoom: 20
});
```

## API Usage

This application uses free, open APIs:

- **OpenStreetMap Nominatim** - Location search (please respect [usage policy](https://operations.osmfoundation.org/policies/nominatim/))
- **Leaflet.js** - CDN hosted library
- **Esri World Imagery** - Free satellite tiles

## Performance Optimization

The application is optimized for performance:
- Minimal dependencies (only Leaflet.js)
- CSS and JS loaded from CDN
- Efficient polygon calculations
- No build process required

## Known Limitations

- Area calculation uses approximation (accurate for small areas)
- Location search requires internet connection
- Satellite imagery resolution varies by location

## Future Enhancements

- [ ] Save/load lawn measurements
- [ ] Export measurements to PDF
- [ ] Multiple lawn area support
- [ ] Fertilizer calculator
- [ ] Irrigation water calculator
- [ ] Mobile app version

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include browser and OS information

## Credits

- Map data: OpenStreetMap contributors
- Satellite imagery: Esri
- Map library: Leaflet.js

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Made with ❤️ for lawn care professionals and enthusiasts in Malaysia