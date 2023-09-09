import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId } = res.locals as { projectId: string, userId: string };
        let { files } = req.body;

        const resFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/staged_uploads_create?userId=${userId}&projectId=${projectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({ files })
        });
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;