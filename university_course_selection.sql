/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2020/11/23 0:55:23                           */
/*==============================================================*/


drop table if exists course_limit;

drop table if exists courses;

drop table if exists student_course;

drop table if exists students;

drop table if exists teachers;

/*==============================================================*/
/* Table: course_limit                                          */
/*==============================================================*/
create table course_limit
(
   id                   int not null,
   course_id            bigint not null,
   majorlimit           varchar(255),
   majorlimitcode       int,
   classlimit           int,
   primary key (id)
);

/*==============================================================*/
/* Table: courses                                               */
/*==============================================================*/
create table courses
(
   course_id            bigint not null,
   coursename           varchar(0),
   teacher_id           bigint,
   teacher              varchar(0),
   department           varchar(0),
   selectednumber       int,
   numberlimit          int,
   primary key (course_id)
);

/*==============================================================*/
/* Table: student_course                                        */
/*==============================================================*/
create table student_course
(
   stu_id               bigint not null,
   course_id            bigint not null,
   primary key (stu_id, course_id)
);

/*==============================================================*/
/* Table: students                                              */
/*==============================================================*/
create table students
(
   stu_id               bigint not null,
   name                 varchar(100),
   sex                  varchar(100),
   major                varchar(100),
   majorcode            int,
   classes              int,
   department           varchar(100),
   password             varchar(100),
   role                 int,
   primary key (stu_id)
);

/*==============================================================*/
/* Table: teachers                                              */
/*==============================================================*/
create table teachers
(
   teacher_id           bigint not null,
   name                 varchar(100),
   sex                  varchar(100),
   department           varchar(100),
   password             varchar(100),
   role                 int,
   primary key (teacher_id)
);

alter table course_limit add constraint FK_Reference_3 foreign key (course_id)
      references courses (course_id) on delete restrict on update restrict;

alter table courses add constraint FK_Reference_4 foreign key (teacher_id)
      references teachers (teacher_id) on delete restrict on update restrict;

alter table student_course add constraint FK_Reference_1 foreign key (stu_id)
      references students (stu_id) on delete restrict on update restrict;

alter table student_course add constraint FK_Reference_2 foreign key (course_id)
      references courses (course_id) on delete restrict on update restrict;

