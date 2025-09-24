# GitHub MCP Server

A Model Context Protocol (MCP) server that provides comprehensive GitHub API integration for AI assistants. This server enables full interaction with GitHub repositories, issues, pull requests, and more through MCP tools.

## Features

### Repository Management
- `list_repositories` - List repositories for any GitHub user
- `list_my_repositories` - List repositories for the authenticated user (including private)
- `create_repository` - Create a new repository
- `get_repository` - Get detailed information about a repository
- `update_repository` - Update repository settings (name, description, visibility)
- `delete_repository` - Delete a repository

### Branch and Commit Management
- `list_branches` - List branches in a repository
- `list_commits` - List commits in a repository

### Fork Management
- `list_forks` - List forks of a repository
- `create_fork` - Create a fork of a repository

### Collaborator Management
- `list_collaborators` - List collaborators of a repository
- `add_collaborator` - Add a collaborator to a repository
- `remove_collaborator` - Remove a collaborator from a repository

### Issue Tracking
- `list_issues` - List issues in a repository
- `create_issue` - Create a new issue
- `update_issue` - Update an issue
- `close_issue` - Close an issue
- `list_issue_comments` - List comments on an issue
- `create_issue_comment` - Create a comment on an issue

### Pull Request Management
- `list_pull_requests` - List pull requests in a repository
- `create_pull_request` - Create a pull request
- `update_pull_request` - Update a pull request
- `merge_pull_request` - Merge a pull request

### Release Management
- `list_releases` - List releases in a repository
- `create_release` - Create a release

### Search and Discovery
- `search_repositories` - Search for repositories
- `search_issues` - Search for issues and pull requests

### User and System Information
- `get_authenticated_user` - Get information about the authenticated user
- `get_rate_limit` - Get current rate limit status

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
