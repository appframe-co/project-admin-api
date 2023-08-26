import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: accessToken } = req.headers;

        const resFetch = await fetch(`${process.env.URL_STRUCTURE_SERVICE}/api/schema_bricks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: accessToken || ''
            }
        });
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({
            data: {error: 'error'}
        });
    }
});

export default router;