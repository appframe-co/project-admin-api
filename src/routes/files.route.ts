import { TErrorResponse, TFile, TInputFile } from '@/types/types';
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

function isErrorFiles(data: TErrorResponse|{files: TFile[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorFilesCount(data: TErrorResponse|{count: number}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorDeletedFile(data: TErrorResponse|{}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorFile(data: TErrorResponse|{file: TFile}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { page=1, limit=10 } = req.query;

        const resFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/files?userId=${userId}&projectId=${projectId}&page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {files: TFile[]}|TErrorResponse = await resFetch.json();

        if (isErrorFiles(data)) {
            throw new Error('Error fetch files count');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.get('/count', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};

        const resFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/files/count?userId=${userId}&projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {count:number}|TErrorResponse = await resFetch.json();

        if (isErrorFilesCount(data)) {
            throw new Error('Error fetch files count');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

type TBodyPost = {
    contentId: string,
    files: TInputFile[]
}
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId } = res.locals as { projectId: string, userId: string };
        let { files, contentId }: TBodyPost = req.body;

        const resFilesFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId, projectId, contentId, files
            })
        });
        const data: {files: TFile[]} = await resFilesFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { id, alt, caption } = req.body;

        if (id !== req.params.id) {
            throw new Error('File ID error');
        }

        const resFetch = await fetch(`${process.env.URL_FILE_SERVICE}/api/files/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({userId, projectId, id, alt, caption})
        });
        const data: {file: TFile}|TErrorResponse = await resFetch.json();

        if (isErrorFile(data)) {
            throw new Error('Error fetch file update');
        }

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