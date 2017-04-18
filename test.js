const EventParser = require('./EventParser');
const RequestManager = require('./RequestManager');

const filename = process.argv[2];
if (filename === undefined) {
  throw new Error('Provide training filename');
}

const port = process.argv[3];

const eventParser = new EventParser(filename);
const requests = new RequestManager(`http://127.0.0.1:${port}/choice_model/predict`);

const requestPoolSize = 40;

const matches = [0, 0, 0, 0, 0, 0];

let count = 0;
let map = 0.0;

requests.on('failure', function (body, err) {
  console.log(`A request failed with body ${body}`);
  console.log('Querying it again..');
  requests.createNextRequest(body);
});

requests.on('success', function (body, resp) {
  count++;
  const actual = body.event.choice_ids[0];
  const predictions = resp.predictions.map(function (d) {
    return d[0];
  });
  const position = predictions.indexOf(actual);
  if (position >= 0) {
    map += 1/(position + 1);
    matches[position]++;
  } else {
    matches[5]++;
  }
  console.log('-------------------');
  console.log(`actual: ${actual}`);
  console.log(`predictions ${predictions}`);
  console.log(`counts: ${matches}`);
  console.log(`count_ratios: ${matches.map(c => c/count)}`);
  console.log(`map = ${map/count}`);
  createNextRequest();
});

function createNextRequest() {
  const nextEvent = eventParser.getNextEvent();
  if (nextEvent) {
    requests.createNextRequest({
      event: nextEvent,
      max_count: 5
    });
  }
}

for (let i = 0; i < requestPoolSize; i++) {
  createNextRequest();
}







