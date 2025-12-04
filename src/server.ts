import app from "./app/app";
import config from "./config";

const port = config.port;
app.listen(port, () => {
  console.log(`listen here ${port}`);
});
