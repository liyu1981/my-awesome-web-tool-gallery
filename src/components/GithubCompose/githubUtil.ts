import { Octokit } from '@octokit/core';

const GITHUB_API_URL = 'https://api.github.com';

interface ScopeValidation {
  included?: string[];
  excluded?: string[];
  exact?: string[];
}

export class ValidationError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ValidationError';
  }
}

function validateScopes(
  headers: Headers,
  validation: ScopeValidation | undefined,
): string[] {
  const header = headers.get('X-OAuth-Scopes');
  if (header === null) {
    throw new Error(
      `Response headers don't include X-OAuth-Scopes: ${JSON.stringify(
        headers,
      )}`,
    );
  }
  const scopes = header
    .split(',')
    .map(s => s.trim())
    .filter(s => !!s);

  if (validation) {
    if (validation.included) {
      for (const scope of validation.included) {
        if (!scopes.includes(scope)) {
          throw new ValidationError(
            `Scope '${scope}' should be included in token scopes: ${header}`,
          );
        }
      }
    }
    if (validation.excluded) {
      for (const scope of validation.excluded) {
        if (scopes.includes(scope)) {
          throw new ValidationError(
            `Scope '${scope}' should not be included in token scopes: ${header}`,
          );
        }
      }
    }
    if (validation.exact) {
      const want = validation.exact;
      if (
        want.some(s => !scopes.includes(s)) ||
        scopes.some(s => !want.includes(s))
      ) {
        const got = JSON.stringify(scopes);
        const expected = JSON.stringify(want);
        throw new ValidationError(
          `The token's scopes ${got} don't exactly match to the expected scopes ${expected}`,
        );
      }
    }
  }

  return scopes;
}

function formatOctokitRequestRoute(
  route: string,
  parameters: { [k: string]: string },
): string {
  return route.replace(/\{([^\{\}]+)\}/g, substr => {
    const attrName = substr.substring(1, substr.length - 1);
    if (parameters[attrName]) {
      return `${parameters[attrName]}`;
    } else {
      return substr;
    }
  });
}

function expectSomething(
  func: () => void | Promise<void>,
  otherwiseOk?: () => any,
  otherwiseException?: () => any,
) {
  try {
    const ret = func();
    if (ret && ret['then']) {
      ret
        .then(() => {
          otherwiseOk && otherwiseOk();
        })
        .catch(() => {
          otherwiseException && otherwiseException();
        });
    } else {
      otherwiseOk && otherwiseOk();
    }
  } catch (err) {
    otherwiseException && otherwiseException();
  }
}

function expectNoException(
  func: () => void | Promise<void>,
  otherwise: () => void,
) {
  expectSomething(func, undefined, otherwise);
}

function expectException(
  func: () => void | Promise<void>,
  otherwise: () => void,
) {
  expectSomething(func, otherwise, undefined);
}

export async function validateGithubPersonalToken(token: string) {
  const response = await fetch(GITHUB_API_URL, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  validateScopes(response.headers, { included: ['repo'] });
}

export async function validateGithubRepo(
  token: string,
  repo: string,
): Promise<boolean> {
  const octokit = new Octokit({ auth: token });
  try {
    const r1 = await octokit.request(`GET /user`);
    console.log('get /user returns:', r1);
    const owner = r1.data.login;
    if (owner) {
      await octokit.request(
        formatOctokitRequestRoute('GET /repos/{owner}/{repo}/contents/{path}', {
          path: 'src/toolsData',
        }),
        {
          owner,
          repo,
        },
      );
      return true;
    }
  } catch (err) {
    return false;
  }
  return false;
}

export async function submitGithubFile(
  token: string,
  repo: string,
  filePath: string,
  fileContent: string,
) {
  console.log('submit to github', filePath, fileContent);
  const octokit = new Octokit({ auth: token });

  let owner = '';
  try {
    const r1 = await octokit.request(`GET /user`);
    console.log('get /user returns:', r1);
    owner = r1.data.login;
    if (owner) {
    }
  } catch (err) {
    throw new Error('can not get user associated with personal token.');
  }

  let exist = false;
  try {
    const r2 = await octokit.request(
      formatOctokitRequestRoute('GET /repos/{owner}/{repo}/contents/{path}', {
        path: filePath,
      }),
      {
        owner,
        repo,
      },
    );
    console.log('get returns:', r2);
    // oops, file exists
    exist = true;
  } catch (err) {
    // if not get is fine to us
    exist = false;
  }

  if (exist) {
    throw new Error(`${filePath} already exists!`);
  } else {
    try {
      console.log('will call PUT /repos/{owner}/{repo}/contents/{path} with', {
        owner,
        repo,
        path: filePath,
        message: `Add ${filePath}`,
        content: fileContent,
      });
      const r3 = await octokit.request(
        formatOctokitRequestRoute('PUT /repos/{owner}/{repo}/contents/{path}', {
          path: filePath,
        }),
        {
          owner,
          repo,
          message: `Add ${filePath}`,
          content: window.btoa(fileContent),
        },
      );
      return r3.data.commit.html_url;
    } catch (err: any) {
      throw new Error(`creating ${filePath} failed: ${err.message}`);
    }
  }
}
