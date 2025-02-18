import { Request, Response, NextFunction } from 'express';
import { RoutesInput, TErrorResponse, TPlan, TProject } from '@/types/types'
import jwt, { JwtPayload } from 'jsonwebtoken'
import project from './project.route'
import accessTokenProject from './access-token-project.route'
import content from './content.route'
import schemafields from './schema-fields.route'
import entries from './entries.route'
import stagedUploadsCreate from './staged-uploads-create.route'
import files from './files.route'
import system from './system.route'
import alert from './alerts.route'
import translations from './translations.route'
import sections from './sections.route'
import menus from './menus.route'
import menuItems from './menu-items.route'
import translationsMenuItem from './translations-menu-item.route'

type CustomJwtPayload = JwtPayload & { userId: string };

function isErrorProjectAccessToken(data: TErrorResponse|{projectId: string, accessToken: string}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorProject(data: TErrorResponse|{project: TProject}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorPlans(data: TErrorResponse|{plans: TPlan[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default ({ app }: RoutesInput) => {
    app.use(async function (req: Request, res: Response, next: NextFunction): Promise<void| Response> {
        try {
            const accessToken = req.headers['x-appframe-access-token'] as string;
            if (!accessToken) {
                return res.status(401).json({message: 'Invalid access token'});
            }

            const {userId, projectId} = jwt.verify(accessToken, process.env.JWT_SECRET as string) as CustomJwtPayload;
            if (!userId || !projectId) {
                return res.status(401).json({message: 'Invalid access token'});
            }

            res.locals.userId = userId;
            res.locals.projectId = projectId;

            next();
        } catch(err) {
            next(err);
        }
    });

    app.use(async function (req: Request, res: Response, next: NextFunction): Promise<void| Response> {
        try {
            const {userId, projectId} = res.locals;

            const init = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const resFetch = await fetch(`${process.env.URL_PROJECT_SERVICE}/api/projects/${projectId}?userId=${userId}`, init);
            const data: TErrorResponse|{project:TProject} = await resFetch.json();
            if (isErrorProject(data)) {
                throw new Error('Invalid project');
            }
            const {trialFinishedAt, planFinishedAt} = data.project;

            const trialFinishedAtTimestamp = new Date(trialFinishedAt).getTime();
            const planFinishedAtTimestamp = new Date(planFinishedAt).getTime();

            const now = Date.now();
            if (now > trialFinishedAtTimestamp) {
                if (now > planFinishedAtTimestamp) {
                    return res.json({error: 'plan_expired', description: `Plan expired. Please, upgrade your plan.`});
                }
            }

            const [dataPlans, dataAccessToken]:[TErrorResponse|{plans: TPlan[]}, TErrorResponse|{projectId: string, accessToken: string}] = await Promise.all([
                fetch(`${process.env.URL_PROJECT_SERVICE}/api/plans?code=${data.project.plan}`, init).then(res => res.json()),
                fetch(`${process.env.URL_PROJECT_SERVICE}/api/access-token/${projectId}?userId=${userId}`, init).then(res => res.json())
            ]);
            if (isErrorPlans(dataPlans)) {
                throw new Error('Invalid plans');
            }
            if (isErrorProjectAccessToken(dataAccessToken)) {
                throw new Error('Invalid project accesstoken');
            }
            res.locals.plan = dataPlans.plans[0];

            req.accessTokenProject = dataAccessToken.accessToken;

            next();
        } catch(err) {
            next(err);
        }
    });

    app.use('/api/project', project);
    app.use('/api/access-token', accessTokenProject);

    app.use('/api/schema_fields', schemafields);

    app.use('/api/contents', content);
    app.use('/api/entries', entries);
    app.use('/api/sections', sections);
    app.use('/api/translations', translations);

    app.use('/api/menus', menus);
    app.use('/api/menu_items', menuItems);
    app.use('/api/translations_menu_item', translationsMenuItem);

    app.use('/api/staged_uploads_create', stagedUploadsCreate);
    app.use('/api/files', files);
    app.use('/api/system', system);
    app.use('/api/alerts', alert);
};