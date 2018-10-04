import {Context} from 'probot';

const JENKINS_URL = 'https://jenkins.spinnaker.cicd.clearscore.io';

/**
 * This handles the status event.
 * this method will listen for a status update on a master branch and add a commit status to any open pull requests
 */
export default async (context: Context): Promise<void> => {
    const {payload: {state, target_url, commit: {commit: {author}}, repository: {name: repo, owner: {login: owner}, default_branch: base}}} = context; // dat deconstruct tho
    const masterBranchUrl = `${JENKINS_URL}/job/${repo}/job/${encodeURI(base)}/`;

    if (!target_url.includes(masterBranchUrl)) return;

    const getAllParams = {
        repo,
        owner,
        base,
        state: 'open' as any,
        sort: 'updated' as any,
    };

    // Get the head sha of each open PR into the repos default_branch
    const prs = await context.github.pullRequests.getAll(getAllParams)
        .then((res) => res.data.map((pullRequest) => pullRequest.head.sha));

    const blockedMessage = `${base} branch is being built by ${author.name}`;
    const unblockedMessage = `${base} branch is free`;

    const statusParams = {
        repo,
        owner,
        state,
        target_url,
        context: 'building-default-branch',
        description: state === 'pending' ? blockedMessage : unblockedMessage,
    };

    // Update the status of each PR to match the master branch status
    Promise
        .all(prs.map((sha) => context.github.repos.createStatus({...statusParams, sha})))
        .then(() => {
            context.log.info(`Master branch status set to ${state}`);
        });
}
