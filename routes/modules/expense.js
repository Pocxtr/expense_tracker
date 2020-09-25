const express = require('express')
const router = express.Router()

const Record  = require('../../models/record')




router.get('/new', (req, res) => {
  return res.render('new')
})


router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date,category, amount, merchant } = req.body
  const expense = new Record({
    name,
    date,
    category,
    amount,
    merchant,
    userId
  })
  return expense.save()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      
      let category = {}
      if (record.category === 'housing') {
        category.food = true
      } else if (record.category === 'transportation') {
        category.transportation = true
      } else if (record.category === 'entertainment') {
        category.entertainment = true
      } else if (record.category === 'food') {
        category.food = true
      } else if (record.category === 'other') {
        category.other = true
      }
      return res.render('edit', { record,category})
    })
    .catch(error => console.log(error))
})


router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date,category, amount, merchant } = req.body
  return Record.findOne({ _id, userId })
    .then(record => {
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount
      record.amount = merchant
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => res.render('error'))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
