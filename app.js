const express = require("express");
const { PORT, TIMEOUT } = require("./src/helper/config");
const auctionsRouter = require("./src/routes/auctionsRouter");
var timeout = require("connect-timeout");

const app = express();
app.use(timeout(TIMEOUT));
app.use(haltOnTimedout);

app.use("/auctions", auctionsRouter);

/*
 * error handler
 */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    type: err.error,
    status: err.status,
    message: err.message,
  });
});

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

app.listen(PORT, () => {
  console.log(`App runing on http://localhost:${PORT}`);
});

/*
 * url for testing: http://localhost:5000/auctions/findWinningBit?campaignid=&url=www.one.co.il&clickid=democlickid
 * npm run dev   -> will install and run start
 * npm run start -> will run "nodemon app.js"
 */
