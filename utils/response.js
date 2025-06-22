class NotFoundResponse extends Error  {
  constructor(message) {
    super(message);
    this.name = "NotFoundResponse";
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

function success(res, data={}, message, code=200) {
  return res.status(code).json({
    status: 'success',
    data,
    message
  })  
}

function failure(res, error){
  console.log('log: ', error);
  if(error.name === 'SequelizeValidationError'){
    return res.status(400).json({
      status: 'error',
      message: '请求参数错误',
      errors: error.errors
    })
  }

  if(error.name === 'NotFoundResponse'){
    return res.status(404).json({
      status: 'error',
      message: '资源不存在',
      errors: [error.message]
    })
  }

  if(error.name === 'UnauthorizedError'){
    return res.status(401).json({
      status: 'error',
      message: '校验失败/未授权',
      errors: [error.message]
    })
  }

  if(error.name === 'JsonWebTokenError'){
    return res.status(401).json({
      status: 'error',
      message: '认证失败',
      errors: ['token错误']
    }) 
  }

  if(error.name === 'TokenExpiredError'){
    return res.status(401).json({
      status: 'error',
      message: '认证失败',
      errors: ['token已过期']
    })
  }

  return res.status(500).json({
    status: 'error',
    message: '服务错误',
    errors: [error.message]
  })
}

module.exports = {
  NotFoundResponse,
  UnauthorizedError,
  success,
  failure
}; 