import { TErrorResponse, TPlan } from '@/types/types';
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

function isErrorTotal(data: TErrorResponse|{total:number}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId, plan } = res.locals as { projectId: string, userId: string, plan: TPlan };
        let { files } = req.body;

        const feature = plan.features.find(f => f.code === 'files');
        if (feature) {
            let q = `userId=${userId}&projectId=${projectId}`;
            const resFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/files/total?${q}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: TErrorResponse|{total:number} = await resFetch.json();
            if (isErrorTotal(data)) {
                throw new Error('error total files');
            }

            const totalMB = Number.parseFloat((data.total/(1024*1024)).toFixed(2));
            if (totalMB >= feature.rules.limit) {
                return res.json({error: `Current plan "${plan.name}" is not supported upload new files. Please, upgrade your plan.`});
            }
        }

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