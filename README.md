# GitHub Action &ndash; Create a GitHub deployment

Creates a new [GitHub deployment][1].

  [1]: https://developer.github.com/v3/repos/deployments/

## Usage

Add the action to your workflow file.

    on: push
    jobs:
      release:
        steps:
          - uses: avakar/create-deployment@v1
            with:
              auto_merge: false
            env:
              GITHUB_TOKEN: ${{ secrets.DEPLOY_TOKEN }}

The above snippet will create a new deployment with task "deploy"
to environment "production". It will not attempt to merge your default
branch first.

Note that creating a deployment will emit the "deployment" event,
but workflows that trigger on it will not run if you use
`secrets.GITHUB_TOKEN`. Instead, create your own security token.

Use [avakar/set-deployment-status][2] action in your deploy workflow.

  [2]: https://github.com/avakar/set-deployment-status

### Inputs

The inputs are exactly the parameters of the [Create Deployment][3] REST
request. Both "ant-man" and "flash" API previews are enabled.

To summarize, these are the parameters and their defaults.

* `ref`: if left empty, defaults to the current branch
* `task`: defaults to "deploy"
* `auto_merge`: defaults to "true"
* `required_contexts`: defaults to all contexts; use `*` to say
  that explicitly
* `payload`: defaults to empty; if non-empty, must be a valid JSON string
* `environment`: defaults to "production"
* `description`: defaults to empty
* `production_environment`: defaults to true for production environment,
  otherwise false
* `transient_environment`: defaults to false
* `owner`: defaults to the current repository's owner
* `repo`: defaults to the current repository

  [3]: https://developer.github.com/v3/repos/deployments/#create-a-deployment

### Outputs

* `deployment_id`: the identifier of the newly created deployment
* `deployment_url`: the REST API url representing the new deployment
* `statuses_url`: the REST API url representing the deployment's list of statuses
