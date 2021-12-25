const defaultMessage = (_req, part) => {
    return `${_req} ${part} field is required`
}

const requiredFields = (req, res, part, required, message=defaultMessage) => {
  let fields = {};
  for (let _req of required) {
    if (!req[part][_req]) {
      return res.status(400).json({
        error: message(_req, part)
      });
    }
    fields[_req] = req[part][_req];
    }
    return fields
};

module.exports = requiredFields