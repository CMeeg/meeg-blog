const trimObject = function (object: {
  [key: string | number | symbol]: unknown
}) {
  const trimmedObject = Object.assign({}, object)

  // Remove empty keys
  Object.keys(trimmedObject).forEach(
    (key) => !trimmedObject[key] && delete trimmedObject[key]
  )

  return trimmedObject
}

export { trimObject }
