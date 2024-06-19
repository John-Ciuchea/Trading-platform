import { execSync } from 'node:child_process'

let teardownHappened = false
export async function setup() {

  execSync('npx prisma migrate deploy')

  return async () => {
    if (teardownHappened) {
      throw new Error('teardown called twice')
    }
    teardownHappened = true
    execSync('npx prisma migrate reset --force')
  }
}
