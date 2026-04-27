const confessionService = require('../services/confessionService')

function createConfession(req, res) {
  const confessionData = req.body
  const apiResponse = confessionService.createConfession(confessionData)

  if (!apiResponse.ok) {
    return res.status(apiResponse.status).json(apiResponse.payload)
  }

  return res.status(201).json(apiResponse.payload)
}

function getAllConfessions(req, res) {
  const apiResponse = confessionService.getAllConfessions()
  return res.status(apiResponse.status).json(apiResponse.payload)
}

function getConfessionById(req, res) {
  const confessionId = Number.parseInt(req.params.id, 10)
  const apiResponse = confessionService.getConfessionById(confessionId)
  return res.status(apiResponse.status).json(apiResponse.payload)
}

function getConfessionsByCategory(req, res) {
  const categoryName = req.params.cat
  const apiResponse = confessionService.getConfessionsByCategory(categoryName)
  return res.status(apiResponse.status).json(apiResponse.payload)
}

function deleteConfessionById(req, res) {
  const confessionId = Number.parseInt(req.params.id, 10)
  const deleteToken = req.headers['x-delete-token']
  const apiResponse = confessionService.deleteConfessionById(confessionId, deleteToken)
  return res.status(apiResponse.status).json(apiResponse.payload)
}

module.exports = {
  createConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfessionById,
}
