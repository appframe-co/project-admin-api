import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId } = res.locals as { projectId: string, userId: string };
        let { mediaS3Urls } = req.body;

        const resImagesFetch = await fetch(`${process.env.URL_STORAGE_SERVICE}/api/delete_media_s3`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId, 
                mediaS3Urls
            })
        });
        const data = await resImagesFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;