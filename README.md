# Companions Graph

An educational React + TypeScript web app that visualizes the Companions (Sahaba) of the Prophet Muhammad ﷺ using a 2-level node-link graph.

## Project Features

- **Educational & Respectful**: Focuses on historical accuracy and respectful representation
- **Zero-Budget Hosting**: Deployable to GitHub Pages
- **Interactive Graph**: 2-level node visualization with React Flow
- **Responsive UI**: Built with React, TypeScript, Tailwind CSS, and Vite
- **Relationship Filtering**: Toggle between companionship (suhbah) and family relationships

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- React Flow (graph visualization)
- Tailwind CSS (styling)
- JSON data (no backend required)

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   └── SahabaGraph.tsx       # Main graph component with React Flow
├── utils/
│   └── buildTwoLevelGraph.ts # Graph logic and layout algorithm
├── data/
│   ├── sahaba.json           # Companion data
│   └── relationships.json    # Relationship definitions
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## Graph Visualization

### Node Types
- **Prophet ﷺ**: Central node, highlighted in gold
- **Level 1**: Direct companions (suhbah relationships)
- **Level 2**: Companions connected to level-1 nodes

### Relationship Types
- **Suhbah** (Companionship): Soft gold color
- **Family**: Green color

### Layout
- Prophet ﷺ is fixed at the center (0, 0)
- Level 1 nodes arranged in a circle at radius 150px
- Level 2 nodes arranged in an outer circle at radius 300px

## Features

### Interactive Controls
- **Toggle Suhbah**: Show/hide companionship relationships
- **Toggle Family**: Show/hide family relationships
- **Pan & Zoom**: Use mouse to navigate the graph
- **Minimap**: Quick view of the entire graph

### Design Principles
- Calm, clean UI without playful animations
- Minimal and readable
- Respectful presentation
- No images of people

## Deployment

### GitHub Pages

1. Update `vite.config.ts` with your repository name if needed (currently set to `/CompanionsGraph/`)
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

The site will be available at `https://yourusername.github.io/CompanionsGraph/`

## Data Format

### sahaba.json
```json
{
  "sahaba": [
    {
      "id": "prophet",
      "name": "Prophet Muhammad ﷺ",
      "type": "prophet"
    },
    {
      "id": "abu-bakr",
      "name": "Abu Bakr as-Siddiq",
      "type": "companion"
    }
  ]
}
```

### relationships.json
```json
{
  "relationships": [
    {
      "source": "prophet",
      "target": "abu-bakr",
      "type": "suhbah"
    },
    {
      "source": "abu-bakr",
      "target": "aisha",
      "type": "family"
    }
  ]
}
```

## Future Enhancements

- Add more companions and relationships from historical sources
- Implement search and filtering
- Add biographical information panels
- Support for multiple languages
- Timeline view for historical context

## Contributing

This is an open-source educational project. Contributions are welcome with a focus on historical accuracy and respectful representation.

## License

MIT License - feel free to use this project for educational purposes.

## References

- Islamic historical records and hadith collections
- Academic sources on Sahaba
- Educational resources on Islamic history

The focus is:
	•	Educational
	•	Respectful
	•	Historically grounded
	•	Zero-budget (GitHub Pages hosting)

⸻

Tech Constraints
	•	Web only (no React Native)
	•	React + TypeScript
	•	Vite
	•	React Flow for graph visualization
	•	TailwindCSS for styling
	•	No backend (JSON data only)
	•	Must be deployable to GitHub Pages

⸻

App Requirements

Data
	•	Create /src/data/sahaba.json
	•	Create /src/data/relationships.json
	•	Use simple factual fields only (id, name, type)

Example Sahaba:
	•	Prophet Muhammad ﷺ (central node)
	•	Abu Bakr
	•	Umar ibn al-Khattab

Relationship types:
	•	suhbah (companionship with the Prophet ﷺ)
	•	family (optional, secondary)

⸻

Graph Logic
	•	Center node = Prophet ﷺ
	•	Level 1 = direct suhbah relationships
	•	Level 2 = relationships from level-1 nodes
	•	No more than 2 levels rendered

⸻

Visualization Rules
	•	Prophet ﷺ node is visually emphasized and fixed in center
	•	Level-1 nodes arranged in a circle
	•	Level-2 nodes arranged in an outer circle
	•	Edge color:
	•	suhbah → soft gold
	•	family → green
	•	Disable node deletion and random dragging

⸻

Components to Create
	•	SahabaGraph.tsx (React Flow graph)
	•	buildTwoLevelGraph.ts (graph filtering logic)
	•	Minimal layout with title and subtitle:
	•	Title: Companions Graph
	•	Subtitle: Mapping Exemplary Lives

⸻

UX Requirements
	•	Simple and calm UI
	•	No animations that feel playful or chaotic
	•	Include toggle checkboxes for relationship types
	•	No images of people

⸻

Output
	•	Fully working local dev setup
	•	Clean folder structure
	•	Clear comments where logic matters
	•	Ready for GitHub Pages deployment

⸻

Start by:
	1.	Creating the Vite React + TS project
	2.	Installing dependencies
	3.	Adding sample data
	4.	Rendering the initial 2-level graph

Keep everything minimal, readable, and respectful.
