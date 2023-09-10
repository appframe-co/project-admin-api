import { TErrorResponse, TFile } from '@/types/types';
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

function isErrorDeletedFile(data: TErrorResponse|{}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};

        const resFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/files?userId=${userId}&projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {files: TFile[]} = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId } = res.locals as { projectId: string, userId: string };
        let { files, structureId } = req.body;

        const resFilesFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId, projectId, structureId, files
            })
        });
        const data = await resFilesFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { id } = req.params;

        const resFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/files/${id}?userId=${userId}&projectId=${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {}|TErrorResponse = await resFetch.json();

        if (isErrorDeletedFile(data)) {
            throw new Error('Error fetch file delete');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;