import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { load } from 'js-yaml';
import { describe, expect, it } from 'vitest';

type WorkflowStep = { name?: string; with?: { script?: string } };
type WorkflowJob = { needs?: string[]; steps?: WorkflowStep[] };
type Workflow = { jobs: Record<string, WorkflowJob> };

const workflowPath = resolve(
  process.cwd(),
  '../../.github/workflows/ci-cd.yml',
);
const workflow = load(readFileSync(workflowPath, 'utf-8')) as Workflow;

// Fails on a missing job rather than returning undefined, so that "job removed"
// stays distinguishable from "job declaring no needs".
const job = (jobName: string): WorkflowJob => {
  const found = workflow.jobs[jobName];

  if (!found) {
    throw new Error(`job "${jobName}" is missing from ci-cd.yml`);
  }

  return found;
};

const stepScript = (jobName: string, stepName: string): string => {
  const step = job(jobName).steps?.find((s) => s.name === stepName);

  return step?.with?.script ?? '';
};

const verifyScript = stepScript('deploy', 'Verify deployment');
const rollbackScript = stepScript('deploy', 'Rollback on failure');

describe('ci-cd.yml workflow', () => {
  it('is valid YAML exposing the expected jobs', () => {
    expect(Object.keys(workflow.jobs)).toEqual([
      'quality',
      'lighthouse-budget',
      'build',
      'deploy',
      'lighthouse',
    ]);
  });

  it('keeps the job dependency topology unchanged', () => {
    expect(job('quality').needs).toBeUndefined();
    expect(job('lighthouse-budget').needs).toBeUndefined();
    expect(job('build').needs).toEqual(['quality', 'lighthouse-budget']);
    expect(job('deploy').needs).toEqual([
      'quality',
      'lighthouse-budget',
      'build',
    ]);
    expect(job('lighthouse').needs).toEqual(['deploy']);
  });
});

describe('deployment verification covers every stack service', () => {
  it('declares a verification step with a script', () => {
    expect(verifyScript).not.toBe('');
  });

  // A styleguide service stuck at 0/1 kept the pipeline green for hours
  // because the check only ever looked at ${APP_NAME}_app.
  it('discovers services dynamically instead of hardcoding _app', () => {
    expect(verifyScript).toContain('docker stack services');
    expect(verifyScript).not.toContain('${APP_NAME}_app');
  });

  it('fails the step when a service never converges', () => {
    expect(verifyScript).toContain('exit 1');
  });

  it('still requires the update itself to be complete', () => {
    expect(verifyScript).toContain('UpdateStatus');
  });

  it('reports the failing service name and its diagnostics', () => {
    expect(verifyScript).toContain('docker service ps --no-trunc');
    expect(verifyScript).toContain('docker service logs');
  });
});

describe('rollback covers every failing service', () => {
  it('declares a rollback step with a script', () => {
    expect(rollbackScript).not.toBe('');
  });

  it('rolls back discovered services instead of _app only', () => {
    expect(rollbackScript).toContain('docker service rollback');
    expect(rollbackScript).not.toContain('${APP_NAME}_app');
  });
});
