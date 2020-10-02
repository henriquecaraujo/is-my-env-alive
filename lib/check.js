
import chalk from 'chalk'
import fs from 'fs-extra'
import Spinnies from 'spinnies'
import callChain from './callChain';

const spinnies = new Spinnies();


const _checkResponse = ({ response, options }) => {
  if (response.status) {
    return response.status === options.status;
  }

  return false;
}

const _getProjects = async ({ file, env }) => {
  const fileExists = await fs.pathExists(file);

  if (!fileExists) throw 'INVALID_JSON';

  const allProjects = await fs.readJson(file);

  const projects =  allProjects[env];

  if (!projects) throw 'INVALID_ENV';

  return projects;
}

const _catchGlobalError = ({ file, error }) => {
  spinnies.fail('global');

  console.log(chalk.yellow('Wrong JSON format!'));
  console.log(chalk.yellow(`Check the ${file} file`));
  console.log(chalk.gray(`\nRaw error:`));
  console.log(error)
}

const check = async ({ env, file }) => {
  spinnies.add('global', { text: 'Buscando APIs... \n', color: 'gray', succeedColor: 'gray' });

  let projects;

  try {
    projects = await _getProjects({ file, env })
  } catch (error) {
    return _catchGlobalError({ file, error })
  }

  const callChain = callChain(projects)

  for await (const call of callChain) {
    const { name, options, response } = call;

    const isUp = _checkResponse({ response, options });

    if (isUp) {
      spinnies.succeed(name, { text: `${name} [${response.status}]` });
      continue;
    }

    spinnies.fail(name, { text: `${name} [${response.status}]` });
  }

  spinnies.succeed('global');
}

export default check;
