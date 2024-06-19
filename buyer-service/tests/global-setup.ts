import { execSync } from 'node:child_process'

let teardownHappened = false

export async function setup() {

  // execSync('npx prisma migrate dev')
  execSync('npx prisma migrate reset --force')

  return async () => {
    if (teardownHappened) {
      throw new Error('teardown called twice')
    }
    teardownHappened = true
  }
}
