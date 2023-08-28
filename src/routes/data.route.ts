import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: accessToken } = req.headers;
        const { structureId } = req.query;

        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data?structureId=${structureId}`, {
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

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: accessToken } = req.headers;
        let body = req.body;

        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: accessToken || ''
            }, 
            body: JSON.stringify(body)
        });
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({
            data: {error: 'error'}
        });
    }
});

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: accessToken } = req.headers;
        let body = req.body;

        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: accessToken || ''
            }, 
            body: JSON.stringify(body)
        });
        const data = await resFetch.json();

        res.json(data);
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

        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data/${id}`, {
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

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: accessToken } = req.headers;
        const { id } = req.params;

        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data/${id}`, {
            method: 'DELETE',
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