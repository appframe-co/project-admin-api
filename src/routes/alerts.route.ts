import express, { Request, Response, NextFunction } from 'express';
import { TAlert, TErrorResponse } from '@/types/types';
import { getDateV2 } from '@/utils/date';

const router = express.Router();

function isErrorAlerts(data: TErrorResponse|{alerts: TAlert[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { page=1, limit=10 } = req.query;

        const resFetch = await fetch(`${process.env.URL_NOTIFICATON_SERVICE}/api/alerts?userId=${userId}&projectId=${projectId}&page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {alerts: TAlert[]}|TErrorResponse = await resFetch.json();

        if (isErrorAlerts(data)) {
            throw new Error('Error fetch alerts');
        }

        const output = data.alerts.map(alert => {
            let link = null;
            if (alert.subjectType === 'entries') {
                link = `/structures/${alert.structureId}/entries/${alert.subjectId}`;
            }

            return {
                id: alert.id,
                message: alert.message,
                read: alert.read,
                createdAt: getDateV2(alert.createdAt),
                link
            };
        });
        res.json({alerts: output});
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = res.locals as { userId: string, projectId: string };
        let { id, read } = req.body;

        const resFetch = await fetch(`${process.env.URL_NOTIFICATON_SERVICE}/api/alerts/${id}?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({ id, read})
        });
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});


export default router;