var express = require('express');
var router = express.Router();
var user = require('../controllers/UserController');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/getUserInfo', user.getUserInfo)
router.get('/getCourseAllInfo', user.getCourseAllInfo)
router.get('/getSelectedCourseInfo', user.getSelectedCourseInfo)
router.get('/getSelectedCourseStudentInfo', user.getSelectedCourseStudentInfo)
router.get('/getStudentSelectedCourseInfo', user.getStudentSelectedCourseInfo)
router.get('/getAllStudentInfo', user.getAllStudentInfo)//获取所有学生分页
router.get('/getAllTeachersInfo', user.getAllTeachersInfo)
module.exports = router;
