const resSend = async (res, status, statusCode, message, data, token = []) => {
  const response = {
    status,
    statusCode,
    message,
    data,
    token,
  };
  res.status(statusCode).json(response);
};

module.exports = {
  resSend,
};
