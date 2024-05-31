import express, { Express } from "express";
import config from "./config";
import cookieParser from "cookie-parser";
import routes from "./routes/routes";
const app: Express = express();
const PORT = config.PORT
const HOST = config.HOST

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
