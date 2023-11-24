import express, { Request, Response, NextFunction } from 'express';
import { TEntry, TErrorResponse, TTranslation } from '@/types/types';

const router = express.Router();

function isErrorTranslations(data: TErrorResponse|{translations: TTranslation[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorTranslation(data: TErrorResponse|{translation: TTranslation}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { structureId, subjectId, subject, lang } = req.query;

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/translations?userId=${userId}&projectId=${projectId}&structureId=${structureId}&subjectId=${subjectId}&subject=${subject}&lang=${lang}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {translations: TTranslation[]}|TErrorResponse = await resFetch.json();

        if (isErrorTranslations(data)) {
            throw new Error('Error fetch translations');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { structureId, subjectId, subject, key, value, lang } = req.body;

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/translations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({userId, projectId, structureId, subjectId, lang, subject, key, value})
        });
        const data: {translation: TTranslation|null, userErrors: any} = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { id, structureId, subjectId, subject, key, value, lang } = req.body;

        if (id !== req.params.id) {
            throw new Error('Translation ID error');
        }

        const resFetch = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/translations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({id, userId, projectId, structureId, subjectId, lang, subject, key, value})
        });
        const data: {translation: TTranslation}|TErrorResponse = await resFetch.json();

        if (isErrorTranslation(data)) {
            throw new Error('Error fetch translation update');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;