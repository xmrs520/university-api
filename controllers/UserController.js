const dbcongif = require('../utli/dbconfig')
//引入token 
var vertoken = require('../utli/token')

//用户登录

let userLogin = async (req, res) => {
  let { id, password, role } = req.query;
  let token = '';

  if (role == 1) {
    console.log('students 登录');
    let sql = 'select * from students where stu_id=? and password=?';
    let sqlArr = [id, password];

    let callBack = async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          code: 400,
          msg: '出错啦'
        });
      } else if (data == '') {
        res.status(400).send({
          code: 400,
          msg: '用户名或者密码出错!'
        });
      } else {
        //调用生成token的方法
        vertoken.setToken(data[0].stu_id, data[0].name).then(token => {
          return res.send({
            token: token,
            code: 200,
            msg: '登录成功',
            data: data[0]
            // 前端获取token后存储在localStroage中,
            // 调用接口时 设置axios(ajax)
            // 请求头Authorization的格式为`Bearer ` +token
          });
        })


      }
    }
    dbcongif.sqlConnect(sql, sqlArr, callBack);
  } else {
    console.log('teachers 登录');
    let sql = 'select * from teachers where teacher_id=? and password=?';
    let sqlArr = [id, password];
    let callBack = async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          code: 400,
          msg: '出错啦'
        });
      } else if (data == '') {
        res.status(400).send({
          code: 400,
          msg: '用户名或者密码出错!'
        });
      } else {
        //调用生成token的方法
        vertoken.setToken(data[0].teacher_id, data[0].name).then(token => {
          return res.send({
            token: token,
            code: 200,
            msg: '登录成功',
            data: data[0]
            // 前端获取token后存储在localStroage中,
            // 调用接口时 设置axios(ajax)
            // 请求头Authorization的格式为`Bearer ` +token
          });
        })
      }
    }
    dbcongif.sqlConnect(sql, sqlArr, callBack);
  }
}

//获取学生信息
let getStudentInfo = (user_id) => {
  let sql = `select stu_id,name,sex,major,majorcode,classes,department,role from students where stu_id=?`;
  let sqlArr = [user_id];
  return dbcongif.SySqlConnect(sql, sqlArr);
}
//获取所有学生分页
let getAllStudentInfo = async (req, res) => {
  let { page, num } = req.query;
  parseInt(num);
  if (!page) {
    page = 1;
  }
  if (!num) {
    num = 10;
  }
  let index = (page - 1) * num;
  parseInt(index)
  let sql = {
    a: `SELECT COUNT(*) FROM students`,
    b: `SELECT
          * 
        FROM
          students 
          LIMIT ${index},
          ${num}`
  };
  let sqlArr = [];
  let sum = (JSON.parse(JSON.stringify(await dbcongif.SySqlConnect(sql.a, sqlArr)))[0])['COUNT(*)'];
  let sumPage = sum % num == 0 ? sum / num : parseInt(sum / num) + 1;
  let reuslt = await dbcongif.SySqlConnect(sql.b, sqlArr);
  if (reuslt) {
    res.send({
      code: 200,
      msg: {
        data: reuslt,
        sumPage,
        total: sum
      }
    })
  } else {
    res.status(400).send({
      msg: '获取所有学生分页失败'
    })
  }
}
//获取所有老师分页
let getAllTeachersInfo = async (req, res) => {
  let { page, num } = req.query;
  parseInt(num);
  if (!page) {
    page = 1;
  }
  if (!num) {
    num = 10;
  }
  let index = (page - 1) * num;
  parseInt(index)
  let sql = {
    a: `SELECT COUNT(*) FROM teachers`,
    b: `SELECT
          * 
        FROM
        teachers 
          LIMIT ${index},
          ${num}`
  };
  let sqlArr = [];
  let sum = (JSON.parse(JSON.stringify(await dbcongif.SySqlConnect(sql.a, sqlArr)))[0])['COUNT(*)'];
  let sumPage = sum % num == 0 ? sum / num : parseInt(sum / num) + 1;
  let reuslt = await dbcongif.SySqlConnect(sql.b, sqlArr);
  if (reuslt) {
    res.send({
      code: 200,
      msg: {
        data: reuslt,
        sumPage,
        total: sum
      }
    })
  } else {
    res.status(400).send({
      msg: '获取所有老师分页失败'
    })
  }
}

//获取老师信息
let getTeacherInfo = (user_id) => {
  let sql = `select teacher_id,name,sex,department,role from teachers where teacher_id=?`;
  let sqlArr = [user_id];
  return dbcongif.SySqlConnect(sql, sqlArr);
}
// 获取用户信息
let getUserInfo = async (req, res) => {
  let { id, role } = req.query;

  if (role == 1) {
    let sql = 'select stu_id,name,sex,major,majorcode,classes,department,role from students where stu_id=?';
    let sqlArr = [id];
    let userInfo = await dbcongif.SySqlConnect(sql, sqlArr);
    res.json(userInfo)
  } else {
    let sql = 'select teacher_id,name,sex,department,role from teachers where teacher_id=?';
    let sqlArr = [id];
    let userInfo = await dbcongif.SySqlConnect(sql, sqlArr);
    res.json(userInfo)
  }
}

//检查学生存在
let checkStudent = async (stu_id) => {
  let sql = 'select * from students where stu_id=?';
  let sqlArr = [stu_id];
  let res = await dbcongif.SySqlConnect(sql, sqlArr);
  if (!res.length) {
    return true;
  } else {
    return false;
  }
}
//检查老师存在
let checkTeacher = async (teacher_id) => {
  let sql = 'select * from teachers where teacher_id=?';
  let sqlArr = [teacher_id];
  let res = await dbcongif.SySqlConnect(sql, sqlArr);
  if (!res.length) {
    return true;
  } else {
    return false;
  }
}
// 添加学生

let addStudents = async (req, res) => {
  let { id, name, sex, major, classes, department, password } = req.query;
  let check = await checkStudent(id)
  if (check) {
    let sql = 'insert into students (stu_id,name,sex,major,classes,department,password) values(?,?,?,?,?,?,?)';
    let sqlArr = [id, name, sex, major, classes, department, password];
    let result = await dbcongif.SySqlConnect(sql, sqlArr);
    if (result.affectedRows > 0) {
      res.send({
        code: 200,
        msg: '添加学生成功'
      })
    } else {
      res.send({
        code: 400,
        msg: '添加学生失败'
      })
    }
  } else {
    res.send({
      code: 400,
      msg: '学号已存在'
    })
  }

}
// 添加老师
let addTeachers = async (req, res) => {
  let { id, name, sex, department, password } = req.query;
  let check = await checkTeacher(id);
  if (check) {
    let sql = 'insert into teachers (teacher_id,name,sex,department,password) values(?,?,?,?,?)';
    let sqlArr = [id, name, sex, department, password];
    let result = await dbcongif.SySqlConnect(sql, sqlArr);
    if (result.affectedRows) {
      res.send({
        code: 200,
        msg: '添加老师成功'
      })
    } else {
      res.send({
        code: 400,
        msg: '添加老师失败'
      })
    }
  } else {
    res.send({
      code: 400,
      msg: '教师编号已存在'
    })
  }

}
//检查课程存在
let checkCourse = async (course_id) => {
  let sql = 'select * from courses where course_id=?';
  let sqlArr = [course_id];
  let res = await dbcongif.SySqlConnect(sql, sqlArr);
  if (res.length) {
    return true;
  } else {
    return false;
  }
}
// 添加课程
let addCourse = async (req, res) => {
  let { id, coursename, teacher_id, teacher, department, numberlimit } = req.query
  let check = await checkCourse(id);
  if (!check) {
    let sql = 'insert into courses (course_id, coursename, teacher_id, teacher, department, selectednumber,numberlimit)value(?,?,?,?,?,?,?)';
    let sqlArr = [id, coursename, teacher_id, teacher, department, 0, numberlimit];
    let result = await dbcongif.SySqlConnect(sql, sqlArr)
    if (result.affectedRows > 0) {
      res.send({
        code: 200,
        msg: '课程信息表添加成功'
      })
    }
    else {
      res.status(402).send({
        code: 402,
        msg: '课程信息表添加失败'
      })
    }
  } else {
    res.status(400).send({
      code: 400,
      msg: '课程已存在'
    })
  }
}
// 课程限选
let addCourseLimit = async (req, res) => {
  let { id, majorlimit, classlimit } = req.query
  let check = await checkCourse(id);
  if (check) {
    let sql = 'insert into course_limit (course_id, majorlimit, classlimit) value(?,?,?)';
    let sqlArr = [id, majorlimit, classlimit];
    let result = await dbcongif.SySqlConnect(sql, sqlArr);
    if (result.affectedRows > 0) {
      res.send({
        code: 200,
        msg: '课程添加成功'
      })
    } else {
      res.status(400).send({
        code: 400,
        msg: '课程限选表添加失败'
      })
    }
  } else {
    res.status(400).send({
      code: 400,
      msg: '课程限选，课程号不存在'
    })
  }
}
// 修改学生信息
let setUserInfo = async (user_id, name, sex, major, classes, department, password) => {
  if (checkStudent(user_id)) {
    let sql = `update students set name=?,sex=?,major=?,classes=?,department=?,password=? where stu_id=?`;
    let sqlArr = [name, sex, major, classes, department, password, user_id];
    let res = await dbcongif.SySqlConnect(sql, sqlArr);
    if (res.affectedRows == 1) {
      let user = await getStudentInfo(user_id);
      return user;
    }
  } else {
    return [];
  }
}

let editSudentInfo = async (req, res) => {
  let { stu_id, name, sex, major, classes, department, password } = req.query;
  let data = await setUserInfo(stu_id, name, sex, major, classes, department, password);
  if (data) {
    res.send({
      code: 200,
      msg: '修改成功',
      data: data[0]
    })
  } else {
    res.status(400).send({
      code: 400,
      msg: '学号不存在'
    })
  }
}
// 修改老师信息
let setTeacherUserInfo = async (teacher_id, name, sex, department, password) => {
  if (checkTeacher(teacher_id)) {
    let sql = `update teachers set name=?,sex=?,department=?,password=? where teacher_id=? `;
    let sqlArr = [name, sex, department, password, teacher_id];
    let res = await dbcongif.SySqlConnect(sql, sqlArr);
    if (res.affectedRows == 1) {
      let user = await getTeacherInfo(teacher_id);
      return user;
    }
  } else {
    return [];
  }
}

let editTeacherInfo = async (req, res) => {
  let { teacher_id, name, sex, department, password } = req.query;
  let data = await setTeacherUserInfo(teacher_id, name, sex, department, password);
  if (data) {
    res.send({
      code: 200,
      msg: '修改成功',
      data: data[0]
    })
  } else {
    res.status(400).send({
      code: 400,
      msg: '教师编号不存在'
    })
  }
}
//修改密码
//检查用户密码
let checkUserPwd = async (user_id, user_role) => {
  if (user_role == 1) {
    let sql = `select password from students where stu_id=?`;
    let sqlArr = [user_id];
    let res = await dbcongif.SySqlConnect(sql, sqlArr);
    console.log(res[0].password)
    if (res.length) {
      return res[0].password;
    } else {
      return 0;
    }
  } else {
    let sql = `select password from teachers where teacher_id=?`;
    let sqlArr = [user_id];
    let res = await dbcongif.SySqlConnect(sql, sqlArr);
    console.log(res[0].password)
    if (res.length) {
      return res[0].password;
    } else {
      return 0;
    }
  }
}
//修改用户密码
let setPassword = async (req, res) => {
  let { id, oldpassword, newpassword, role } = req.query;
  let userPwd = await checkUserPwd(id, role);
  //修改学生密码
  if (role == 1) {
    if (userPwd == oldpassword) {
      let sql = `update students set password=? where stu_id=?`;
      let sqlArr = [newpassword, id];
      let result = await dbcongif.SySqlConnect(sql, sqlArr);
      if (result.affectedRows) {
        res.send({
          code: 200,
          msg: '学生修改密码成功！'
        })
      } else {
        res.send({
          code: 400,
          msg: '学生修改密码失败！'
        })
      }
    } else {
      res.status(400).send({
        code: 400,
        msg: '学生原密码输入错误！'
      })
    }
  } else {//修改老师密码
    if (userPwd == oldpassword) {
      let sql = `update teachers set password=? where teacher_id=?`;
      let sqlArr = [newpassword, id];
      let result = await dbcongif.SySqlConnect(sql, sqlArr);
      if (result.affectedRows) {
        res.send({
          code: 200,
          msg: '老师修改密码成功！'
        })
      } else {
        res.send({
          code: 400,
          msg: '老师修改密码失败！'
        })
      }
    } else {
      res.send({
        code: 400,
        msg: '老师原密码输入错误！'
      })
    }
  }
}

//查询课程限选
let getCourseLimit = async (course_id) => {
  let sql = `select * from course_limit where course_id=?`;
  let sqlArr = [course_id];
  return await dbcongif.SySqlConnect(sql, sqlArr);
}
//学生选课表
let getStudentSelectedCourseInfo = async (req, res) => {
  let { stu_id } = req.query;
  let sql = {
    a: `select * from course_limit`,
    b: ` select a.course_id,a.coursename,a.teacher,a.selectednumber,a.numberlimit,a.department
    from courses as a 
    left join course_limit as b 
    on a.course_id = b.course_id 
    where b.majorlimit=? and b.classlimit=?`,
    c: ` 
    select a.course_id,a.coursename,a.teacher,a.selectednumber,a.numberlimit,a.department
    from courses as a 
    left join course_limit as b 
    on a.course_id = b.course_id 
        where 
            b.majorlimit=? 
    `
  };
  let infor = await getStudentInfo(stu_id);
  let sqlArr = {
    a: [],
    b: [infor[0].major, infor[0].classes],
    c: [infor[0].major]
  };
  let CourseLimit = await dbcongif.SySqlConnect(sql.a, sqlArr.a);
  if (infor[0].major == CourseLimit[0].majorlimit && infor[0].classes == CourseLimit[0].classlimit) {
    let result = await dbcongif.SySqlConnect(sql.b, sqlArr.b);
    return res.json(result);
  } else if (infor[0].classes !== CourseLimit[0].classlimit) {
    let result = await dbcongif.SySqlConnect(sql.c, sqlArr.c);
    return res.json(result);
  } else {
    res.send({
      code: 400,
      msg: '学生选课表查询失败'
    })
  }
}
//学生选课
let selectedCourse = async (req, res) => {
  let { stu_id, course_id } = req.query;
  let sql = {
    a: `
        INSERT INTO 
        student_course 
        (stu_id,course_id)
        VALUES
        (?,?)`,
    b: `select * from courses`
  };
  let sqlArr = {
    a: [stu_id, course_id],
    b: []
  };
  // 选课人数<限选人数
  let CourseInfo = await dbcongif.SySqlConnect(sql.b, sqlArr.b);
  if (CourseInfo[0].selectednumber < CourseInfo[0].numberlimit) {
    // 重复选课
    let sql1 = `select * from student_course where stu_id=? and course_id=? `
    let resul2 = await dbcongif.SySqlConnect(sql1, sqlArr.a);
    if (resul2.length) {
      res.status(404).send({
        code: 404,
        msg: '课程已选'
      })
    } else {
      let result = await dbcongif.SySqlConnect(sql.a, sqlArr.a);
      if (result.affectedRows > 0) {
        let sql = `
          UPDATE courses 
          SET selectednumber= selectednumber+1 
          WHERE course_id =?`;
        let sqlArr = [course_id];
        let result = await dbcongif.SySqlConnect(sql, sqlArr);
        if (result.affectedRows > 0) {
          res.send({
            code: 200,
            msg: '学生选课成功！'
          })
        } else {
          res.send({
            code: 403,
            msg: '增加已选人数失败！'
          })
        }

      } else {
        res.send({
          code: 402,
          msg: '学生选课失败！'
        })
      }
    }

  } else {
    res.send({
      code: 401,
      msg: '超出选课人数！'
    })
  }


}
// 修改课程信息
// 
let setCourseInfo = async (req, res) => {
  let { id, coursename, teacher, teacher_id, department, numberlimit } = req.query
  let check = await checkCourse(id);
  if (check) {
    let sql = `update courses set coursename=?,teacher=?,teacher_id=?,department=?,numberlimit=? where course_id=?`;
    let sqlArr = [coursename, teacher, teacher_id, department, numberlimit, id];
    let result = await dbcongif.SySqlConnect(sql, sqlArr)
    if (result.affectedRows) {
      res.send({
        code: 200,
        msg: '课程信息表修改成功'
      })
    }
    else {
      res.send({
        code: 400,
        msg: '课程信息表修改失败'
      })
    }
  } else {
    res.send({
      code: 400,
      msg: '课程不存在'
    })
  }
}
//修改课程限选
let setCourseLimitInfo = async (req, res) => {
  let { id, majorlimit, classlimit } = req.query
  let check = await checkCourse(id);
  if (check) {
    let sql = `update course_limit set majorlimit=?,classlimit=? where course_id=?`;
    let sqlArr = [majorlimit, classlimit, id];
    let result = await dbcongif.SySqlConnect(sql, sqlArr)
    if (result.affectedRows) {
      res.send({
        code: 200,
        msg: '课程限选修改成功'
      })
    }
    else {
      res.send({
        code: 400,
        msg: '课程限选修改失败'
      })
    }
  } else {
    res.send({
      code: 400,
      msg: '课程不存在'
    })
  }
}


// 查询课程详情
let getCourseAllInfo = async (req, res) => {
  let sql = {
    a: `select * from courses as a left join course_limit as b on a.course_id = b.course_id`,
    b: `select * from students as a left join student_course as b on a.stu_id = b.stu_id
    WHERE a.stu_id = b.stu_id AND course_id = ?`
  }
  let sqlArr = {
    a: [],
    b: []
  }
  let CourseInfo = await dbcongif.SySqlConnect(sql.a, sqlArr.a);
  for (item of CourseInfo) {
    // console.log(item)
    sqlArr.b = item.course_id
    item.studentsInfo = await dbcongif.SySqlConnect(sql.b, sqlArr.b)
  }
  res.json(CourseInfo)
}
// 学生查询已选课程
let getSelectedCourseInfo = async (req, res) => {
  let { stu_id } = req.query;
  let sql = `
  select 
  a.course_id,a.coursename,a.teacher,a.department,a.selectednumber,a.numberlimit
  from 
    courses as a left join student_course as b 
  on 
    a.course_id = b.course_id 
  WHERE
    stu_id=?`;
  let sqlArr = [stu_id];
  let SelectedCourseInfo = await dbcongif.SySqlConnect(sql, sqlArr);
  res.json(SelectedCourseInfo)
}
// 老师查询已选课程学生信息
let getSelectedCourseStudentInfo = async (req, res) => {
  let { teacher_id } = req.query;
  let sql = `
  select a.coursename,c.stu_id,c.name,c.sex,c.major,c.classes,c.department 
  from courses a
  left join student_course b
    on a.course_id = b.course_id
  LEFT JOIN students c 
    ON c.stu_id = b.stu_id
  WHERE teacher_id =?
ORDER BY a.course_id,stu_id ASC`;
  let sqlArr = [teacher_id];
  let SelectedCourseStudentInfo = await dbcongif.SySqlConnect(sql, sqlArr);
  res.json(SelectedCourseStudentInfo)
}
// 删除
// 课程退订
let courseUnsubscribe = async (req, res) => {
  let { stu_id, course_id } = req.query;
  let sql =
    `  DELETE
    FROM
      student_course
    WHERE
      stu_id = ? and course_id=?`;
  let sqlArr1 = [stu_id, course_id];
  let result = await dbcongif.SySqlConnect(sql, sqlArr1);
  if (result.affectedRows > 0) {
    let sql = `
      UPDATE courses 
      SET selectednumber= selectednumber-1 
      WHERE course_id =?`;
    let sqlArr = [course_id];
    let result2 = await dbcongif.SySqlConnect(sql, sqlArr);
    if (result2.affectedRows > 0) {
      res.send({
        code: 200,
        msg: '课程退订成功'
      })
    }

  }
  else {
    res.status(400).send({
      code: 400,
      msg: '课程退订失败'
    })
  }
}

// 课程删除
let removeCoue = async (req, res) => {
  let { id } = req.query;
  let sql = {
    a: `DELETE
    FROM
      course_limit
    WHERE
      course_id =? `,
    b: `DELETE
    FROM
      courses
    WHERE
      course_id =?`
  };
  let sqlArr = [id];
  let result = await dbcongif.SySqlConnect(sql.a, sqlArr);
  if (result.affectedRows > 0) {
    let result1 = await dbcongif.SySqlConnect(sql.b, sqlArr);
    if (result1.affectedRows > 0) {
      res.send({
        code: 200,
        msg: '课程删除成功'
      })
    } else {//有学生选课，不能删除，必须退订选课
      let sql = {
        aa: `
        DELETE
        FROM
          student_course
        WHERE
          course_id =?`,
        bb: `
        UPDATE courses 
        SET selectednumber= selectednumber-1 
        WHERE course_id =?`
      }
      let result2 = await dbcongif.SySqlConnect(sql.aa, sqlArr);
      let result3 = await dbcongif.SySqlConnect(sql.bb, sqlArr);
      if (result2.affectedRows > 0 && result3.affectedRows > 0) {
        res.send({
          code: 200,
          msg: '退订选课,课程删除成功'
        })
      } else {
        res.status(400).send({
          code: 400,
          msg: '退订选课失败,课程删除失败'
        })
      }
    }
  } else {
    res.status(404).send({
      code: 404,
      msg: '课程删除失败（限选删除失败）'
    })
  }
}
// 删除学生
let removeStudents = async (req, res) => {
  let { id } = req.query;
  let sql = `DELETE
  FROM
    students
  WHERE
    stu_id =?`;
  let sqlArr = [id]
  let result = await dbcongif.SySqlConnect(sql, sqlArr);
  if (result.affectedRows > 0) {
    res.send({
      code: 200,
      msg: '删除学生成功'
    })
  } else {
    res.status(400).send({
      code: 200,
      msg: '该学生有选课，删除学生失败'
    })
  }

}
// 删除老师
let removeTeachers = async (req, res) => {
  let { id } = req.query;
  let sql = `DELETE
  FROM
    teachers
  WHERE
    teacher_id =?`;
  let sqlArr = [id]
  let result = await dbcongif.SySqlConnect(sql, sqlArr);
  if (result) {
    res.send({
      code: 200,
      msg: '删除教师成功'
    })
  } else {
    res.status(400).send({
      code: 200,
      msg: '该教师有课程安排，删除教师失败'
    })
  }

}
module.exports = {
  userLogin,// 用户登录
  addStudents,// 添加学生
  addTeachers,// 添加老师
  addCourse,// 添加课程
  addCourseLimit,// 添加课程限选
  editSudentInfo,// 修改学生信息
  editTeacherInfo,// 修改老师信息
  setPassword,// 修改用户密码
  setCourseInfo,// 修改课程信息
  setCourseLimitInfo,// 修改课程限选
  selectedCourse,// 学生选课
  getUserInfo,// 获取用户信息
  getCourseAllInfo,// 查询课程详情
  getSelectedCourseInfo,// 学生查询已选课程
  getSelectedCourseStudentInfo,// 老师查询已选课程学生信息
  getStudentSelectedCourseInfo,// 学生选课表
  getAllStudentInfo,// 获取所有学生分页
  getAllTeachersInfo,// 获取所有老师分页
  courseUnsubscribe,// 课程退订
  removeCoue,  // 删除课程
  removeStudents,// 删除学生
  removeTeachers// 删除老师
}
