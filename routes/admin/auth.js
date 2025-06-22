const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prismaClient = require('../../prisma/prismaClient');
const { NotFoundResponse, UnauthorizedError, success, failure} = require('../../utils/response');

/**
 * 创建时间: 2025-06-21 20:04:33
 * 功能描述: 登录
 */
router.post('/', async function (req, res) { 
  try{
    const { username, password } = req.body;
    console.log(req.body);
    if (!username || !password) {
      throw new UnauthorizedError('用户名或密码不能为空');
    }
    const user = await prismaClient.user.findUnique({
      where: { username, is_active: { equals: "Y" } },
      include: {
        role: true
      }
    });
       console.log("用户信息：", user)

    if(!user){
      throw new UnauthorizedError('用户不存在');
    }
    if(!user.status){
      throw new UnauthorizedError('用户被禁用');
    }
    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedError('账号或密码错误')
    }
    
    //为前端无感刷新提供双token
    const access_token = jwt.sign({
      id: user.id,
      username: user.username
    }, process.env.SECRET, { expiresIn: '1h' })
    const refresh_token = jwt.sign({
      id: user.id,
      username: user.username
    }, process.env.SECRET, { expiresIn: '7d' })

    const result = {
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        status: user.status,
        mobile: user.mobile,
        role: user.role
      },
      access_token,
      expires_in: 3600,
      refresh_token,
    }
    return success(res, result)
  }catch(err){
    return failure(res, err)
  }
});

module.exports = router;