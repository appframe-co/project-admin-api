import express, { Request, Response, NextFunction } from 'express';
import { TEntry, TErrorResponse } from '@/types/types';

const router = express.Router();

function isErrorEntries(data: TErrorResponse|{entries: TEntry[], names: string[], codes: string[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorEntriesCount(data: TErrorResponse|{count: number}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorEntry(data: TErrorResponse|{entry: TEntry}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorDeletedEntry(data: TErrorResponse|{}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { structureId, page=1, limit=10 } = req.query;

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/entries?userId=${userId}&projectId=${projectId}&structureId=${structureId}&page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {entries: TEntry[], names: string[], codes: string[]}|TErrorResponse = await resFetch.json();

        if (isErrorEntries(data)) {
            throw new Error('Error fetch entries');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.get('/count', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { structureId } = req.query;

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/entries/count?userId=${userId}&projectId=${projectId}&structureId=${structureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {count:number}|TErrorResponse = await resFetch.json();

        if (isErrorEntriesCount(data)) {
            throw new Error('Error fetch entries count');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { doc, structureId } = req.body;

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({userId, projectId, structureId, doc})
        });
        const data: {entry: TEntry|null, userErrors: any} = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { doc, structureId, id } = req.body;

        if (id !== req.params.id) {
            throw new Error('Entry ID error');
        }

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/entries/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({id, userId, projectId, structureId, doc})
        });
        const data: {entry: TEntry}|TErrorResponse = await resFetch.json();

        if (isErrorEntry(data)) {
            throw new Error('Error fetch entry update');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { id } = req.params;
        const { structureId } = req.query;

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/entries/${id}?userId=${userId}&projectId=${projectId}&structureId=${structureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {entry: TEntry}|TErrorResponse = await resFetch.json();

        if (isErrorEntry(data)) {
            throw new Error('Error fetch entry');
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

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/entries/${id}?userId=${userId}&projectId=${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {}|TErrorResponse = await resFetch.json();

        if (isErrorDeletedEntry(data)) {
            throw new Error('Error fetch entry delete');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;