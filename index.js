#!/usr/bin/env node
const chalk = require( 'chalk' )
const figlet = require( 'figlet' )

const files = require( './lib/files' )
const github = require( './lib/github' )
const repo = require( './lib/repo' )

console.log( chalk.blue( figlet.textSync( 'Sinit', { horizontalLayout: 'full' } ) ) )

if ( files.directoryExists( '.git' ) ) {
  throw new Error( chalk.red( 'Already a Git repository!' ) )
}

const getGithubToken = async() => {

  // Fetch token from config store
  let token = github.getStoredGithubToken()
  if ( token ) {
    return token
  }

  // No token found, use credentials to access Github account
  token = await github.getPersonalAccessToken() // NOTE

  return token
}

const run = async() => {
  try {

    // Retrieve and Set Authentication Token
    const token = await getGithubToken()
    github.githubAuth( token )

    // Create remote repository
    const url = await repo.createRemoteRepo()

    // Create gitignore file
    await repo.createGitignore()

    // Set up local repository and push to remote
    await repo.setupRepo( url )
    console.log( chalk.green( 'All done!' ) )
  } catch ( err ) {
    if ( err ) {
      switch ( err.status ) {
        case 401:
          console.log(
            chalk.red( "Coudn't log in. Please check credentials/token." ),
          )
          break
        case 422:
          console.log(
            chalk.red(
              'There is already a remote repository or token with the same name.',
            ),
          )
          break
        default:
          console.log( chalk.red( err ) )
      }
    }
  }
}

run()
