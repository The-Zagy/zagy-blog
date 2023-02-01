import express, { NextFunction } from 'express'
import revaldiateHandler from './handlers/revalidate';
import seedHandler from './handlers/seed';
const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// handlers
app.post('/seed', seedHandler);
app.post('/revalidate', revaldiateHandler);
// since the req reached here means no route matching == 404
app.use((_req, res, _next) => {
    res.status(404).end();
});
// only will get here with the next(Err)
app.use((err: Error, _req: express.Request, res: express.Response, _next: NextFunction) => {
    console.error('catched error', err.message);
    res.status(500).end();
});
// start the server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);