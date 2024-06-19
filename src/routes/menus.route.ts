import { TErrorResponse, TMenu, TPlan } from '@/types/types';
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

function isErrorMenus(data: TErrorResponse|{menus: TMenu[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorCount(data: TErrorResponse|{count: number}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorDeletedMenu(data: TErrorResponse|{}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { page=1, limit=10 } = req.query;

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/menus?userId=${userId}&projectId=${projectId}&page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {menus: TMenu[]}|TErrorResponse = await resFetch.json();

        if (isErrorMenus(data)) {
            throw new Error('Error fetch menus count');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.get('/count', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/menus/count?userId=${userId}&projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {count:number}|TErrorResponse = await resFetch.json();

        if (isErrorCount(data)) {
            throw new Error('Error fetch menus count');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId, plan } = res.locals as {userId: string, projectId: string, plan: TPlan};
        let { name, code, items } = req.body;

        const feature = plan.features.find(f => f.code === 'menus');
        if (feature) {
            let q = `userId=${userId}&projectId=${projectId}`;
            const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/menus/count?${q}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: TErrorResponse|{count:number} = await resFetch.json();
            if (isErrorCount(data)) {
                throw new Error('error count menus');
            }

            if (data.count >= feature.rules.limit) {
                return res.json({error: 'plan_limited', description: `Current plan "${plan.name}" is not supported new menu. Please, upgrade your plan.`});
            }
        }

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/menus?userId=${userId}&projectId=${projectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({ name, code, items })
        });
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { id } = req.body;

        if (id !== req.params.id) {
            throw new Error('Menu ID error');
        }

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/menus/${id}?userId=${userId}&projectId=${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(req.body)
        });
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { id } = req.params;

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/menus/${id}?userId=${userId}&projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { id } = req.params;

        const resFetch = await fetch(`${process.env.URL_MENU_SERVICE}/api/menus/${id}?userId=${userId}&projectId=${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {}|TErrorResponse = await resFetch.json();

        if (isErrorDeletedMenu(data)) {
            throw new Error('Error fetch menu delete');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;