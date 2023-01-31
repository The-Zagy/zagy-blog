import express from 'express'
import revaldiateHandler from './handlers/revalidate.js';
import seedHandler from './handlers/seed.js';
const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// handlers
app.post('/seed', seedHandler);
app.post('/revalidate', revaldiateHandler);
app.use((_req, res, next) => {
    res.status(404).end();
    next();
});
app.use((err: Error, _req: express.Request, res: express.Response) => {
    console.error('catched error', err);
    res.status(400).end();
});
// start the server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);