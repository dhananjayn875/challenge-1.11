const allowedCategories = ['bug', 'deadline', 'imposter', 'vibe-code']
const maxConfessionTextLength = Number.parseInt(process.env.MAX_CONFESSION_TEXT_LENGTH || '500', 10)
const deleteTokenSecret = process.env.DELETE_TOKEN || ''

const confessionStore = []
let confessionIdCounter = 0

function validateConfessionInput(confessionData) {
  if (!confessionData || typeof confessionData !== 'object') {
    return { ok: false, status: 400, payload: { msg: 'bad request body' } }
  }

  if (!confessionData.text || typeof confessionData.text !== 'string') {
    return { ok: false, status: 400, payload: { msg: 'need text' } }
  }

  const trimmedText = confessionData.text.trim()
  if (trimmedText.length === 0) {
    return { ok: false, status: 400, payload: { msg: 'too short' } }
  }

  if (trimmedText.length > maxConfessionTextLength) {
    return {
      ok: false,
      status: 400,
      payload: { error: `text too big, must be less than ${maxConfessionTextLength} characters long` },
    }
  }

  if (!allowedCategories.includes(confessionData.category)) {
    return { ok: false, status: 400, payload: { msg: 'invalid category' } }
  }

  return { ok: true }
}

function saveConfession(confessionData) {
  const savedConfession = {
    id: ++confessionIdCounter,
    text: confessionData.text.trim(),
    category: confessionData.category,
    created_at: new Date(),
  }

  confessionStore.push(savedConfession)
  return savedConfession
}

function formatConfessionResponse(confession) {
  return {
    id: confession.id,
    text: confession.text,
    category: confession.category,
    created_at: confession.created_at,
  }
}

function createConfession(confessionData) {
  const validationResult = validateConfessionInput(confessionData)
  if (!validationResult.ok) {
    return validationResult
  }

  const savedConfession = saveConfession(confessionData)
  return { ok: true, status: 201, payload: formatConfessionResponse(savedConfession) }
}

function getAllConfessions() {
  // Clone before sorting to avoid mutating shared in-memory state for future reads.
  const sortedConfessions = [...confessionStore].sort((leftConfession, rightConfession) => {
    return rightConfession.created_at - leftConfession.created_at
  })

  return {
    ok: true,
    status: 200,
    payload: {
      data: sortedConfessions.map(formatConfessionResponse),
      count: sortedConfessions.length,
    },
  }
}

function getConfessionById(confessionId) {
  if (Number.isNaN(confessionId)) {
    return { ok: false, status: 400, payload: { msg: 'invalid id' } }
  }

  const selectedConfession = confessionStore.find((confessionItem) => confessionItem.id === confessionId)
  if (!selectedConfession) {
    return { ok: false, status: 404, payload: { msg: 'not found' } }
  }

  return { ok: true, status: 200, payload: formatConfessionResponse(selectedConfession) }
}

function getConfessionsByCategory(categoryName) {
  if (!allowedCategories.includes(categoryName)) {
    return { ok: false, status: 400, payload: { msg: 'invalid category' } }
  }

  // Keep newest first so category filtering matches the main list ordering.
  const filteredConfessions = confessionStore
    .filter((confessionItem) => confessionItem.category === categoryName)
    .slice()
    .reverse()

  return {
    ok: true,
    status: 200,
    payload: filteredConfessions.map(formatConfessionResponse),
  }
}

function deleteConfessionById(confessionId, providedDeleteToken) {
  // Keep delete behind an explicit token because this app has no user auth layer yet.
  if (providedDeleteToken !== deleteTokenSecret) {
    return { ok: false, status: 403, payload: { msg: 'no permission' } }
  }

  if (Number.isNaN(confessionId)) {
    return { ok: false, status: 400, payload: { msg: 'invalid id' } }
  }

  const confessionIndex = confessionStore.findIndex((confessionItem) => confessionItem.id === confessionId)
  if (confessionIndex === -1) {
    return { ok: false, status: 404, payload: { msg: 'not found' } }
  }

  const deletedConfessions = confessionStore.splice(confessionIndex, 1)
  return {
    ok: true,
    status: 200,
    payload: {
      msg: 'ok',
      item: formatConfessionResponse(deletedConfessions[0]),
    },
  }
}

module.exports = {
  createConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfessionById,
}
