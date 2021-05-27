const mysql = require('mysql')

module.exports = {
  // 数据库配置
  config: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'university_course_selection'
  },
  // 连接数据库，使用mysql的连接池连接方式
  // 连接池对象
  sqlConnect: function (sql, sqlArr, callBack) {
    let pool = mysql.createPool(this.config)
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('数据库连接失败');
        return;
      } else {
        console.log('数据库连接成功');
      }
      // 事件驱动回调
      conn.query(sql, sqlArr, callBack);
      // 释放连接
      conn.release();
    })
  },
  //promise回调
  SySqlConnect: function (sySql, sqlArr) {
    return new Promise((resolve, reject) => {
      let pool = mysql.createPool(this.config)
      pool.getConnection((err, conn) => {
        if (err) {
          console.log('数据库连接失败');
          reject(err);
        } else {
          // 事件驱动回调
          conn.query(sySql, sqlArr, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
          // 释放连接
          conn.release();
        }

      })
    }).catch((err) => {
      console.log(err);
    })
  }
}