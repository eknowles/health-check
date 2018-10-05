import {Context} from 'probot';

// add custom CI status event context here
const TRIGGER_CONTEXTS = [
    'test-context', // use this context when testing in dev
    'continuous-integration/jenkins/branch'
];

/**
 * This handles the status event.
 * this method will listen for a status update on a master branch and add a commit status to any open pull requests
 */
export default async (context: Context): Promise<void> => {
    const {payload: {state, target_url, commit: {commit: {author}}, repository: {name: repo, owner: {login: owner}, default_branch: base}}} = context; // dat deconstruct tho
    const masterBranchUrl = `/job/${repo}/job/${encodeURI(base)}/`;

    if (!target_url.includes(masterBranchUrl) && !TRIGGER_CONTEXTS.includes(context.payload.context)) return;

    const createdAt = new Date(context.payload.created_at).toLocaleTimeString();
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

    const blockedMessage = `${author.name} @ ${createdAt} started building ${base} branch`;
    const unblockedMessage = `${base} branch is free`;

    const statusParams = {
        repo,
        owner,
        state,
        target_url,
        context: 'build-master',
        description: state === 'pending' ? blockedMessage : unblockedMessage,
    };

    // Update the status of each PR to match the master branch status
    Promise
        .all(prs.map((sha) => context.github.repos.createStatus({...statusParams, sha})))
        .then(() => {
            context.log.info(`[STATUS] updated ${prs.length} pull request(s) with the message '${base} branch status set to ${state}'`);
        });
}
