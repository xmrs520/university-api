var express = require('express');
var router = express.Router();
var User = require('../controllers/UserController');
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.post('/login', User.userLogin);
router.post('/addStudents', User.addStudents);
router.post('/addTeachers', User.addTeachers);
router.post('/addCourse', User.addCourse);
router.post('/addCourseLimit', User.addCourseLimit);
router.post('/editSudentInfo', User.editSudentInfo);
router.post('/editTeacherInfo', User.editTeacherInfo)
router.post('/setCourseInfo', User.setCourseInfo)
router.post('/setCourseLimitInfo', User.setCourseLimitInfo)
router.post('/selectedCourse', User.selectedCourse)
router.post('/courseUnsubscribe', User.courseUnsubscribe)
router.post('/removeCoue', User.removeCoue)
router.post('/removeStudents', User.removeStudents)
router.post('/removeTeachers', User.removeTeachers)
router.post('/setPassword', User.setPassword)

module.exports = router;
