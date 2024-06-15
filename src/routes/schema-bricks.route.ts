import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resFetch = await fetch(`${process.env.URL_SYSTEM_SERVICE}/api/schema_bricks`, {
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