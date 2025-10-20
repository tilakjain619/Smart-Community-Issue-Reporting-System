# Contributing Guide

Thanks for your interest in contributing! This guide covers the essentials for contributing to the Smart Community Issue Reporting System.

## Quick Start

**Prerequisites:** Node.js 16+, MongoDB, Git, basic React/Node.js knowledge

```bash
# Fork on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/Smart-Community-Issue-Reporting-System.git
cd Smart-Community-Issue-Reporting-System
git remote add upstream https://github.com/tilakjain619/Smart-Community-Issue-Reporting-System.git

# Setup (see README for detailed instructions)
cd backend && npm install && cp .env.example .env
cd ../frontend && npm install && cp .env.example .env
```

## How to Contribute

**Find Issues:** Look for `bug`, `enhancement`, `good-first-issue`, or `hacktoberfest` labels

**Contribution Areas:**
- **Frontend:** UI/UX, React components, accessibility, performance
- **Backend:** APIs, database optimization, security, error handling
- **DevOps:** Docker, CI/CD, testing, monitoring
- **Docs:** API docs, tutorials, setup guides

## Workflow

```bash
# 1. Create branch
git checkout main && git pull upstream main
git checkout -b feature/your-feature-name

# 2. Make changes, test, commit
git commit -m "type(scope): brief description"

# 3. Push and create PR
git push origin feature/your-feature-name
```

## Code Standards

- **Style:** 2 spaces, semicolons required, single quotes
- **React:** Functional components with hooks
- **Commits:** `type(scope): description` format
- **Testing:** Write tests for new features

## Labels

- `bug`, `enhancement`, `documentation`
- `good-first-issue`, `easy`, `medium`, `hard`  
- `frontend`, `backend`, `devops`
- `hacktoberfest`

## Pull Request Process

1. **Test thoroughly** and update docs if needed
2. **Use the PR template** when submitting
3. **Wait for review** - maintainers respond within 48-72 hours
4. **Address feedback** promptly

## Getting Help

- **GitHub Issues** for bugs and features
- **GitHub Discussions** for questions
- **Comment on existing issues** for clarification

Read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.