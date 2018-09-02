export const CHECK_NAMES = {
  LANG_JS: 'Language Files'
};

export const EVENT = {
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
