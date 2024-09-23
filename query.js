//1.Find all the topics and tasks which are thought in the month of October
db.users.aggregate([
    {
      '$unwind': {
        'path': '$topics'
      }
    }, {
      '$match': {
        'topics.date': {
          '$gte': new Date('Thu, 01 Oct 2020 00:00:00 GMT'), 
          '$lt': new Date('Sun, 01 Nov 2020 00:00:00 GMT')
        }
      }
    }, {
      '$group': {
        '_id': '$topics.topic_name', 
        'tasks': {
          '$addToSet': '$topics.task.task_name'
        }
      }
    }
  ]);

//2.Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020
db.users.aggregate([
    {
      '$unwind': {
        'path': '$company_drives'
      }
    }, {
      '$group': {
        '_id': '$company_drives.company_name', 
        'date': {
          '$addToSet': '$company_drives.drive_date'
        }
      }
    }, {
      '$match': {
        'date': {
          '$gte': new Date('Thu, 15 Oct 2020 00:00:00 GMT'), 
          '$lt': new Date('Sun, 01 Nov 2020 00:00:00 GMT')
        }
      }
    }
  ]);

//3.Find all the company drives and students who are appeared for the placement.
db.users.aggregate([
    {
      '$unwind': {
        'path': '$company_drives'
      }
    }, {
      '$group': {
        '_id': '$company_drives.company_name', 
        'candidate': {
          '$addToSet': '$student_name'
        }
      }
    }
  ]);

//4.Find the number of problems solved by the user in codekata
db.users.find({},{"student_name":1,"codekata.solved_problem":1});

//5.Find all the mentors with who has the mentee's count more than 15
db.users.aggregate([
    {
      '$group': {
        '_id': '$mentor'
      }
    }, {
      '$match': {
        '_id.total_batches': {
          '$gt': 15
        }
      }
    }
  ]);

//6.Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020
db.users.aggragate([
    {
      '$match': {
        'attendance.leave_date': {
          '$elemMatch': {
            '$gte': new Date('Thu, 15 Oct 2020 00:00:00 GMT'), 
            '$lte': new Date('Sat, 31 Oct 2020 00:00:00 GMT')
          }
        }
      }
    }, {
      '$unwind': {
        'path': '$topics'
      }
    }, {
      '$match': {
        'topics.task.status': 'not completed'
      }
    }, {
      '$group': {
        '_id': '$student_name', 
        'absent_date': {
          '$addToSet': '$attendance.leave_date'
        }, 
        'pending_task': {
          '$addToSet': '$topics.task'
        }
      }
    }
  ]);

//Count of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020
  db.users.aggregate([
    {
      '$match': {
        'attendance.leave_date': {
          '$elemMatch': {
            '$gte': new Date('Thu, 15 Oct 2020 00:00:00 GMT'), 
            '$lte': new Date('Sat, 31 Oct 2020 00:00:00 GMT')
          }
        }
      }
    }, {
      '$unwind': {
        'path': '$topics'
      }
    }, {
      '$match': {
        'topics.task.status': 'not completed'
      }
    }, {
      '$group': {
        '_id': '$student_name', 
        'absent_date': {
          '$addToSet': '$attendance.leave_date'
        }, 
        'pending_task': {
          '$addToSet': '$topics.task'
        }
      }
    }, {
      '$count': 'users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020'
    }
  ]);