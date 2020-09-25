if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
  }
  
  const db = require('../../config/mongoose')
  const bcrypt = require('bcryptjs')
  const Record = require("../record")
  const User = require('../user')
  
  const SEED_USER = [{
    name: 'user1', 
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }]
  
  const SEED_RECORD = [
    {
        id: 1,
        name: "麥當勞早餐",
        date: "2020-07-1",
        category: "food",
        amount: "89",
        merchant:"麥當勞"
    },
    {
        id: 2,
        name: "加油",
        date: "2020-07-2",
        category: "transportation",
        amount: "100",
    },
    {
        id: 3,
        name: "電影",
        date: "2020-08-3",
        category: "entertainment",
        amount: "210",
        merchant:"威秀"
    },
    {
        id: 4,
        name: "豪華晚餐",
        date: "2020-08-3",
        category: "food",
        amount: "1000",
    },
    {
        id: 5,
        name: "午餐",
        date: "2020-04-11",
        category: "food",
        amount: "100",
        merchant:"7-11",
    },
    {
        id: 6,
        name: "逗貓棒",
        date: "2020-05-16",
        category: "other",
        amount: "10",
        merchant:"寵物店",
    },
  ]
  
  
  db.once('open', () => {
    const runSeed = (user, index) => {
      return new Promise((resolve) => {
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(user.password, salt))
          .then(hash => {
            User.create({
              name: user.name,
              email: user.email,
              password: hash
            })
              .then(user => {
                const userId = user._id
                Promise.all(Array.from(
                  { length: 3 },
                  (_, i) => Record.create({
                    name: SEED_RECORD[i + index].name,
                    date: SEED_RECORD[i + index].date,
                    category: SEED_RECORD[i + index].category,
                    amount: SEED_RECORD[i + index].amount,
                    merchant: SEED_RECORD[i + index].merchant,
                    userId
                  })
                )).then(() => resolve())
              })
          })
      })
    }
    User.find({ $or: [{ email: SEED_USER[0].email }, { email: SEED_USER[1].email }] })
      .then((user) => {
        Promise.all([runSeed(SEED_USER[0], 0), runSeed(SEED_USER[1], 3)])
          .then(() => {
          console.log('done')
          })
        
      })
  })