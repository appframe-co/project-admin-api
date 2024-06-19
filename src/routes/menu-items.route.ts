import express, { Request, Response, NextFunction } from 'express';
import { TErrorResponse, TItem } from '@/types/types';

const router = express.Router();

function isErrorItems(data: TErrorResponse|{items: TItem[], names: string[], codes: string[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorItemsCount(data: TErrorResponse|{count: number}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorItem(data: TErrorResponse|{item: TItem}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorDeletedItem(data: TErrorResponse|{}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { menuId, page=1, limit=10, parentId } = req.query;

        let q = `userId=${userId}&projectId=${projectId}&menuId=${menuId}&page=${page}&limit=${limit}`;
        if (parentId) {
            q += `&parent_id=${parentId}`;
        }

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/items?${q}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {items: TItem[], names: string[], codes: string[]}|TErrorResponse = await resFetch.json();

        if (isErrorItems(data)) {
            throw new Error('Error fetch items');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.get('/count', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { menuId } = req.query;

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/items/count?userId=${userId}&projectId=${projectId}&menuId=${menuId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {count:number}|TErrorResponse = await resFetch.json();

        if (isErrorItemsCount(data)) {
            throw new Error('Error fetch items count');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { subject, subjectId, doc, menuId, parentId } = req.body;

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({userId, projectId, menuId, parentId, doc, subject, subjectId})
        });
        const data: {item: TItem|null, userErrors: any} = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { subject, subjectId, doc, menuId, id } = req.body;

        if (id !== req.params.id) {
            throw new Error('Item ID error');
        }

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({id, userId, projectId, menuId, doc, subject, subjectId})
        });
        const data: {item: TItem}|TErrorResponse = await resFetch.json();

        if (isErrorItem(data)) {
            throw new Error('Error fetch item update');
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
        const { menuId } = req.query;

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/items/${id}?userId=${userId}&projectId=${projectId}&menuId=${menuId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {item: TItem}|TErrorResponse = await resFetch.json();

        if (isErrorItem(data)) {
            throw new Error('Error fetch item');
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

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/items/${id}?userId=${userId}&projectId=${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {}|TErrorResponse = await resFetch.json();

        if (isErrorDeletedItem(data)) {
            throw new Error('Error fetch item delete');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;