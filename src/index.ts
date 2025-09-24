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
        name: "update_repository",
        description: "Update repository settings (name, description, visibility, etc.)",
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
            name: {
              type: "string",
              description: "New repository name"
            },
            description: {
              type: "string",
              description: "New repository description"
            },
            private: {
              type: "boolean",
              description: "New privacy setting"
            }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: "list_commits",
        description: "List commits in a repository",
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
            sha: {
              type: "string",
              description: "SHA or branch to start listing commits from"
            },
            path: {
              type: "string",
              description: "Only commits containing this file path will be returned"
            }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: "list_forks",
        description: "List forks of a repository",
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
        name: "create_fork",
        description: "Create a fork of a repository",
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
            organization: {
              type: "string",
              description: "Optional organization to fork to"
            }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: "list_collaborators",
        description: "List collaborators of a repository",
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
        name: "add_collaborator",
        description: "Add a collaborator to a repository",
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
            username: {
              type: "string",
              description: "Username to add as collaborator"
            },
            permission: {
              type: "string",
              description: "Permission level (push, pull, admin, maintain, triage)"
            }
          },
          required: ["owner", "repo", "username"]
        }
      },
      {
        name: "remove_collaborator",
        description: "Remove a collaborator from a repository",
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
            username: {
              type: "string",
              description: "Username to remove as collaborator"
            }
          },
          required: ["owner", "repo", "username"]
        }
      },
      {
        name: "update_issue",
        description: "Update an issue",
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
            issue_number: {
              type: "number",
              description: "Issue number"
            },
            title: {
              type: "string",
              description: "New issue title"
            },
            body: {
              type: "string",
              description: "New issue body"
            },
            state: {
              type: "string",
              description: "New state (open or closed)"
            }
          },
          required: ["owner", "repo", "issue_number"]
        }
      },
      {
        name: "close_issue",
        description: "Close an issue",
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
            issue_number: {
              type: "number",
              description: "Issue number"
            }
          },
          required: ["owner", "repo", "issue_number"]
        }
      },
      {
        name: "list_issue_comments",
        description: "List comments on an issue",
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
            issue_number: {
              type: "number",
              description: "Issue number"
            }
          },
          required: ["owner", "repo", "issue_number"]
        }
      },
      {
        name: "create_issue_comment",
        description: "Create a comment on an issue",
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
            issue_number: {
              type: "number",
              description: "Issue number"
            },
            body: {
              type: "string",
              description: "Comment body"
            }
          },
          required: ["owner", "repo", "issue_number", "body"]
        }
      },
      {
        name: "update_pull_request",
        description: "Update a pull request",
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
            pull_number: {
              type: "number",
              description: "Pull request number"
            },
            title: {
              type: "string",
              description: "New pull request title"
            },
            body: {
              type: "string",
              description: "New pull request body"
            },
            state: {
              type: "string",
              description: "New state (open or closed)"
            }
          },
          required: ["owner", "repo", "pull_number"]
        }
      },
      {
        name: "merge_pull_request",
        description: "Merge a pull request",
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
            pull_number: {
              type: "number",
              description: "Pull request number"
            },
            commit_title: {
              type: "string",
              description: "Title for the merge commit"
            },
            commit_message: {
              type: "string",
              description: "Extra detail to append to automatic commit message"
            },
            merge_method: {
              type: "string",
              description: "Merge method (merge, squash, rebase)"
            }
          },
          required: ["owner", "repo", "pull_number"]
        }
      },
      {
        name: "list_releases",
        description: "List releases in a repository",
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
        name: "create_release",
        description: "Create a release",
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
            tag_name: {
              type: "string",
              description: "The name of the tag"
            },
            target_commitish: {
              type: "string",
              description: "Specifies the commitish value that determines where the Git tag is created from"
            },
            name: {
              type: "string",
              description: "The name of the release"
            },
            body: {
              type: "string",
              description: "Text describing the contents of the tag"
            },
            draft: {
              type: "boolean",
              description: "true to create a draft release, false to create a published one"
            },
            prerelease: {
              type: "boolean",
              description: "true to identify the release as a prerelease"
            }
          },
          required: ["owner", "repo", "tag_name"]
        }
      },
      {
        name: "search_repositories",
        description: "Search for repositories",
        inputSchema: {
          type: "object",
          properties: {
            q: {
              type: "string",
              description: "Search query"
            },
            sort: {
              type: "string",
              description: "Sort field (stars, forks, updated)"
            },
            order: {
              type: "string",
              description: "Sort order (asc, desc)"
            }
          },
          required: ["q"]
        }
      },
      {
        name: "search_issues",
        description: "Search for issues and pull requests",
        inputSchema: {
          type: "object",
          properties: {
            q: {
              type: "string",
              description: "Search query"
            },
            sort: {
              type: "string",
              description: "Sort field (created, updated, comments)"
            },
            order: {
              type: "string",
              description: "Sort order (asc, desc)"
            }
          },
          required: ["q"]
        }
      },
      {
        name: "get_rate_limit",
        description: "Get current rate limit status",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "list_labels",
        description: "List labels in a repository",
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
        name: "create_label",
        description: "Create a label in a repository",
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
            name: {
              type: "string",
              description: "Label name"
            },
            color: {
              type: "string",
              description: "Label color (hex code without #)"
            },
            description: {
              type: "string",
              description: "Label description"
            }
          },
          required: ["owner", "repo", "name", "color"]
        }
      },
      {
        name: "list_milestones",
        description: "List milestones in a repository",
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
        name: "create_milestone",
        description: "Create a milestone in a repository",
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
              description: "Milestone title"
            },
            state: {
              type: "string",
              description: "Milestone state (open or closed)"
            },
            description: {
              type: "string",
              description: "Milestone description"
            },
            due_on: {
              type: "string",
              description: "Due date (ISO 8601 format)"
            }
          },
          required: ["owner", "repo", "title"]
        }
      },
      {
        name: "list_webhooks",
        description: "List webhooks in a repository",
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
        name: "create_webhook",
        description: "Create a webhook in a repository",
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
            url: {
              type: "string",
              description: "Webhook URL"
            },
            events: {
              type: "array",
              description: "Array of events to trigger webhook",
              items: {
                type: "string"
              }
            },
            secret: {
              type: "string",
              description: "Webhook secret"
            }
          },
          required: ["owner", "repo", "url", "events"]
        }
      },
      {
        name: "star_repository",
        description: "Star a repository",
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
        name: "unstar_repository",
        description: "Unstar a repository",
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
        name: "list_notifications",
        description: "List notifications for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {
            all: {
              type: "boolean",
              description: "Include all notifications"
            },
            participating: {
              type: "boolean",
              description: "Only participating notifications"
            }
          },
          required: []
        }
      },
      {
        name: "mark_notifications_read",
        description: "Mark notifications as read",
        inputSchema: {
          type: "object",
          properties: {
            last_read_at: {
              type: "string",
              description: "Last read timestamp (ISO 8601)"
            }
          },
          required: []
        }
      },
      {
        name: "list_pull_request_reviews",
        description: "List reviews on a pull request",
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
            pull_number: {
              type: "number",
              description: "Pull request number"
            }
          },
          required: ["owner", "repo", "pull_number"]
        }
      },
      {
        name: "create_pull_request_review",
        description: "Create a review on a pull request",
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
            pull_number: {
              type: "number",
              description: "Pull request number"
            },
            event: {
              type: "string",
              description: "Review action (APPROVE, REQUEST_CHANGES, COMMENT, PENDING)"
            },
            body: {
              type: "string",
              description: "Review body"
            }
          },
          required: ["owner", "repo", "pull_number"]
        }
      },
      {
        name: "list_repository_contents",
        description: "List contents of a repository directory",
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
            path: {
              type: "string",
              description: "Path to directory (empty for root)"
            },
            ref: {
              type: "string",
              description: "Branch/tag/commit SHA"
            }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: "get_repository_content",
        description: "Get content of a file in a repository",
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
            path: {
              type: "string",
              description: "Path to file"
            },
            ref: {
              type: "string",
              description: "Branch/tag/commit SHA"
            }
          },
          required: ["owner", "repo", "path"]
        }
      },
      {
        name: "list_workflows",
        description: "List GitHub Actions workflows in a repository",
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
        name: "list_workflow_runs",
        description: "List workflow runs for a repository",
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
            workflow_id: {
              type: "string",
              description: "Workflow ID or filename"
            }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: "get_repository_languages",
        description: "Get language breakdown for a repository",
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
        name: "get_repository_contributors",
        description: "Get contributors for a repository",
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
      case "update_repository": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const updateData: any = {};
        if (args?.name) updateData.name = String(args.name);
        if (args?.description !== undefined) updateData.description = String(args.description);
        if (args?.private !== undefined) updateData.private = Boolean(args.private);
        const { data } = await octokit.repos.update({ owner, repo, ...updateData });
        return {
          content: [{
            type: "text",
            text: `Updated repository: ${data.html_url}`
          }]
        };
      }
      case "list_commits": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const params: any = { owner, repo };
        if (args?.sha) params.sha = String(args.sha);
        if (args?.path) params.path = String(args.path);
        const { data } = await octokit.repos.listCommits(params);
        const commits = data.map(commit => `${commit.sha.substring(0, 7)}: ${commit.commit.message.split('\n')[0]}`).join('\n');
        return {
          content: [{
            type: "text",
            text: commits || "No commits found"
          }]
        };
      }
      case "list_forks": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.repos.listForks({ owner, repo });
        const forks = data.map(fork => `${fork.owner.login}/${fork.name}`).join('\n');
        return {
          content: [{
            type: "text",
            text: forks || "No forks found"
          }]
        };
      }
      case "create_fork": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const params: any = { owner, repo };
        if (args?.organization) params.organization = String(args.organization);
        const { data } = await octokit.repos.createFork(params);
        return {
          content: [{
            type: "text",
            text: `Created fork: ${data.html_url}`
          }]
        };
      }
      case "list_collaborators": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.repos.listCollaborators({ owner, repo });
        const collaborators = data.map(collab => {
          const perms = collab.permissions;
          const role = perms?.admin ? 'admin' : perms?.push ? 'write' : 'read';
          return `${collab.login} (${role})`;
        }).join('\n');
        return {
          content: [{
            type: "text",
            text: collaborators || "No collaborators found"
          }]
        };
      }
      case "add_collaborator": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const username = String(args?.username);
        if (!owner || !repo || !username) throw new Error("Owner, repo, and username are required");
        const params: any = { owner, repo, username };
        if (args?.permission) params.permission = String(args.permission);
        await octokit.repos.addCollaborator(params);
        return {
          content: [{
            type: "text",
            text: `Added collaborator ${username} to ${owner}/${repo}`
          }]
        };
      }
      case "remove_collaborator": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const username = String(args?.username);
        if (!owner || !repo || !username) throw new Error("Owner, repo, and username are required");
        await octokit.repos.removeCollaborator({ owner, repo, username });
        return {
          content: [{
            type: "text",
            text: `Removed collaborator ${username} from ${owner}/${repo}`
          }]
        };
      }
      case "update_issue": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const issue_number = Number(args?.issue_number);
        if (!owner || !repo || !issue_number) throw new Error("Owner, repo, and issue_number are required");
        const updateData: any = {};
        if (args?.title) updateData.title = String(args.title);
        if (args?.body) updateData.body = String(args.body);
        if (args?.state) updateData.state = String(args.state);
        const { data } = await octokit.issues.update({ owner, repo, issue_number, ...updateData });
        return {
          content: [{
            type: "text",
            text: `Updated issue #${issue_number}: ${data.html_url}`
          }]
        };
      }
      case "close_issue": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const issue_number = Number(args?.issue_number);
        if (!owner || !repo || !issue_number) throw new Error("Owner, repo, and issue_number are required");
        const { data } = await octokit.issues.update({ owner, repo, issue_number, state: 'closed' });
        return {
          content: [{
            type: "text",
            text: `Closed issue #${issue_number}: ${data.html_url}`
          }]
        };
      }
      case "list_issue_comments": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const issue_number = Number(args?.issue_number);
        if (!owner || !repo || !issue_number) throw new Error("Owner, repo, and issue_number are required");
        const { data } = await octokit.issues.listComments({ owner, repo, issue_number });
        const comments = data.map(comment => `${comment.user?.login}: ${comment.body?.substring(0, 100)}${comment.body && comment.body.length > 100 ? '...' : ''}`).join('\n---\n');
        return {
          content: [{
            type: "text",
            text: comments || "No comments found"
          }]
        };
      }
      case "create_issue_comment": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const issue_number = Number(args?.issue_number);
        const body = String(args?.body);
        if (!owner || !repo || !issue_number || !body) throw new Error("Owner, repo, issue_number, and body are required");
        const { data } = await octokit.issues.createComment({ owner, repo, issue_number, body });
        return {
          content: [{
            type: "text",
            text: `Created comment on issue #${issue_number}: ${data.html_url}`
          }]
        };
      }
      case "update_pull_request": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const pull_number = Number(args?.pull_number);
        if (!owner || !repo || !pull_number) throw new Error("Owner, repo, and pull_number are required");
        const updateData: any = {};
        if (args?.title) updateData.title = String(args.title);
        if (args?.body) updateData.body = String(args.body);
        if (args?.state) updateData.state = String(args.state);
        const { data } = await octokit.pulls.update({ owner, repo, pull_number, ...updateData });
        return {
          content: [{
            type: "text",
            text: `Updated pull request #${pull_number}: ${data.html_url}`
          }]
        };
      }
      case "merge_pull_request": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const pull_number = Number(args?.pull_number);
        if (!owner || !repo || !pull_number) throw new Error("Owner, repo, and pull_number are required");
        const params: any = { owner, repo, pull_number };
        if (args?.commit_title) params.commit_title = String(args.commit_title);
        if (args?.commit_message) params.commit_message = String(args.commit_message);
        if (args?.merge_method) params.merge_method = String(args.merge_method);
        const { data } = await octokit.pulls.merge(params);
        return {
          content: [{
            type: "text",
            text: `Merged pull request #${pull_number}: ${data.merged ? 'Success' : 'Failed'}`
          }]
        };
      }
      case "list_releases": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.repos.listReleases({ owner, repo });
        const releases = data.map(release => `${release.tag_name}: ${release.name || 'No name'}`).join('\n');
        return {
          content: [{
            type: "text",
            text: releases || "No releases found"
          }]
        };
      }
      case "create_release": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const tag_name = String(args?.tag_name);
        if (!owner || !repo || !tag_name) throw new Error("Owner, repo, and tag_name are required");
        const params: any = { owner, repo, tag_name };
        if (args?.target_commitish) params.target_commitish = String(args.target_commitish);
        if (args?.name) params.name = String(args.name);
        if (args?.body) params.body = String(args.body);
        if (args?.draft !== undefined) params.draft = Boolean(args.draft);
        if (args?.prerelease !== undefined) params.prerelease = Boolean(args.prerelease);
        const { data } = await octokit.repos.createRelease(params);
        return {
          content: [{
            type: "text",
            text: `Created release: ${data.html_url}`
          }]
        };
      }
      case "search_repositories": {
        const q = String(args?.q);
        if (!q) throw new Error("Query is required");
        const params: any = { q };
        if (args?.sort) params.sort = String(args.sort);
        if (args?.order) params.order = String(args.order);
        const { data } = await octokit.search.repos(params);
        const repos = data.items.slice(0, 10).map(repo => `${repo.full_name}: ${repo.description || 'No description'}`).join('\n');
        return {
          content: [{
            type: "text",
            text: repos || "No repositories found"
          }]
        };
      }
      case "search_issues": {
        const q = String(args?.q);
        if (!q) throw new Error("Query is required");
        const params: any = { q };
        if (args?.sort) params.sort = String(args.sort);
        if (args?.order) params.order = String(args.order);
        const { data } = await octokit.search.issuesAndPullRequests(params);
        const issues = data.items.slice(0, 10).map(issue => `${issue.repository_url.split('/').slice(-2).join('/')}${issue.pull_request ? ' (PR)' : ''} #${issue.number}: ${issue.title}`).join('\n');
        return {
          content: [{
            type: "text",
            text: issues || "No issues found"
          }]
        };
      }
      case "get_rate_limit": {
        const { data } = await octokit.rateLimit.get();
        return {
          content: [{
            type: "text",
            text: `Rate limit: ${data.rate.remaining}/${data.rate.limit} remaining`
          }]
        };
      }
      case "list_labels": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.issues.listLabelsForRepo({ owner, repo });
        const labels = data.map(label => `${label.name}: ${label.color}`).join('\n');
        return {
          content: [{
            type: "text",
            text: labels || "No labels found"
          }]
        };
      }
      case "create_label": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const name = String(args?.name);
        const color = String(args?.color);
        if (!owner || !repo || !name || !color) throw new Error("Owner, repo, name, and color are required");
        const params: any = { owner, repo, name, color };
        if (args?.description) params.description = String(args.description);
        const { data } = await octokit.issues.createLabel(params);
        return {
          content: [{
            type: "text",
            text: `Created label: ${data.name}`
          }]
        };
      }
      case "list_milestones": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.issues.listMilestones({ owner, repo });
        const milestones = data.map(milestone => `${milestone.number}: ${milestone.title} (${milestone.state})`).join('\n');
        return {
          content: [{
            type: "text",
            text: milestones || "No milestones found"
          }]
        };
      }
      case "create_milestone": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const title = String(args?.title);
        if (!owner || !repo || !title) throw new Error("Owner, repo, and title are required");
        const params: any = { owner, repo, title };
        if (args?.state) params.state = String(args.state);
        if (args?.description) params.description = String(args.description);
        if (args?.due_on) params.due_on = String(args.due_on);
        const { data } = await octokit.issues.createMilestone(params);
        return {
          content: [{
            type: "text",
            text: `Created milestone: ${data.html_url}`
          }]
        };
      }
      case "list_webhooks": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.repos.listWebhooks({ owner, repo });
        const webhooks = data.map(webhook => `${webhook.id}: ${webhook.url} (${webhook.events.join(', ')})`).join('\n');
        return {
          content: [{
            type: "text",
            text: webhooks || "No webhooks found"
          }]
        };
      }
      case "create_webhook": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const url = String(args?.url);
        const events = args?.events;
        if (!owner || !repo || !url || !events) throw new Error("Owner, repo, url, and events are required");
        const params: any = { owner, repo, config: { url }, events, active: true };
        if (args?.secret) params.config.secret = String(args.secret);
        const { data } = await octokit.repos.createWebhook(params);
        return {
          content: [{
            type: "text",
            text: `Created webhook: ${data.id}`
          }]
        };
      }
      case "star_repository": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        await octokit.activity.starRepoForAuthenticatedUser({ owner, repo });
        return {
          content: [{
            type: "text",
            text: `Starred repository ${owner}/${repo}`
          }]
        };
      }
      case "unstar_repository": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        await octokit.activity.unstarRepoForAuthenticatedUser({ owner, repo });
        return {
          content: [{
            type: "text",
            text: `Unstarred repository ${owner}/${repo}`
          }]
        };
      }
      case "list_notifications": {
        const params: any = {};
        if (args?.all !== undefined) params.all = Boolean(args.all);
        if (args?.participating !== undefined) params.participating = Boolean(args.participating);
        const { data } = await octokit.activity.listNotificationsForAuthenticatedUser(params);
        const notifications = data.slice(0, 10).map(notif => `${notif.id}: ${notif.subject.title} (${notif.reason})`).join('\n');
        return {
          content: [{
            type: "text",
            text: notifications || "No notifications found"
          }]
        };
      }
      case "mark_notifications_read": {
        const params: any = {};
        if (args?.last_read_at) params.last_read_at = String(args.last_read_at);
        await octokit.activity.markNotificationsAsRead(params);
        return {
          content: [{
            type: "text",
            text: "Marked notifications as read"
          }]
        };
      }
      case "list_pull_request_reviews": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const pull_number = Number(args?.pull_number);
        if (!owner || !repo || !pull_number) throw new Error("Owner, repo, and pull_number are required");
        const { data } = await octokit.pulls.listReviews({ owner, repo, pull_number });
        const reviews = data.map(review => `${review.user?.login}: ${review.state} - ${review.body?.substring(0, 100) || 'No comment'}`).join('\n---\n');
        return {
          content: [{
            type: "text",
            text: reviews || "No reviews found"
          }]
        };
      }
      case "create_pull_request_review": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const pull_number = Number(args?.pull_number);
        if (!owner || !repo || !pull_number) throw new Error("Owner, repo, and pull_number are required");
        const params: any = { owner, repo, pull_number };
        if (args?.event) params.event = String(args.event);
        if (args?.body) params.body = String(args.body);
        const { data } = await octokit.pulls.createReview(params);
        return {
          content: [{
            type: "text",
            text: `Created review on PR #${pull_number}: ${data.html_url}`
          }]
        };
      }
      case "list_repository_contents": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const params: any = { owner, repo };
        if (args?.path) params.path = String(args.path);
        if (args?.ref) params.ref = String(args.ref);
        const { data } = await octokit.repos.getContent(params);
        const contents = Array.isArray(data) ? data.map(item => `${item.type}: ${item.name}`).join('\n') : `${data.type}: ${data.name}`;
        return {
          content: [{
            type: "text",
            text: contents
          }]
        };
      }
      case "get_repository_content": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        const path = String(args?.path);
        if (!owner || !repo || !path) throw new Error("Owner, repo, and path are required");
        const params: any = { owner, repo, path };
        if (args?.ref) params.ref = String(args.ref);
        const { data } = await octokit.repos.getContent(params);
        const content = Buffer.isBuffer(data) ? data.toString() : typeof data === 'object' && 'content' in data ? Buffer.from(data.content, 'base64').toString() : JSON.stringify(data);
        return {
          content: [{
            type: "text",
            text: content
          }]
        };
      }
      case "list_workflows": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.actions.listRepoWorkflows({ owner, repo });
        const workflows = data.workflows.map(workflow => `${workflow.id}: ${workflow.name} (${workflow.state})`).join('\n');
        return {
          content: [{
            type: "text",
            text: workflows || "No workflows found"
          }]
        };
      }
      case "list_workflow_runs": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const params: any = { owner, repo };
        if (args?.workflow_id) params.workflow_id = String(args.workflow_id);
        const { data } = await octokit.actions.listWorkflowRunsForRepo(params);
        const runs = data.workflow_runs.slice(0, 10).map(run => `${run.id}: ${run.name} (${run.status}/${run.conclusion})`).join('\n');
        return {
          content: [{
            type: "text",
            text: runs || "No workflow runs found"
          }]
        };
      }
      case "get_repository_languages": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.repos.listLanguages({ owner, repo });
        const languages = Object.entries(data).map(([lang, bytes]) => `${lang}: ${bytes} bytes`).join('\n');
        return {
          content: [{
            type: "text",
            text: languages || "No language data found"
          }]
        };
      }
      case "get_repository_contributors": {
        const owner = String(args?.owner);
        const repo = String(args?.repo);
        if (!owner || !repo) throw new Error("Owner and repo are required");
        const { data } = await octokit.repos.listContributors({ owner, repo });
        const contributors = data.map(contrib => `${contrib.login}: ${contrib.contributions} contributions`).join('\n');
        return {
          content: [{
            type: "text",
            text: contributors || "No contributors found"
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
