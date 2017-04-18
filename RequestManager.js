const EventEmitter = require('events');
const request = require('request-promise');

class RequestManager extends EventEmitter {
  constructor(url, logErrors = true) {
    super();
    this.url = url;
    this.openRequestCount = 0;
    this.errorCount = 0;
    this.successCount = 0;
    this.requestSucceeded = this.requestSucceeded.bind(this);
    this.requestFailed = this.requestFailed.bind(this);
    this.logErrors = logErrors;
  }

  printStatus() {
    console.log(
      `ErrorCount: ${this.errorCount} | successCount: ${this.successCount} | openRequests: ${this.openRequestCount}`
    );
  }

  createNextRequest(body) {
    this.postRequest(body)
      .then((resp) => {
        this.requestSucceeded(body, resp);
      })
      .catch((err) => {
        this.requestFailed(body, err);
      });
    this.openRequestCount++;
  };

  requestCompleted() {
    this.openRequestCount--;
    this.emit('completed', this.openRequestCount)
  }

  requestSucceeded(body, resp) {
    this.successCount++;
    this.emit('success', body, resp);
    this.requestCompleted();
  };

  requestFailed(body, err) {
    this.errorCount++;
    if (this.logErrors) {
      console.log(err);
    }
    this.emit('failure', body, err);
    this.requestCompleted();
  };

  postRequest(body) {
    return request({
      url: this.url,
      method: 'POST',
      json: true,
      body: body
    })
  }
}

module.exports = RequestManager;
