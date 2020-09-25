
const express = require('express')
const router = express.Router()

const Record = require('../../models/record')



router.get('/', (req, res) => {
  
  let categorySelected = {}
  let category = ''
  if (req.query.category === 'housing') {
      categorySelected.housing = true
      category = 'housing'
  } else if (req.query.category === 'transportation') {
      categorySelected.transportation = true
      category = 'transportation'
  } else if (req.query.category === 'entertainment') {
      categorySelected.entertainment = true
      category =  'entertainment'
  } else if (req.query.category === 'food') {
      categorySelected.food = true
      category = 'food'
  } else if (req.query.category === 'other') {
      categorySelected.other = true
      category = 'other'
  }
  
  
  let dateInput = req.query.date
  let month = ''
  let year = ''
  if (dateInput) {
      month =  dateInput.slice(5, 7)
      year = dateInput.slice(0, 4)
  }

  
  let findSetting = {}
  let queryCategory = req.query.category || ''
  let queryDate = req.query.date || ''
  findSetting.userId = req.user._id
  if (queryCategory) {
      findSetting.category = category
  } else if (queryDate) {
      findSetting.date = {
              $gte: new Date(`${year}-${month}-01`) ,
              $lte: new Date(`${year}-${month}-31`)
      }
  }

  
  Record.find(findSetting)
      .sort({date: 'desc'})
      .exec((err, allRecords) => {
          if (err) return console.log(err)
          let newAllRecords = []
          let totalAmount = 0
          allRecords.forEach((eachRecord)=>{
              let yy = eachRecord.date.getFullYear()
              let mm = eachRecord.date.getMonth() + 1
              let dd = eachRecord.date.getDate()
              let eachRecordInObject = {
                  _id:eachRecord._id,
                  name: eachRecord.name,
                  category: eachRecord.category,
                  date: eachRecord.date,
                  amount: eachRecord.amount,
                  merchant:eachRecord.merchant,
                  userId: eachRecord.userId,
                  shortDate: `${yy}-${mm}-${dd}`
              }
              
              
              if (eachRecord.category === 'housing') {
                  eachRecordInObject.icon = '<i class="col-2 fas fa-home col-2" style="font-size: 50px"></i>'
              } else if (eachRecord.category === 'transportation') {
                  eachRecordInObject.icon = '<i class="col-2 fas fa-shuttle-van" style="font-size: 50px"></i>'
              } else if (eachRecord.category === 'entertainment') {
                  eachRecordInObject.icon = '<i class="col-2 fas fa-grin-beam" style="font-size: 50px"></i>'
              } else if (eachRecord.category === 'food') {
                  eachRecordInObject.icon = '<i class="col-2 fas fa-utensils" style="font-size: 50px"></i>'
              } else if (eachRecord.category === 'other') {
                  eachRecordInObject.icon = '<i class="col-2 fas fa-pen" style="font-size: 50px"></i>'
              }
              totalAmount += eachRecord.amount
              newAllRecords.push(eachRecordInObject)
          })
          return res.render('index', {
              records: newAllRecords,
              totalAmount: totalAmount,
              categorySelected: categorySelected,
              dateInput: dateInput
          })       
      })       
})

module.exports = router
