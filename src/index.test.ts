import { describe, expect, it } from 'vitest';
import { PACKAGE_NAME } from './index.js';

describe('index', () => {
  it('exports the package name', () => {
    expect(PACKAGE_NAME).toBe('@harborclient/team-hub-api');
  });
});
