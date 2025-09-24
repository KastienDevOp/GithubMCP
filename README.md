# GitHub MCP Server

A Model Context Protocol (MCP) server that provides comprehensive GitHub API integration for AI assistants. This server enables full interaction with GitHub repositories, issues, pull requests, and more through MCP tools.

## Features

### Repository Management
- `list_repositories` - List repositories for any GitHub user
- `list_my_repositories` - List repositories for the authenticated user (including private)
- `create_repository` - Create a new repository
- `get_repository` - Get detailed information about a repository
- `delete_repository` - Delete a repository

### Issue Tracking
- `list_issues` - List issues in a repository
- `create_issue` - Create a new issue

### Branch and Pull Request Management
- `list_branches` - List branches in a repository
- `list_pull_requests` - List pull requests in a repository
- `create_pull_request` - Create a new pull request

### User Information
- `get_authenticated_user` - Get information about the authenticated user

## Setup

### Prerequisites
- Node.js (v16 or higher)
- A GitHub Personal Access Token with appropriate permissions

### Installation

1. Clone this repository:
```bash
git clone https://github.com/KastienDevOp/GithubMCP.git
cd GithubMCP
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

### Configuration

Create a GitHub Personal Access Token:
1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate a new token with the following scopes:
   - `repo` (Full control of private repositories)
   - `public_repo` (Access public repositories)
   - `read:org` (Read org and team membership)
   - `user` (Update all user data)

### MCP Configuration

Add the server to your MCP settings. For Cline/VSCode, edit:
`/home/kastien/.config/Windsurf/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/path/to/GithubMCP/build/index.js"],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Replace `/path/to/GithubMCP` with the actual path to your cloned repository.

### Usage

Once configured, the GitHub MCP server will be available in your AI assistant. You can use commands like:

- "List my GitHub repositories"
- "Create a new repository called 'my-project'"
- "List issues in the KastienDevOp/my-repo repository"
- "Create an issue titled 'Bug fix needed' in KastienDevOp/my-repo"

## Development

For development with auto-rebuild:
```bash
npm run watch
```

### Debugging

Use the MCP Inspector for debugging:
```bash
npm run inspector
```

## License

This project is open source. See the license file for details.
