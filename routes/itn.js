const {
    add,
    book,
    itns
} = require("../controller/itn")

const router = require("express").Router()

router.post('/add', add)
router.put('/book', book)
router.get('/', itns)

module.exports = router