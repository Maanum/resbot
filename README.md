# ResBot

AI-powered RSS feed analyzer that delivers topic-specific content summaries to your Gmail inbox.

## Background

Built to solve a real problem I faced as a Product Manager: staying current with industry news across multiple sources without information overload. Rather than manually checking dozens of feeds daily, I needed an intelligent system to surface the most relevant insights. ResBot is actively used for monitoring product management trends, AI developments, and competitor updates.

## What It Does

ResBot helps you stay on top of new articles and internet content by:
- Monitoring RSS feeds for articles on specific topics
- Analyzing content using OpenAI GPT inference API to extract key insights
- Delivering personalized summaries directly to your email

## Architecture

The application is split into separate frontend and backend components:

```
resbot/
├── backend/    # Core RSS processing and AI analysis
└── frontend/   # User interface (in development)
```

## Current Status

- ✅ **Backend**: Fully functional RSS feed processing and ChatGPT integration
- 🚧 **Frontend**: In development to provide better user experience and management interface

## Use Cases

- Stay updated on industry news without information overload
- Monitor competitor announcements and product releases
- Track research topics or technical developments
- Get AI-curated summaries of content relevant to your interests

## How It Works

1. Configure RSS feeds for topics you want to monitor
2. ResBot fetches new articles and analyzes them with ChatGPT
3. Receive intelligent summaries and insights via email
4. Stay informed without manually browsing multiple sources

---

*Currently focused on building out the frontend interface to make setup and management more user-friendly.*
