'use strict';

var express = require('express');
var router = express.Router();

// drawings routes use drawings controller
var drawingController = require('../controllers/drawingController');

router.post('/', drawingController.create);
router.get('/', drawingController.all);
router.get('/:drawingId', drawingController.findById);
router.delete('/:drawingId', drawingController.deleteById);

module.exports = router;

