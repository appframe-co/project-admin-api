import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        const { structureId } = req.query;

        // GET structure
        const resFetchStructure = await fetch(`${process.env.URL_STRUCTURE_SERVICE}/api/structures/${structureId}?userId=${userId}&projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const {structure} = await resFetchStructure.json();

        // GET data
        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data?userId=${userId}&projectId=${projectId}&structureId=${structureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const {data} = await resFetch.json();

        // MERGE storage with data
        for (const d of data) {
            // GET storage
            const resFetchStorage = await fetch(
                `${process.env.URL_STORAGE_SERVICE}/api/storage?projectId=${projectId}&subjectId=${d.id}&subjectType=data`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const {storage} = await resFetchStorage.json();

            const storageFields:any = {};
            storage.forEach((s: any) => {
                const isField = storageFields.hasOwnProperty(s.subjectField);
                if (isField) {
                    storageFields[s.subjectField].push({
                        id: s.id,
                        filename: s.filename,
                        uuidName: s.uuidName,
                        width: s.width,
                        height: s.height,
                        size: s.size,
                        mimeType: s.mimeType,
                        src: s.src
                    }); 
                } else {
                   storageFields[s.subjectField] = [{
                        id: s.id,
                        filename: s.filename,
                        uuidName: s.uuidName,
                        width: s.width,
                        height: s.height,
                        size: s.size,
                        mimeType: s.mimeType,
                        mediaContentType: s.mediaContentType,
                        src: s.src
                    }]; 
                }
            });
            for (const [field, value] of Object.entries(storageFields)) {
                d.doc[field] = value;
            }
        }

        // compare data by structure
        const codes = structure.bricks.map((b: any) => b.code);
        const result = data.map((d: any) => {
            const doc: any = {
                id: d.id
            };

            codes.forEach((code: any) => {
                doc[code] = d.doc.hasOwnProperty(code) ? d.doc[code] : null;
            });

            return doc;
        });

        const names = structure.bricks.map((b: any) => b.name);

        res.json({data: result, names, codes});
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals as {userId: string, projectId: string};
        let { doc: docBody, structureId, images } = req.body;

        // GET structure
        const resFetchStructure = await fetch(`${process.env.URL_STRUCTURE_SERVICE}/api/structures/${structureId}?userId=${userId}&projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const {structure} = await resFetchStructure.json();

        // compare data by structure
        const codes = structure.bricks.map((b: any) => b.code);
        const doc: any = {};
        codes.forEach((code: any) => {
            doc[code] = docBody.hasOwnProperty(code) ? docBody[code] : null;
        });

        // POST new data
        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({userId, projectId, structureId, doc})
        });
        const {data} = await resFetch.json();

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
        let body = req.body;

        if (body.id !== req.params.id) {
            throw new Error('Structure ID error');
        }

        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data/${body.id}?userId=${userId}&projectId=${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(body)
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
        const { structureId } = req.query;

        // GET structure
        const resFetchStructure = await fetch(`${process.env.URL_STRUCTURE_SERVICE}/api/structures/${structureId}?userId=${userId}&projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const {structure} = await resFetchStructure.json();
        
        // GET data
        const resFetch = await fetch(`${process.env.URL_DATA_SERVICE}/api/data/${id}?userId=${userId}&projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const {data} = await resFetch.json();

        // MERGE storage with data
        // GET storage
        const resFetchStorage = await fetch(
            `${process.env.URL_STORAGE_SERVICE}/api/storage?projectId=${projectId}&subjectId=${data.id}&subjectType=data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const {storage} = await resFetchStorage.json();

        const storageFields:any = {};
        storage.forEach((s: any) => {
            const arSrc = s.src.split('/');
            arSrc.splice(arSrc.length-1, 0, '60x60');
            const miniSrc = arSrc.join('/');

            const isField = storageFields.hasOwnProperty(s.subjectField);
            if (isField) {
                storageFields[s.subjectField].push({
                    id: s.id,
                    filename: s.filename,
                    uuidName: s.uuidName,
                    width: s.width,
                    height: s.height,
                    size: s.size,
                    mimeType: s.mimeType,
                    src: s.src,
                    miniSrc
                }); 
            } else {
                storageFields[s.subjectField] = [{
                    id: s.id,
                    filename: s.filename,
                    uuidName: s.uuidName,
                    width: s.width,
                    height: s.height,
                    size: s.size,
                    mimeType: s.mimeType,
                    mediaContentType: s.mediaContentType,
                    src: s.src,
                    miniSrc
                }]; 
            }
        });
        for (const [field, value] of Object.entries(storageFields)) {
            data.doc[field] = value;
        }

        // compare data by structure
        const codes = structure.bricks.map((b: any) => b.code);
        const doc: any = {
            id: data.id
        };
        codes.forEach((code: any) => {
            doc[code] = data.doc.hasOwnProperty(code) ? data.doc[code] : null;
        });

        res.json({data: doc});
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
        const data = await resFetch.json();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;