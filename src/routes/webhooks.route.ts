import { TAlert, TErrorResponse } from '@/types/types';
import { getDateV2 } from '@/utils/date';
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

function isErrorAlert(data: TErrorResponse|{alert: TAlert}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

router.post('/alert', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};

        const resFetch = await fetch(`${process.env.URL_WEBHOOKS}/alert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, projectId })
        });
        if (!resFetch.ok) {
            throw new Error('error');
        }

        const dataJson: TErrorResponse|{alert: TAlert} = await resFetch.json();
        if (isErrorAlert(dataJson)) {
            return res.json({alert: null});
        }

        const alert = dataJson.alert;

        const output = {
            id: alert.id,
            userId: alert.userId,
            projectId: alert.projectId,
            structureId: alert.structureId,
            message: alert.message,
            subjectId: alert.subjectId,
            subjectType: alert.subjectType,
            read: alert.read,
            createdAt: getDateV2(alert.createdAt)
        };

        res.json({alert: output});
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;