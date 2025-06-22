const express = require('express');
const { query, validationResult } = require('express-validator');
const router = express.Router();
const prisma = require('../../prisma/prismaClient')
const { NotFoundResponse, success, failure} = require('../../utils/response')

async function getRoleDetail(id){
  const role = await prisma.role.findUnique({
    where: { id },
    select: {
      id: true,
      name: true
    }
  })
  if(!role){
    throw new NotFoundResponse('ID为'+ id + '的角色不存在')
  }
  return role
}
 
//获取角色列表
router.get('/', async(req, res) => {
  try{
    const query = req.query
    console.log("打印query：", query)
    let filters = {}
    const pagination   = {
      offset: (query && (query.currentPage - 1) * ( query.limit || 10)) || 0,
      limit: (query && query.limit) || 10
    }
    if(query && query.title){
      filters.title = {
        contains: query.title
      }
    }
 
    console.log("打印filter和pagination：", filters, pagination)
    const list = await prisma.role.findMany(
      {
        where: filters,
        skip: Math.abs(parseInt(pagination.offset)),
        take: Math.abs(parseInt(pagination.limit)),
      }
    ) 
    const total = await prisma.role.count({
      where: filters 
    })
    const result = {
      total,
      currentPage: query.currentPage || 1,
      limit: pagination.limit || 10, 
      data: list, 
    }
    success(res, result)
  }catch(err){
    failure(res, err)
  }
})

//获取角色详情
router.get('/detail/:id', query('id').notEmpty(), async(req, res) => {
  try{
    const validationData = validationResult(req)
    console.log("打印validationData：", validationData)
    if(validationData.errors.length > 0){
      throw new Error('参数错误')
    }
    const id = req.params.id
    console.log("请求数据：", req.params)
    const role  = await getRoleDetail(Math.abs(parseInt(id)))
    success(res, role)
  }catch(err){
    failure(res, err)
  }
})


router.post('/', async(req, res) => {
  try{
    console.log("请求数据：", req.body)
    const { name, auth_list } = req.body
    const roleData = await prisma.role.create({
      data: {
        name,
        auth_list: JSON.parse(auth_list),
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString()
      }
     }).catch(err => {
        failure(res, err)
     })
     
     success(res, roleData, null, 201)
  }catch(err){
    failure(res, err)
  }
})

router.delete('/:id', async(req, res) => {
  try{
    let { id } = req.params
    console.log("请求数据：", req.params)
    const role  = await getRoleDetail(Math.abs(parseInt(id)))
    await prisma.role.delete({
      where: { id: role.id }
    }).catch(err => {
      failure(res, err)
    })
    success(res, role)

  }catch(err){
    failure(res, err) 
  }

})

router.put('/:id', async(req, res) => {
  try{
    let { id } = req.params
    console.log("请求数据：", req.params, req.body)
    const role  = await getRoleDetail(Math.abs(parseInt(id)))
    const { name, auth_list, is_active } = req.body
    const updateRole = await prisma.role.update({
      where: { id: role.id },
      data: {
        name,
        auth_list,
        is_active,
      } 
    })
    success(res, updateRole)

  }catch(err){
    failure(res, err)
  }
})

module.exports = router;