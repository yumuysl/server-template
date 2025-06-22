var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
let usersRouter = require('./routes/admin/user');
let rolesRouter = require('./routes/admin/role');
let authRouter = require('./routes/admin/auth');

var app = express();
const cors = require('cors');
//CORS跨域配置，需要在其他路由上面
const corsOptions = {
    origin: 'http://localhost:5173'
}
app.use(cors(corsOptions))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin/users', usersRouter);
app.use('/admin/login', authRouter);
app.use('/admin/roles', rolesRouter)


module.exports = app;
