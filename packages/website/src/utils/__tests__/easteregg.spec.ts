import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => `translated:${key}`,
  }),
}));

const { logDecoration } = await import('../easteregg');

describe('logDecoration', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('calls console.log', () => {
    logDecoration();

    expect(console.log).toHaveBeenCalledOnce();
  });

  it('includes GitHub URL in message', () => {
    logDecoration();

    const message = vi.mocked(console.log).mock.calls[0][2] as string;

    expect(message).toContain('github.com/AnTSaSk');
  });

  it('includes LinkedIn URL in message', () => {
    logDecoration();

    const message = vi.mocked(console.log).mock.calls[0][2] as string;

    expect(message).toContain('linkedin.com/in/alexis-besson-web');
  });

  it('includes translated easter egg message', () => {
    logDecoration();

    const message = vi.mocked(console.log).mock.calls[0][2] as string;

    expect(message).toContain('translated:easteregg.log.message');
  });
});
