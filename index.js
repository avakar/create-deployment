const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function main() {
  const ref = core.getInput('ref') || context.sha;
  const task = core.getInput('task', { required: true });
  const auto_merge = core.getInput('auto_merge') === 'true';
  const environment = core.getInput('environment', { required: true });
  const description = core.getInput('description');
  const transient_environment = core.getInput('transient_environment') === 'true';

  const default_production_environment = (environment === 'production').toString();
  const production_environment = (core.getInput('production_environment') || default_production_environment) === 'true';

  const { owner, repo } = context.repo;
  const req = {
    owner,
    repo,
    ref,
    task,
    auto_merge,
    environment,
    description,
    production_environment,
    transient_environment,
  };

  const payload = core.getInput('payload');
  if (payload) {
    req['payload'] = JSON.parse(payload);
  }

  const required_contexts = core.getInput('required_contexts');
  if (required_contexts !== '*') {
    if (required_contexts === '') {
      req['required_contexts'] = [];
    } else {
      req['required_contexts'] = required_contexts.split(',');
    }
  }

  const github = new GitHub(
    process.env.GITHUB_TOKEN,
    { previews: ["ant-man-preview", "flash-preview"]});

  core.debug(JSON.stringify(req));
  const resp = await github.repos.createDeployment(req);
  core.debug(JSON.stringify(resp));

  if (resp.status >= 400) {
    throw new Error("Failed to create a new deployment");
  }

  core.setOutput('deployment_id', resp.data.id.toString());
  core.setOutput('deployment_url', resp.data.url);
  core.setOutput('statuses_url', resp.data.statuses_url);
}

main().catch(function(error) {
  core.setFailed(error.message);
});
