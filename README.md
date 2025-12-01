# Job Application Automation Platform

AI-powered job application tool that automatically tailors your resume to match job descriptions and applies to positions.

## Features

- **Resume Upload**: Support for PDF, DOC, DOCX, and TXT formats
- **AI Resume Editor**: Automatically tailors resume based on job description
- **Keyword Matching**: Extracts key requirements and highlights relevant experience
- **ATS Optimization**: Formats resume to pass Applicant Tracking Systems
- **One-Click Apply**: Automated job application submission
- **Download Tailored Resume**: Save customized versions for each application

## How It Works

1. **Upload Your Resume**: Upload your base resume in any supported format
2. **Paste Job Description**: Copy and paste the job posting details
3. **AI Analysis**: The system analyzes requirements and tailors your resume
4. **Review & Edit**: Review the customized resume before applying
5. **Apply**: Submit your application with the optimized resume

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Inline CSS (no dependencies)
- **AI Processing**: Custom keyword extraction and matching algorithms
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

No environment variables required for basic functionality.

For advanced features (optional):
- `OPENAI_API_KEY`: For enhanced AI resume editing
- `JOB_BOARD_API_KEY`: For automated job board integration

## Deployment

This project is optimized for Vercel deployment:

```bash
vercel deploy
```

## Future Enhancements

- Integration with LinkedIn Easy Apply
- Indeed Quick Apply support
- Company career portal automation
- Application tracking dashboard
- Email notifications for application status
- Multi-resume management
- Job search and recommendation engine

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.