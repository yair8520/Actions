const { Router } = require("express");
const {
  appendParamsToRequestUrl,
  sendParallelRequests,
  filterErrors,
  findUrlWithMaxPayout,
} = require("../helper/index");

const router = new Router();

router.get("/findWinningBit", (req, res, next) => {
  sendParallelRequests(appendParamsToRequestUrl(req.query), "GET")
    .then((responseArray) => {
      const filteredResponseArray = filterErrors(responseArray);
      if (filteredResponseArray.length > 0) {
        const { url } = findUrlWithMaxPayout(filteredResponseArray);
        res.redirect(url);
      } else {
        const error = new Error("All server calls ended in failure");
        error.status = 500;
        throw error;
      }
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
