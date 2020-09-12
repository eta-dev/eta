const { exec, echo } = require('shelljs')
var path = require('path')
const child_process = require('child_process')

const branchToReleaseFrom = 'master'

var currentBranch = exec('git branch --show-current').stdout.trim()

console.log('current branch is ' + currentBranch)

if (currentBranch !== branchToReleaseFrom) {
  throw 'Cannot release when not on ' + branchToReleaseFrom
}

try {
  echo('Attempting to release a new version!')

  // First we delete the old release branch
  echo('Deleting release branch')
  exec('git branch -D release')
  exec('git push origin :release')

  // Now we create a new release branch
  echo('Re-creating release branch')
  exec('git branch release')
  exec('git checkout release')

  // Now we build, and add the dist/ and deno_dist/ directories
  exec('npm run build')
  exec('git add --force dist deno_dist')
  exec('git commit --quiet -m "Build distribution files"')

  // We push to the remote release branch
  exec(`git push --force --quiet origin release`)

  // And then we use `np` to release
  child_process.execFileSync(path.join(__dirname, '../node_modules/.bin/np'), ['--branch release'], {
    stdio: 'inherit',
  })

  // Finally, we'll check out the original branch
  exec('git checkout ' + currentBranch)

  echo('Released new version!!')
} catch (ex) {
  if (currentBranch) {
    exec('git checkout ' + currentBranch)
  }

  throw ex
}
