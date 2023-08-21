import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: accessToken } = req.headers;

        const resFetch = await fetch(`${process.env.URL_STRUCTURE_SERVICE}/api/structures`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: accessToken || ''
            }
        });
        const { data } = await resFetch.json();

        const response = {
            status: 200,
            data,
            message: null
        };
        res.json(response);
    } catch (e) {
        res.json({
            data: {error: 'error'}
        });
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: accessToken } = req.headers;
        let { name, code } = req.body;

        const resFetch = await fetch(`${process.env.URL_STRUCTURE_SERVICE}/api/structures`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: accessToken || ''
            }, 
            body: JSON.stringify({ name, code })
        });
        const { data } = await resFetch.json();

        const response = {
            status: 200,
            data,
            message: null
        };
        res.json(response);
    } catch (e) {
        res.json({
            data: {error: 'error'}
        });
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: accessToken } = req.headers;
        const { id } = req.params;

        const resFetch = await fetch(`${process.env.URL_STRUCTURE_SERVICE}/api/structures/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: accessToken || ''
            }
        });
        const { data } = await resFetch.json();

        const response = {
            status: 200,
            data,
            message: null
        };
        res.json(response);
    } catch (e) {
        res.json({
            data: {error: 'error'}
        });
    }
});

export default router;