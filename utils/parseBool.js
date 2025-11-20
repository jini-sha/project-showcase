function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return false;
}

module.exports = { parseBoolean };
