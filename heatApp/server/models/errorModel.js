class HttpError extends Error {
  // creates new class that inerits Error
  constructor(message, errorCode) {
    super(message); // calls Error constructor to set message
    this.code = errorCode; // adds code property
  }
}

module.exports = HttpError;
