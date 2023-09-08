import express, { Request, Response, NextFunction } from 'express';
import { TData, TErrorResponse } from '@/types/types';

const router = express.Router();

function isErrorDataList(data: TErrorResponse|{data: TData[], names: string[], codes: string[]}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}
function isErrorData(data: TErrorResponse|{data: TData}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { structureId } = req.query;;

        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data?userId=${userId}&projectId=${projectId}&structureId=${structureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {data: TData[], names: string[], codes: string[]}|TErrorResponse = await resFetch.json();

        if (isErrorDataList(data)) {
            throw new Error('Error fetch data list');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { doc, structureId, images } = req.body;

        // POST new data
        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({userId, projectId, structureId, doc})
        });
        const dataFetch: {data: TData}|TErrorResponse = await resFetch.json();

        if (isErrorData(dataFetch)) {
            throw new Error('Error fetch data create');
        }

        const {data} = dataFetch;

        const outputImagesFields: any = {};
        for (const imagesField of Object.keys(images)) {
            const resImagesFetch = await fetch(`${process.env.URL_STORAGE_SERVICE}/api/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId, projectId, structureId, 
                    subjectType: 'data', subjectId: data.id, subjectField: imagesField, 
                    images: images[imagesField]
                })
            });
            const dataImages = await resImagesFetch.json();

            outputImagesFields[imagesField] = dataImages;
        }

        res.json({data: {...data, ...outputImagesFields}});
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { doc, structureId, id } = req.body;

        if (id !== req.params.id) {
            throw new Error('Data ID error');
        }

        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({id, userId, projectId, structureId, doc})
        });
        const dataFetch: {data: TData}|TErrorResponse = await resFetch.json();

        if (isErrorData(dataFetch)) {
            throw new Error('Error fetch data create');
        }

        const {data} = dataFetch;
        
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

        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data/${id}?userId=${userId}&projectId=${projectId}&structureId=${structureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const dataFetch: {data: TData}|TErrorResponse = await resFetch.json();

        if (isErrorData(dataFetch)) {
            throw new Error('Error fetch data');
        }

        res.json(dataFetch);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { id } = req.params;

        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data/${id}?userId=${userId}&projectId=${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: {data: TData}|TErrorResponse = await resFetch.json();

        if (isErrorData(data)) {
            throw new Error('Error fetch data create');
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;