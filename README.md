# Choice Model Expedia Client

## Getting the code
```bash
git clone https://github.com/chetanism/choice-model-expedia-client.git
cd choice-model-expedia-client
```

## Install dependencies
```bash
npm i
```

## Get training and testing data
Get the data from me

## Running the client
### Push training events
```bash
node train.js <training-data-file-path> <port>
```
`training-data-file-path`: Specify the path of the training data file
`port`: Specify the port on which choice model server is running locally

### Test events
```bash
node test.js <test-data-file-path> <port>
```
`test-data-file-path`: Specify the path of the test data file
`port`: Specify the port on which choice model server is running locally

