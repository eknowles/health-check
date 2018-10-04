export const CHECK_NAMES = {
  LANG_JS: 'Language Files'
};

export const EVENT = {
  STATUS: 'status',
  PR: {
    OPENED: 'pull_request.opened',
    REOPENED: 'pull_request.reopened',
  },
  CHECK_SUITE: {
    REQUESTED: 'check_suite.requested',
    REREQUESTED: 'check_suite.rerequested'
  },
  CHECK_RUN: {
    REQUESTED: 'check_run.requested',
    REREQUESTED: 'check_run.rerequested'
  }
};

export const CHECK_STATUS = {
  QUEUED: 'queued',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const CHECK_CONCLUSION = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  NEUTRAL: 'neutral',
  CANCELLED: 'cancelled',
  TIMED_OUT: 'timed_out',
  ACTION_REQUIRED: 'action_required',
  DETAILS_URL: 'details_url',
  CONCLUSION: 'conclusion',
  STATUS: 'status',
  COMPLETE: 'complete',
};

export const URLS = {
  ICU_FORMAT: 'https://formatjs.io/guides/message-syntax/',
  PHRASE_APP_FORMAT: 'https://phraseapp.com/docs/guides/formats/simple-json/',
};
