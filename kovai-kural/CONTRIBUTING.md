# Contributing to Kovai Kural

Thank you for considering contributing! Here's how you can help.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/kovai-kural.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m "Add: your feature description"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Code Style

### Backend (JavaScript)
- Use CommonJS (`require/module.exports`)
- 2 spaces indentation
- Semicolons required
- Use async/await over callbacks
- Add JSDoc comments for functions

### Frontend (React)
- Use ES6+ modules (`import/export`)
- 2 spaces indentation
- Functional components with hooks
- Use descriptive component names
- Keep components small and focused

## Commit Messages

Format: `Type: Description`

Types:
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Modify existing feature
- `Remove:` Delete code/feature
- `Docs:` Documentation only
- `Style:` Formatting, no code change
- `Refactor:` Code restructuring
- `Test:` Add/update tests

Examples:
- `Add: user profile edit functionality`
- `Fix: comment voting not updating count`
- `Update: improve loading spinner animation`

## Pull Request Guidelines

- Describe what your PR does
- Reference related issues: `Fixes #123`
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused (one feature/fix per PR)

## Testing

Before submitting:
1. Test backend: `cd backend && npm test`
2. Test frontend: `cd frontend && npm run lint`
3. Manual testing using [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## Reporting Bugs

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment (OS, Node version, browser)

## Feature Requests

- Check existing issues first
- Describe the problem it solves
- Suggest implementation approach
- Consider backward compatibility

## Questions?

Open an issue with the `question` label.

Thank you for contributing! 🎉
