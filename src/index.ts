#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const server = new Server(
  {
    name: "github-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_repositories",
        description: "List repositories for a GitHub user",
        inputSchema: {
          type: "object",
          properties: {
            user: {
              type: "string",
              description: "GitHub username"
            }
          },
          required: ["user"]
        }
      },
      {
        name: "create_repository",
        description: "Create a new repository",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Repository name"
            },
            description: {
              type: "string",
              description: "Repository description"
            },
            private: {
              type: "boolean",
              description: "Whether the repository is private"
            }
          },
          required: ["name"]
        }
      },
      {
        name: "get_repository",
        description: "Get information about a repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Repository owner"
            },
            repo: {
              type: "string",
              description: "Repository name"
            }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: "list_issues",
        description: "List issues in a repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Repository owner"
            },
            repo: {
              type: "string",
              description: "Repository name"
            }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: "create_issue",
        description: "Create a new issue in a repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Repository owner"
            },
            repo: {
              type: "string",
              description: "Repository name"
            },
            title: {
              type: "string",
              description: "Issue title"
            },
            body: {
              type: "string",
              description: "Issue body"
            }
          },
          required: ["owner", "repo", "title"]
        }
      },
      {
        name: "list_my_repositories",
        description: "List repositories for the authenticated user (including private)",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "delete_repository",
        description: "Delete a repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Repository owner"
            },
            repo: {
              type: "string",
              description: "Repository name"
            }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: "list_branches",
        description: "List branches in a repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Repository owner"
            },
            repo: {
              type: "string",
              description: "Repository name"
            }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: "list_pull_requests",
        description: "List pull requests in a repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Repository owner"
            },
            repo: {
              type: "string",
              description: "Repository name"
            }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: "create_pull_request",
        description: "Create a pull request in a repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Repository owner"
            },
            repo: {
              type: "string",
              description: "Repository name"
            },
            title: {
              type: "string",
              description: "Pull request title"
            },
            head: {
              type: "string",
              description: "The name of the branch where your changes are implemented"
            },
            base: {
              type: "string",
              description: "The name of the branch you want the changes pulled into"
            },
            body: {
              type: "string",
              description: "Pull request body"
            }
          },
          required: ["owner", "repo", "title", "head", "base"]
        }
      },
      {
        name: "get_authenticated_user",
        description: "Get the authenticated user's information",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_repositories": {
        const user = String(args?.user);
        if (!user) throw new Error("User is required");
        const { data } = await octokit.repos.listForUser({ username: user });
        const names = data.map(repo => repo.name).join('\n');
        return {
          content: [{
            type: "text",
            text: names || "No repositories found"
          }]
        };
      }
      case "create_repository": {
        const name = String(args?.name);
        if (!name) throw new Error("Name is required");
        const description = args?.description ? String(args.description) : undefined;
        const isPrivate = args?.private ? Boolean(args.private) : false;
        const { data } = await octokit.repos.createForAuthenticatedUser({ name, description, private: isPrivate });
        return {
          content: [{
            type: "text",
            text: `Created repository: ${data.html_url}`
          }]
        };
      }
      case "get_repository": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.repos.get({ owner, repo });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(data, null, 2)
          }]
        };
      }
      case "list_issues": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.issues.listForRepo({ owner, repo });
        const issues = data.map(issue => `${issue.number}: ${issue.title}`).join('\n');
        return {
          content: [{
            type: "text",
            text: issues || "No issues found"
          }]
        };
      }
      case "create_issue": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const title = String(args?.title);
        if (!owner || !repo || !title) throw new Error("Owner, repo, and title are required");
        const body = args?.body ? String(args.body) : undefined;
        const { data } = await octokit.issues.create({ owner, repo, title, body });
        return {
          content: [{
            type: "text",
            text: `Created issue: ${data.html_url}`
          }]
        };
      }
      case "list_my_repositories": {
        const { data } = await octokit.repos.listForAuthenticatedUser();
        const names = data.map(repo => repo.name).join('\n');
        return {
          content: [{
            type: "text",
            text: names || "No repositories found"
          }]
        };
      }
      case "delete_repository": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        await octokit.repos.delete({ owner, repo });
        return {
          content: [{
            type: "text",
            text: `Deleted repository ${owner}/${repo}`
          }]
        };
      }
      case "list_branches": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.repos.listBranches({ owner, repo });
        const branches = data.map(b => b.name).join('\n');
        return {
          content: [{
            type: "text",
            text: branches || "No branches found"
          }]
        };
      }
      case "list_pull_requests": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.pulls.list({ owner, repo });
        const prs = data.map(pr => `${pr.number}: ${pr.title}`).join('\n');
        return {
          content: [{
            type: "text",
            text: prs || "No pull requests found"
          }]
        };
      }
      case "create_pull_request": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const title = String(args?.title);
        const head = String(args?.head);
        const base = String(args?.base);
        if (!owner || !repo || !title || !head || !base) throw new Error("Owner, repo, title, head, and base are required");
        const body = args?.body ? String(args.body) : undefined;
        const { data } = await octokit.pulls.create({ owner, repo, title, head, base, body });
        return {
          content: [{
            type: "text",
            text: `Created pull request: ${data.html_url}`
          }]
        };
      }
      case "get_authenticated_user": {
        const { data } = await octokit.users.getAuthenticated();
        return {
          content: [{
            type: "text",
            text: `Username: ${data.login}\nName: ${data.name || 'N/A'}\nEmail: ${data.email || 'N/A'}`
          }]
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error: ${(error as Error).message}`
      }],
      isError: true
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
