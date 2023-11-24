import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/currencies', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resFetch = await fetch(`${process.env.URL_SYSTEM_SERVICE}/api/currencies`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.get('/languages', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resFetch = await fetch(`${process.env.URL_SYSTEM_SERVICE}/api/languages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;