const ALLOWED_TYPES = ['feat', 'fix', 'perf', 'refactor', 'docs', 'ci', 'test'];
const ALLOWED_SCOPES = new Set(['frontend', 'backend', 'script']);

module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'repo-scope-enum': ({ scope }) => {
          if (!scope) {
            return [true];
          }

          const scopeParts = scope
            .split('+')
            .map((part) => part.trim())
            .filter(Boolean);
          if (scopeParts.length === 0) {
            return [true];
          }

          const invalidScopes = scopeParts.filter((part) => !ALLOWED_SCOPES.has(part));
          if (invalidScopes.length > 0) {
            return [
              false,
              `scope must be one of ${Array.from(ALLOWED_SCOPES).join(', ')} or a + combination of them. Invalid scopes: ${invalidScopes.join(', ')}`,
            ];
          }

          return [true];
        },
      },
    },
  ],
  rules: {
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'type-enum': [2, 'always', ALLOWED_TYPES],
    'scope-empty': [0],
    'scope-enum': [0],
    'repo-scope-enum': [2, 'always'],
    'subject-empty': [2, 'never'],
  },
};
