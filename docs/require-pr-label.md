# Require PR Label Workflow Documentation

## Overview
This GitHub Actions workflow automatically validates that pull requests have at least one label and closes them with a helpful comment if they don't.

## Complete Workflow Code
```yaml
name: Require Any PR Label
on:
  pull_request:
    types: [opened, edited, labeled, unlabeled, synchronize, reopened]

jobs:
  check-labels:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write   # to close PRs
      issues: write          # to comment
    steps:
      - name: Validate labels
        id: validate
        uses: actions/github-script@v7
        with:
          script: |
            const prNumber = context.payload.pull_request.number;
            const { data: pr } = await github.rest.pulls.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: prNumber
            });
            const count = pr.labels.length;
            if (count === 0) {
              core.setFailed("PR must include at least one label.");
            }

      - name: Comment & close when invalid
        if: failure()   # runs only when previous step failed
        uses: actions/github-script@v7
        with:
          script: |
            const prNumber = context.payload.pull_request.number;
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: prNumber,
              body: "Closing: please add at least one label (e.g., NEW FEATURE, BUG FIX, DOCS) and reopen."
            });
            await github.rest.pulls.update({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: prNumber,
              state: "closed"
            });
```

## Line-by-Line Explanation

### **Line 1: Workflow Name**
```yaml
name: Require Any PR Label
```
- **Purpose**: Sets the display name for the workflow in GitHub Actions UI
- **Documentation**: [Workflow syntax - name](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#name)
- **Options**: Any string value
- **Best Practice**: Use descriptive names that clearly indicate the workflow's purpose

### **Line 2: Trigger Declaration**
```yaml
on:
```
- **Purpose**: Defines when the workflow should run
- **Documentation**: [Workflow syntax - on](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#on)
- **Required**: Yes, every workflow must have this

### **Line 3: Event Type**
```yaml
  pull_request:
```
- **Purpose**: Specifies that this workflow triggers on pull request events
- **Documentation**: [Events that trigger workflows - pull_request](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request)
- **Alternative Events**:
  - `push`: When code is pushed to a branch
  - `issues`: When issues are created, edited, or closed
  - `release`: When releases are published
  - `workflow_dispatch`: Manual trigger
  - `schedule`: Cron-based scheduling
  - `repository_dispatch`: API-triggered events

### **Line 4: Event Types**
```yaml
    types: [opened, edited, labeled, unlabeled, synchronize, reopened]
```
- **Purpose**: Specifies which pull request events trigger the workflow
- **Documentation**: [Events that trigger workflows - pull_request](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request)
- **Available Types**:
  - `opened`: New pull request created
  - `edited`: Pull request title or body modified
  - `labeled`: Label added to pull request
  - `unlabeled`: Label removed from pull request
  - `synchronize`: New commits pushed to pull request branch
  - `reopened`: Pull request reopened after being closed
  - `closed`: Pull request closed (merged or closed without merging)
  - `assigned`: Pull request assigned to someone
  - `unassigned`: Pull request unassigned
  - `review_requested`: Review requested for pull request
  - `review_request_removed`: Review request removed
  - `ready_for_review`: Pull request marked as ready for review
  - `converted_to_draft`: Pull request converted to draft
  - `locked`: Pull request locked
  - `unlocked`: Pull request unlocked

### **Line 6: Jobs Container**
```yaml
jobs:
```
- **Purpose**: Container for all workflow jobs
- **Documentation**: [Workflow syntax - jobs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobs)
- **Required**: Yes, every workflow must have at least one job

### **Line 7: Job Definition**
```yaml
  check-labels:
```
- **Purpose**: Defines a job with a unique identifier
- **Documentation**: [Workflow syntax - jobs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobs)
- **Naming**: Use descriptive names with hyphens or underscores
- **Scope**: Must be unique within the workflow

### **Line 8: Runner Environment**
```yaml
    runs-on: ubuntu-latest
```
- **Purpose**: Specifies the runner environment for the job
- **Documentation**: [Workflow syntax - runs-on](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idruns-on)
- **Available Options**:
  - `ubuntu-latest` (or `ubuntu-22.04`)
  - `ubuntu-20.04`
  - `ubuntu-18.04`
  - `windows-latest` (or `windows-2022`)
  - `windows-2019`
  - `macos-latest` (or `macos-13`)
  - `macos-12`
  - `macos-11`
  - Self-hosted runners: `self-hosted`

### **Line 9: Permissions Declaration**
```yaml
    permissions:
```
- **Purpose**: Defines GitHub token permissions for the job
- **Documentation**: [Workflow syntax - permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- **Default**: If not specified, uses repository default permissions
- **Available Permission Levels**: `read`, `write`, `none`

### **Line 10: Pull Request Permissions**
```yaml
      pull-requests: write   # to close PRs
```
- **Purpose**: Grants write permission to pull requests
- **Documentation**: [Workflow syntax - permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- **Available Scopes**:
  - `actions`: Workflow files and logs
  - `checks`: Check runs and check suites
  - `contents`: Repository contents
  - `deployments`: Deployments
  - `discussions`: Discussions
  - `id-token`: ID tokens for OIDC
  - `issues`: Issues and comments
  - `packages`: Packages
  - `pages`: GitHub Pages
  - `pull-requests`: Pull requests and comments
  - `repository-projects`: Repository projects
  - `security-events`: Security events
  - `statuses`: Commit statuses

### **Line 11: Issues Permissions**
```yaml
      issues: write          # to comment
```
- **Purpose**: Grants write permission to issues (PRs are also issues)
- **Documentation**: [Workflow syntax - permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- **Needed For**: Creating comments on pull requests

### **Line 13: Steps Container**
```yaml
    steps:
```
- **Purpose**: Container for job steps
- **Documentation**: [Workflow syntax - steps](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idsteps)
- **Required**: Yes, every job must have at least one step

### **Line 14: Step Name**
```yaml
      - name: Validate labels
```
- **Purpose**: Human-readable name for the step
- **Documentation**: [Workflow syntax - steps](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idsteps)
- **Best Practice**: Use descriptive names that explain what the step does

### **Line 15: Step ID**
```yaml
        id: validate
```
- **Purpose**: Unique identifier for referencing this step
- **Documentation**: [Workflow syntax - steps](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idsteps)
- **Usage**: Can be referenced in conditions like `if: steps.validate.outputs.result == 'success'`

### **Line 16: Action Usage**
```yaml
        uses: actions/github-script@v7
```
- **Purpose**: Specifies which action to use
- **Documentation**: 
  - [Workflow syntax - uses](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses)
  - [GitHub Script Action](https://github.com/actions/github-script)
- **Format**: `{owner}/{repo}@{ref}` or `{owner}/{repo}/{path}@{ref}`
- **Version**: `v7` is the latest stable version

### **Line 17: Action Parameters**
```yaml
        with:
```
- **Purpose**: Defines parameters passed to the action
- **Documentation**: [Workflow syntax - with](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepswith)
- **Required**: Only if the action accepts parameters

### **Line 18: Script Parameter**
```yaml
          script: |
```
- **Purpose**: Defines the JavaScript code to execute
- **Documentation**: [GitHub Script Action](https://github.com/actions/github-script)
- **Syntax**: Multi-line YAML string with `|` for literal block scalar

### **Line 19: Get PR Number**
```javascript
            const prNumber = context.payload.pull_request.number;
```
- **Purpose**: Extracts the pull request number from the event context
- **Documentation**: [Context and expression syntax - github context](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context)
- **Context Object**: `context.payload` contains the webhook payload that triggered the workflow

### **Line 20-24: Fetch PR Details**
```javascript
            const { data: pr } = await github.rest.pulls.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: prNumber
            });
```
- **Purpose**: Fetches detailed information about the pull request
- **Documentation**: [GitHub REST API - Get a pull request](https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request)
- **Parameters**:
  - `owner`: Repository owner (from context)
  - `repo`: Repository name (from context)
  - `pull_number`: The PR number

### **Line 25: Count Labels**
```javascript
            const count = pr.labels.length;
```
- **Purpose**: Counts the number of labels on the pull request
- **Data Structure**: `pr.labels` is an array of label objects

### **Line 26-28: Validation Logic**
```javascript
            if (count === 0) {
              core.setFailed("PR must include at least one label.");
            }
```
- **Purpose**: Fails the step if no labels are found
- **Documentation**: [GitHub Script Action - core module](https://github.com/actions/github-script#core-module)
- **`core.setFailed()`**: Marks the step as failed with a custom message

### **Line 30: Second Step Name**
```yaml
      - name: Comment & close when invalid
```
- **Purpose**: Name for the second step
- **Behavior**: Only runs when the first step fails

### **Line 31: Conditional Execution**
```yaml
        if: failure()   # runs only when previous step failed
```
- **Purpose**: Conditional execution based on previous step status
- **Documentation**: [Workflow syntax - if](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsif)
- **Available Conditions**:
  - `failure()`: Previous step failed
  - `success()`: Previous step succeeded
  - `always()`: Always run regardless of previous step status
  - `cancelled()`: Previous step was cancelled

### **Line 32: Action Usage (Second Step)**
```yaml
        uses: actions/github-script@v7
```
- **Purpose**: Same GitHub Script action for the second step

### **Line 33: Action Parameters (Second Step)**
```yaml
        with:
```
- **Purpose**: Parameters for the second step

### **Line 34: Script Parameter (Second Step)**
```yaml
          script: |
```
- **Purpose**: JavaScript code for the second step

### **Line 35: Get PR Number (Second Step)**
```javascript
            const prNumber = context.payload.pull_request.number;
```
- **Purpose**: Same as line 19, gets PR number

### **Line 36-41: Create Comment**
```javascript
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: prNumber,
              body: "Closing: please add at least one label (e.g., NEW FEATURE, BUG FIX, DOCS) and reopen."
            });
```
- **Purpose**: Creates a comment on the pull request
- **Documentation**: [GitHub REST API - Create an issue comment](https://docs.github.com/en/rest/issues/comments#create-an-issue-comment)
- **Parameters**:
  - `owner`: Repository owner
  - `repo`: Repository name
  - `issue_number`: PR number (PRs are also issues)
  - `body`: Comment text

### **Line 42-47: Close PR**
```javascript
            await github.rest.pulls.update({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: prNumber,
              state: "closed"
            });
```
- **Purpose**: Closes the pull request
- **Documentation**: [GitHub REST API - Update a pull request](https://docs.github.com/en/rest/pulls/pulls#update-a-pull-request)
- **Parameters**:
  - `owner`: Repository owner
  - `repo`: Repository name
  - `pull_number`: PR number
  - `state`: Set to "closed"

## Additional Configuration Options

### **Branch Filtering**
```yaml
on:
  pull_request:
    branches:
      - main
      - develop
    types: [opened, edited, labeled, unlabeled, synchronize, reopened]
```

### **Path Filtering**
```yaml
on:
  pull_request:
    paths:
      - 'src/**'
      - 'package.json'
    paths-ignore:
      - 'docs/**'
      - '*.md'
```

### **Environment Variables**
```yaml
jobs:
  check-labels:
    runs-on: ubuntu-latest
    env:
      REQUIRED_LABELS: "bug,feature,documentation"
    steps:
      # ... steps
```

### **Timeout Configuration**
```yaml
jobs:
  check-labels:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      # ... steps
```

### **Concurrency Control**
```yaml
jobs:
  check-labels:
    runs-on: ubuntu-latest
    concurrency:
      group: pr-labels-${{ github.head_ref }}
      cancel-in-progress: true
    steps:
      # ... steps
```

## Related Documentation Links

### **GitHub Actions Core**
- [Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- [Context and expression syntax](https://docs.github.com/en/actions/learn-github-actions/contexts)
- [Using conditions](https://docs.github.com/en/actions/using-jobs/using-conditions)

### **GitHub REST API**
- [GitHub REST API Overview](https://docs.github.com/en/rest)
- [Pulls API](https://docs.github.com/en/rest/pulls)
- [Issues API](https://docs.github.com/en/rest/issues)
- [Repositories API](https://docs.github.com/en/rest/repos)

### **Actions**
- [GitHub Script Action](https://github.com/actions/github-script)
- [Actions Marketplace](https://github.com/marketplace?type=actions)

### **Security**
- [Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Permissions for the GITHUB_TOKEN](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)
