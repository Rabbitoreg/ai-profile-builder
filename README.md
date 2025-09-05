# Conference Profile Builder

A multi-user, real-time profile assessment tool designed for conference sessions with up to 200 participants.

## Features

- **Multi-device Support**: Responsive design for mobile, tablet, and laptop
- **Real-time Collaboration**: See group averages update live as participants join
- **Image Export**: Download personal radar charts as PNG images
- **Configurable Content**: All text and labels stored in Supabase for easy editing
- **Interactive Visualization**: Custom radar chart with group comparison overlay
- **Auto-save**: Profile data automatically saved to database with debouncing

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Initialize Database
Run the SQL commands in `supabase-setup.sql` in your Supabase SQL editor to create tables and default content.

### 4. Start Development Server
```bash
npm run dev
```

## Conference Usage

1. **Pre-Conference**: Set up Supabase and deploy the application
2. **During Conference**: Share the URL with participants
3. **Real-time Analytics**: Watch group averages update as people submit profiles
4. **Individual Downloads**: Participants can download their personal radar charts

## Database Schema

### Profiles Table
- `id`: Unique participant identifier
- `creativity`, `technical`, `leadership`, `communication`, `problem_solving`: Skill scores (0-100)
- `created_at`, `updated_at`: Timestamps

### Content Table
- `key`: Content identifier (e.g., 'title', 'skill_creativity_label')
- `value`: Configurable text content
- `created_at`, `updated_at`: Timestamps

## Customization

Edit content through Supabase dashboard or directly in the `content` table:
- `title`: Main heading
- `subtitle`: Description text
- `skill_*_label`: Skill category names
- `skill_*_description`: Skill descriptions

## Technical Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **Image Export**: html2canvas
- **State Management**: React hooks with real-time sync
- **Responsive Design**: Mobile-first with Tailwind breakpoints

## Performance Considerations

- Debounced database saves (500ms delay)
- Real-time subscriptions for group averages
- Optimized for 200 concurrent users
- Efficient radar chart rendering with SVG

## Deployment

```bash
npm run build
```

Deploy the `dist` folder to any static hosting service (Netlify, Vercel, etc.).
