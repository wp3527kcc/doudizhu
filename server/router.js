	const express = require('express')
	const router = express.Router()
	const { db } = require('./public/js/method')
	const fs = require('fs')
	const bodyParser = require('body-parser');
	const urlencodedParser = bodyParser.urlencoded({ extended: false });
	router.use(urlencodedParser)
router



module.exports = router
