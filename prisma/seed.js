const { PrismaClient } = require('@prisma/client')
const mock = require('mockjs')

const prisma = new PrismaClient()

const userData = mock.mock({
  'user|10': [
    {
      'username': '@last' + '@first',
      'nickname': '@cname',
      'password': '123456',
      'email': '@email',
      'mobile': '@string("130123456789", 11)',
      'avatar': '@image("100x100", "#50B347", "#FFF", "Mock.js")',
      'create_time': new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      'update_time': new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  ]
})



async function main(){

  //插入用户数据
  const hangdleUserData =  await prisma.user.createMany({
    data: userData.user
  })
  console.log(hangdleUserData.count)


}

main().then(async () => {
  await prisma.$disconnect() 
}).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1) 
})