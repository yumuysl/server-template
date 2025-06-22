const express = require('express');
//const { query, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const prisma = require('../../prisma/prismaClient')
const { NotFoundResponse, success, failure} = require('../../utils/response');

const router = express.Router();

async function getUserDetail(id){
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      nickname: true,
      email: true,
      mobile: true,
      avatar: true,
      status: true,
      role_id: true,
      create_time: true,
      update_time: true
    }
  })
  if(!user){
    throw new NotFoundResponse('ID为'+ id + '的用户不存在')
  }
  return user
}


//获取用户列表
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
    const list = await prisma.user.findMany(
      {
        where: filters,
        select: {
          id: true,
          username: true,
          nickname: true, 
          email: true,
          mobile: true,
          avatar: true,
          role: {
            select: {
              id: true,
              name: true,
              auth_list: true,
              description: true
            }
          },
          status: true,
          create_time: true,
          update_time: true,
        },
        skip: Math.abs(parseInt(pagination.offset)),
        take: Math.abs(parseInt(pagination.limit)),
      }
    ) 
    const total = await prisma.user.count({
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

//获取用户详情
router.get('/detail/:id',  async(req, res) => {
  try{
    const id = req.params.id
    console.log("请求数据：", req.params)
    const user  = await getUserDetail(Math.abs(parseInt(id))).catch(err => {
      throw new NotFoundResponse('ID为'+ id + '的用户不存在')
    })
    success(res, user)
  }catch(err){
    failure(res, err)
  }
})

router.post('/', async(req, res) => {
  try{
    console.log("请求数据：", req.body)
    const { username, password1, password2,  nickname, email, mobile, avatar } = req.body
    if(password1 !== password2){
      throw new NotFoundResponse('两次输入的密码不一致')
    }
    const UserData = await prisma.user.create({
      data: {
        username,
        password: bcrypt.hashSync(password1, 10),
        nickname,
        email,
        mobile,
        avatar,
        create_time: new Date(+new Date() + 8*3600*1000).toISOString(),
        update_time: new Date(+new Date() + 8*3600*1000).toISOString(),
      }
     }).catch(err => {
        failure(res, err)
     })
     
     success(res, UserData, null, 201)
  }catch(err){
    failure(res, err)
  }
})


router.put('/:id', async(req, res) => {
  try{
    let { id } = req.params
    console.log("请求数据：", req.params, req.body)
    const user  = await getUserDetail(Math.abs(parseInt(id)))
    let dist = {}
    for(let key of Object.keys(req.body)){
      if(req.body[key] !== user[key]){
        if(key === 'role_id'){
          dist[key] = Math.abs(parseInt(req.body[key]))
        }else{
          dist[key] = req.body[key]
        }
      }
    }
    const updateUser = await prisma.user.update({
      where: { id: user.id },
      data: dist
    })
    success(res, updateUser)

  }catch(err){
    failure(res, err)
  }
})

router.put('/password/:id', async (req, res) => { 
  try{
    let {id} = req.params
    const { password1, password2 } = req.body
    if(password1 !== password2){
      throw new NotFoundResponse('新密码输入不一致')
    }
    const user  = await getUserDetail(Math.abs(parseInt(id)))
    const updateUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: bcrypt.hashSync(password1, 10)
      } 
    })
    success(res, null, "密码重置成功")
  }catch(e){
    failure(res, e)
  }
})

module.exports = router;