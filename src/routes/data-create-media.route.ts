import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId } = res.locals as { projectId: string, userId: string };
        let { dataId, media, structureId } = req.body;

        const outputImagesFields: any = {};
        for (const imagesField of Object.keys(media)) {
            const resImagesFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId, projectId, structureId, 
                    subjectType: 'data', subjectId: dataId, subjectField: imagesField, 
                    images: media[imagesField]
                })
            });
            const {images} = await resImagesFetch.json();

            outputImagesFields[imagesField] = images;
        }

        res.json({media: outputImagesFields});
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;