import db from '../src/common/prisma.client'

// TODO: use proper seeder
const seed = async () => {
  const seller1 = '90d57fe0-0fa1-4dae-a51c-917cc82bcdda'

  await db.seller.upsert({
    where: { id: seller1 },
    update: {},
    create: {
      id: seller1,
      name: 'seller1',
      apiKeys: {
        create: {
          id: '18e8ca3c-2a1f-4f1e-a2ef-41ae0002d983',
          key: 'some-secret-api-key',
        },
      },
    },
  })
  const seller2 = 'ff42a46c-6143-4b26-85d0-69240eb39f24'

  await db.seller.upsert({
    where: { id: seller2 },
    update: {},
    create: {
      id: seller2,
      name: 'seller2',
      apiKeys: {
        create: {
          id: '9fc473ea-93f6-41ce-a96b-1c33a19a80c0',
          key: 'another-secret-api-key',
        },
      },
    },
  })
  console.log('DONE')
}

seed()
  .then(async () => await db.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
