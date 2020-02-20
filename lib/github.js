const CLI = require( 'clui' )
const Configstore = require( 'configstore' )
const { Octokit } = require( '@octokit/rest' )
const Spinner = CLI.Spinner
const { createBasicAuth } = require( '@octokit/auth-basic' )

const inquirer = require( './inquirer' )
const pkg = require( '../package.json' )

const conf = new Configstore( pkg.name )

let octokit

module.exports = {
  getInstance: () => {
    return octokit
  },

  getStoredGithubToken: () => {
    return conf.get( 'github.token' )
  },

  githubAuth: token => {
    octokit = new Octokit( {
      auth: token,
    } )
  },

  getPersonalAccessToken: async() => {

    // NOTE
    const credentials = await inquirer.askGithubCredentials() // prompt user for auth
    const status = new Spinner( 'Authenticating...' )

    status.start()

    const auth = createBasicAuth( {
      username: credentials.username,
      password: credentials.password,
      async on2Fa() {

        // two factor auth
        status.stop() // puse spinner
        const res = await inquirer.getTwoFactorAuthenticationCode() // call for method and await response
        status.start() // resume spinner
        return res.twoFactorAuthentificationCode
      },
      token: {
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'sinit, the command-line tool for initalizing Git repos',
      },
    } )

    try {
      const res = await auth()

      if ( res.token ) {
        conf.set( 'github.token', res.token )
        return res.token
      } else {
        throw new Error( 'Github token was not found in the response' )
      }
    } finally {
      status.stop()
    }
  },
}
