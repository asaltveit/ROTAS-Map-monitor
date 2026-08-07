/** @type {import('@lhci/cli').LighthouseCiConfig} */
module.exports = {
  ci: {
    collect: {
      url: [
        `${process.env.LIGHTHOUSE_BASE_URL ?? 'http://127.0.0.1:3000'}/login`,
        `${process.env.LIGHTHOUSE_BASE_URL ?? 'http://127.0.0.1:3000'}/reset-password/send_email`,
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports',
    },
  },
}
