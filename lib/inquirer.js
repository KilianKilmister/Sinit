const inquirer = require( 'inquirer' )
const files = require( './files' )

module.exports = {
  askGithubCredentials: () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter your GitHub username or e-mail address:',
        validate: function( value ) {
          if ( value.length ) {
            return true
          } else {
            return 'Please enter your username or e-mail address.'
          }
        },
      },
      {
        name: 'password',
        type: 'password', // TODO : add basic encryprion
        message: 'Enter your password:',
        validate: function( value ) {
          if ( value.length ) {
            return true
          } else {
            return 'Please enter your password.'
          }
        },
      },
    ]
    return inquirer.prompt( questions )
  },

  getTwoFactorAuthenticationCode: () => {
    return inquirer.prompt( {
      name: 'twoFactorAuthenticationCode',
      type: 'input',
      message: 'Enter your two-factor authentication code:',
      validate: function( value ) {
        if ( value.length ) {
          return true
        } else {
          return 'Please enter your two-factor authentication code.'
        }
      },
    } )
  },

  askRepoDetails: () => {
    const argv = require( 'minimist' )( process.argv.slice( 2 ) )

    const questions = [
      {
        name: 'name',
        type: 'input',
        message: 'Enter a name for the repository:',
        default: argv._[0] || files.getCurrentDirectoryBase(), // see note
        validate: function( value ) {
          if ( value.length ) {
            return true
          } else {
            return 'Please enter a name for this ripository...'
          }
        },
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Optionally enter a description of the repository:',
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or Private:',
        choices: ['public', 'private'],
        default: 'public',
      },
    ]
    return inquirer.prompt( questions )
  },

  askIgnoreFiles: filelist => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and folders you wish to ignore:',
        choices: filelist,
        default: ['node_modules', 'bower_components'],
      },
    ]
    return inquirer.prompt( questions )
  },
}

/** *********************************************************************************************************************************************
 *                                                                    NOTE                                                                     *
 *                   WE’LL USE MINIMIST TO GRAB DEFAULTS FOR THE NAME AND DESCRIPTION FROM OPTIONAL COMMAND-LINE ARGUMENTS.                    *
 *                                                                FOR EXAMPLE:                                                                 *
 *                                                ¦ sinit MY - REPO "JUST A TEST REPOSITORY" ¦                                                 *
 *                          THIS WILL SET THE DEFAULT NAME TO MY-REPO AND THE DESCRIPTION TO JUST A TEST REPOSITORY.                           *
 *                              THE FOLLOWING LINE WILL PLACE THE ARGUMENTS IN AN ARRAY INDEXED BY AN UNDERSCORE:                              *
 *                                          CONST ARGV = REQUIRE('MINIMIST')(PROCESS.ARGV.SLICE(2));                                           *
 *                                              //{ _: [ 'MY-REPO', 'JUST A TEST REPOSITORY' ] }                                               *
 * TIP: THIS ONLY REALLY SCRATCHES THE SURFACE OF THE MINIMIST PACKAGE. YOU CAN ALSO USE IT TO INTERPRET FLAGS, SWITCHES AND NAME/VALUE PAIRS. *
 *                                              CHECK OUT THE DOCUMENTATION FOR MORE INFORMATION.                                              *
 ***********************************************************************************************************************************************/
