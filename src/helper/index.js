const urlObject = require("url");
const { SERVER_AUCTIONS_URL, NUM_OF_REQUEST } = require("./config");
var ParallelRequest = require("parallel-http-request");

/*
 * append req.query to the generic path to create  the  url
 */
const appendParamsToRequestUrl = ({ campaignid, url, clickid }) => {
  const { host } = urlObject.parse(url, false);
  const urlWithParams = new URL(SERVER_AUCTIONS_URL);

  urlWithParams.searchParams.append("campaignid", campaignid);
  urlWithParams.searchParams.append("url", url);
  urlWithParams.searchParams.append("clickid", clickid);
  urlWithParams.searchParams.append("domain", host);

  return urlWithParams;
};
/*
 * send parallel requests to the return url from the fuction above appendParamsToRequestUrl()
 */
const sendParallelRequests = ({ href }, method) => {
  const request = fillRequestsArray({
    href: href,
    request: new ParallelRequest(),
    method: method,
  });
  return new Promise((resolve, reject) => {
    request.send((responseArray) => {
      if (responseArray.length == 0) {
        return reject({
          error: "no content HTTP",
          status: 204,
        });
      } else {
        resolve(responseArray);
      }
    });
  });
};
/*
 * sort the  responses array from top to bottom and return the max payout.url
 */
const findUrlWithMaxPayout = (responseArray) => {
  return responseArray.sort((a, b) => b.body.payout - a.body.payout)[0].body;
};

/*
 * return the  responses array without failed requasts (status!=200)
 */
const filterErrors = (responseArray) => {
  return responseArray.filter((obj) => obj.status == 200);
};

/*
 * return the  request object with the parallel NUM_OF_REQUEST
 */
const fillRequestsArray = ({ href, request, method }) => {
  for (let i = 0; i < NUM_OF_REQUEST; i++) {
    request.add({ url: href, method: method });
  }
  return request;
};
module.exports = {
  appendParamsToRequestUrl,
  sendParallelRequests,
  filterErrors,
  findUrlWithMaxPayout,
};
