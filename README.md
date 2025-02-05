# Resume Builder

A modern, interactive resume builder application built with React and TypeScript. Create, edit, and visualize your professional journey with an intuitive interface.

## Features

- Interactive resume building interface
- Two view modes:
  - Traditional text view
  - Interactive timeline visualization
- Real-time preview
- Responsive design
- Data persistence
- Professional styling

## Technologies Used

- React
- TypeScript
- Redux Toolkit
- Tailwind CSS
- react-chrono
- React Router

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/benjaminlaver89/resume-builder.git
```

2. Install dependencies:
```bash
cd resume-builder
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Fill in your personal information
2. Add your educational background
3. Input your work experience
4. Add relevant skills
5. Toggle between text and timeline views to visualize your career progression
6. Save or export your resume

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
```

And here's the git commit message:

```
feat: implement interactive timeline visualization

- Add react-chrono for timeline visualization
- Create dual-view resume preview (text/timeline)
- Implement horizontal timeline with experience cards
- Add zoom and scroll functionality
- Style timeline cards and interactions
- Fix description display in timeline cards
- Add debug logging for data flow
- Update README with new features

The timeline view provides an intuitive visualization of career progression,
allowing users to see their professional journey in a chronological format.
Experience and education entries are displayed as interactive cards with
full details and proper date formatting.