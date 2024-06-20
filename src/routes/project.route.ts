import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId } = res.locals as { projectId: string, userId: string };

        const resFetch = await fetch(`${process.env.URL_PROJECT_SERVICE}/api/projects/${projectId}?userId=${userId}`, {
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

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId } = res.locals as { projectId: string, userId: string };
        let { id, name, currencies, languages, front } = req.body;

        if (projectId !== req.params.id || projectId !== id) {
            throw new Error('Project ID error');
        }

        const resFetch = await fetch(`${process.env.URL_PROJECT_SERVICE}/api/projects/${id}?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({ id, name, currencies, languages, front})
        });
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});


export default router;