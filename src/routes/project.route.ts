import { TProject } from '@/types/types';
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

const cacheData = (accessTokenProject:string): void => {
    fetch(`${process.env.URL_PROJECT_API}/${process.env.VERSION_PROJECT_API}/project/info.json?clear_cache=y`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-AppFrame-Project-Access-Token': accessTokenProject ?? ''
        }
    }).then(res => res.json());
};

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId } = res.locals as { projectId: string, userId: string };

        const resFetch = await fetch(`${process.env.URL_PROJECT_SERVICE}/api/projects/${projectId}?userId=${userId}`, {
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

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, userId } = res.locals as { projectId: string, userId: string };
        let { id, name, currencies, languages, front } = req.body;

        if (projectId !== req.params.id || projectId !== id) {
            throw new Error('Project ID error');
        }

        const resFetch = await fetch(`${process.env.URL_PROJECT_SERVICE}/api/projects/${id}?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({ id, name, currencies, languages, front})
        });
        const data: {project: TProject} = await resFetch.json();

        if (req.accessTokenProject && data.project) {
            cacheData(req.accessTokenProject);
        }

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});


export default router;