import express, { Request, Response, NextFunction } from 'express';
import { TErrorResponse, TSection } from '@/types/types';

const router = express.Router();

function isErrorSections(data: TErrorResponse|{sections: TSection[], names: string[], codes: string[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorSectionsCount(data: TErrorResponse|{count: number}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorSection(data: TErrorResponse|{section: TSection}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorDeletedSection(data: TErrorResponse|{}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { structureId, page=1, limit=10, parentId } = req.query;

        let q = `userId=${userId}&projectId=${projectId}&structureId=${structureId}&page=${page}&limit=${limit}`;
        if (parentId) {
            q += `&parent_id=${parentId}`;
        }

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/sections?${q}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {sections: TSection[], names: string[], codes: string[]}|TErrorResponse = await resFetch.json();

        if (isErrorSections(data)) {
            throw new Error('Error fetch sections');
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

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/sections/count?userId=${userId}&projectId=${projectId}&structureId=${structureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {count:number}|TErrorResponse = await resFetch.json();

        if (isErrorSectionsCount(data)) {
            throw new Error('Error fetch sections count');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { doc, structureId, parentId } = req.body;

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/sections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({userId, projectId, structureId, parentId, doc})
        });
        const data: {sections: TSection|null, userErrors: any} = await resFetch.json();

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
            throw new Error('Section ID error');
        }

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/sections/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({id, userId, projectId, structureId, doc})
        });
        const data: {section: TSection}|TErrorResponse = await resFetch.json();

        if (isErrorSection(data)) {
            throw new Error('Error fetch section update');
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

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/sections/${id}?userId=${userId}&projectId=${projectId}&structureId=${structureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {section: TSection}|TErrorResponse = await resFetch.json();

        if (isErrorSection(data)) {
            throw new Error('Error fetch section');
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

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/sections/${id}?userId=${userId}&projectId=${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {}|TErrorResponse = await resFetch.json();

        if (isErrorDeletedSection(data)) {
            throw new Error('Error fetch section delete');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});


export default router;