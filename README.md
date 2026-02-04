# Creative Templates App

A modern, visual template editor and dashboard built with Next.js, React-Konva, and Supabase.

## 1. How to Run Locally

### Prerequisites

- Node.js (v20+)
- Docker (for local Supabase instance)

### Installation

```bash
# Install dependencies
npm install
```

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key_here
```

_Note: You can get these values after starting the local Supabase instance._

### Start Commands

```bash
# Start development server, supabase should be running already
npm run dev

# Run tests
npm test
```

## 2. How to Set up the Database

The project uses Supabase for DB and API. Install if needed.

1. **Initialize Supabase**:
   If you have the Supabase CLI installed, run:
   ```bash
   npx supabase start
   ```
2. **Apply Migrations**:
   The schema is defined in `supabase/migrations/`. They are automatically applied when starting local Supabase, or you can run:

   ```bash
   npx supabase db reset
   ```

3. **Stop Supabase**:
   To stop the local Supabase instance, run:
   ```bash
   npx supabase db reset
   ```

## 3. Known Limitations & Future Improvements

### Limitations

- **Canvas Dimensions**: Currently defaults to 600x600px in the editor stage for consistent layout.
- **Channels and Status**: Cannot be changed after creation.
- **Status**: exists but can't be changed, defaults to "draft".
- **AI Helper**: The product copy generation is currently mocked.
- **Undo/Redo**: The state management (reducer) is ready for history, but the UI for undo/redo is not yet implemented.

### Future Improvements

- **Real AI Integration**: Connect the "AI Copy Helper" to an LLM.
- **Advanced Layers**: Add support for SVG shapes, groups, and multi-selection.
- **Asset Library**: Integrated image upload and browsing via Supabase Storage.

## 4. AI Tooling Usage

This project was developed with the assistance of **Antigravity**, an agentic AI coding assistant.

- **Planning**: Used for architecting the canvas state reducer and database schema.
- **Execution**: Automated the creation of boilerplate, Supabase utilities, and complex Konva component structures.
