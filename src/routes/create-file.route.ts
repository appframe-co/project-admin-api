import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId } = res.locals as { projectId: string, userId: string };
        let { files, structureId } = req.body;

        const resImagesFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/upload_file`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId, projectId, structureId, files
            })
        });
        const data = await resImagesFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;