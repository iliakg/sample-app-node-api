module.exports = (res, error) => {
  if (error.name === 'ValidationError') {
    let errors = []

    for (field in error.errors) {
      errors.push({path: field, message: error.errors[field].message})
    }
    res.status(422).json(errors)
  } else if (error.name === 'NotFoundError') {
    res.status(404).json([{path: 'not_found', message: error.message}])
  } else {
    res.status(500).json([{
      path: 'critical',
      message: error.message ? error.message : error
    }])
  }
}
