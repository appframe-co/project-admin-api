import { TErrorResponse, TPlan } from '@/types/types';
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

function isErrorCount(data: TErrorResponse|{count:number}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId, plan } = res.locals as {userId: string, projectId: string, plan: TPlan};

        let q = `userId=${userId}&projectId=${projectId}`;

        const feature = plan.features.find(f => f.code === 'contents');
        if (feature) {
            const {limit} = feature.rules;
            q += `&limit=${limit}`;
        }

        const resFetch = await fetch(`${process.env.URL_CONTENT_SERVICE}/api/contents?${q}`, {
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

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId, plan } = res.locals as {userId: string, projectId: string, plan: TPlan};
        let { name, code, entries } = req.body;

        const feature = plan.features.find(f => f.code === 'contents');
        if (feature) {
            let q = `userId=${userId}&projectId=${projectId}`;
            const resFetch = await fetch(`${process.env.URL_CONTENT_SERVICE}/api/contents/count?${q}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: TErrorResponse|{count:number} = await resFetch.json();
            if (isErrorCount(data)) {
                throw new Error('error count contents');
            }

            if (data.count >= feature.rules.limit) {
                return res.json({error: 'plan_limited', description: `Current plan "${plan.name}" is not supported new content. Please, upgrade your plan.`});
            }
        }

        const sections = {
            fields: [
                {
                    name: 'Name',
                    key: 'name',
                    type: 'single_line_text',
                    validations: [
                        {
                            code: 'required',
                            type: 'checkbox',
                            value: true
                        }
                    ],
                    system: true
                },
                {
                    name: 'Code',
                    key: 'code',
                    type: 'url_handle',
                    validations: [
                        {
                            code: 'field_reference',
                            type: 'text',
                            value: ''
                        },
                        {
                            code: 'transliteration',
                            type: 'checkbox',
                            value: true
                        }
                    ],
                    system: true
                },
            ]
        }

        const resFetch = await fetch(`${process.env.URL_CONTENT_SERVICE}/api/contents?userId=${userId}&projectId=${projectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({ name, code, entries, sections })
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
            throw new Error('Content ID error');
        }

        const resFetch = await fetch(`${process.env.URL_CONTENT_SERVICE}/api/contents/${id}?userId=${userId}&projectId=${projectId}`, {
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

        const resFetch = await fetch(`${process.env.URL_CONTENT_SERVICE}/api/contents/${id}?userId=${userId}&projectId=${projectId}`, {
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

export default router;