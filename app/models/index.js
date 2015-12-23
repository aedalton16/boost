// require()ing this directory only has the side effect of populating
// mongoose with all of our models. You'll get an object containing
// all of the models, but you should grab the model with 
// mongoose.model('Model')
module.exports = {
  User: require('./User'),
  Drawing: require('./drawingModel')
};
