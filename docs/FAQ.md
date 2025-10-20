# FAQ

## General

**What is this system?**  
A web app for citizens to report community issues (streetlights, potholes, etc.) with GPS tracking, AI categorization, and admin management tools.

**Who can use it?**  
- Citizens: Report and track issues, vote on priorities
- Officers: Manage issues in their area  
- Admins: Full system access and analytics

**Is it free?**  
Yes, open-source under MIT License.

## Technical

**Tech stack?**  
Frontend: React, Vite, Tailwind, Leaflet, Chart.js  
Backend: Node.js, Express, MongoDB  
Services: Appwrite (auth), Cloudinary (images), OpenRouter AI

**Requirements?**  
Development: Node.js 16+, MongoDB, Git  
Production: Web server, Node.js hosting, MongoDB, SSL

**Setup?**  
See [Quick Setup](../README.md#quick-setup) in README.

## Features

**How does AI categorization work?**  
OpenRouter AI analyzes uploaded images and categorizes into: Roads & Transport, Street Lighting, Garbage & Sanitation, Water Supply & Drainage, Electricity, Public Safety, Other.

**Can I use without GPS?**  
Yes, manually set location on the interactive map if GPS unavailable.

**Voting system?**  
Users can vote once per issue to help prioritize community concerns.

## Security

**Account creation?**  
Email/password signup via Appwrite authentication. Email verification required.

**Data protection?**  
Token-based auth, encrypted passwords, HTTPS transmission, Appwrite security platform.

**Account deletion?**  
Yes, request deletion to remove personal data (anonymized reports remain).

## Usage

**How to report an issue?**
1. Go to "Report Issue" page
2. Set location (GPS or manual)
3. Add title, description, photo (optional)
4. AI auto-categorizes, then submit

**Track issues?**  
Check your dashboard for status updates.

**Resolution time?**  
Varies by complexity, resources, priority voting, and local processes.

## Admin

**Admin features?**  
Dashboard with charts, issue management, search/filter, analytics, activity logs, user management.

**Custom categories?**  
Yes, modify in backend config. AI can be retrained for custom categories.

**Reports?**  
Built-in analytics with charts, trends, exportable data.

## Troubleshooting

**Map not loading?**  
Check internet, clear cache, disable extensions, try different browser.

**Can't upload images?**  
Max 1MB, use JPG/PNG/WebP, check browser permissions, verify connection.

**GPS inaccurate?**  
Enable high-accuracy GPS, go outdoors, wait for stabilization, manually adjust pin.

**No status updates?**  
Check login status, verify email, check spam folder.

**App running slow?**  
Close tabs, clear cache, disable extensions, update browser.

## Integration

**Municipal system integration?**  
Yes, API-first design supports integration with databases, GIS, work orders, communication platforms.

**Mobile app?**  
Responsive web app works on mobile. Dedicated app in roadmap.

**Data export?**  
Admins can export CSV data, reports, logs, user statistics.

## Contributing

**How to contribute?**  
See [Contributing Guide](../CONTRIBUTING.md) for setup, standards, and PR process.

**Report bugs?**  
Use [GitHub Issues](https://github.com/tilakjain619/Smart-Community-Issue-Reporting-System/issues) with reproduction steps and details.

**Request features?**  
Use our feature request template on GitHub Issues.

**Still have questions?** Search GitHub issues or create new one with "question" label.