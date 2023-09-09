import { Request, Response, NextFunction } from 'express';
import { RoutesInput } from '@/types/types'
import jwt, { JwtPayload } from 'jsonwebtoken'
import project from './project.route'
import accessTokenProject from './access-token-project.route'
import structure from './structure.route'
import schemabricks from './schema-bricks.route'
import entries from './entries.route'
import stagedUploadsCreate from './staged-uploads-create.route'
import dataCreateMedia from './data-create-media.route'
import createFile from './create-file.route'
import dataDeleteMedia from './data-delete-media.route'
import deleteMediaS3 from './delete-media-s3.route'

type CustomJwtPayload = JwtPayload & { userId: string };

export default ({ app }: RoutesInput) => {
    app.use(async function (req: Request, res: Response, next: NextFunction): Promise<void| Response> {
        try {
            const {authorization: accessToken} = req.headers;
            if (!accessToken) {
                return res.status(401).json({message: 'Invalid token'});
            }

            const {userId, projectId} = jwt.verify(accessToken, process.env.JWT_SECRET as string) as CustomJwtPayload;
            if (!userId || !projectId) {
                return res.status(401).json({message: 'Invalid token'});
            }

            res.locals.userId = userId;
            res.locals.projectId = projectId;

            next();
        } catch(err) {
            next(err);
        }
    });

    app.use('/api/project', project);
    app.use('/api/access-token', accessTokenProject);
    app.use('/api/structures', structure);
    app.use('/api/schema_bricks', schemabricks);
    app.use('/api/entries', entries);
    app.use('/api/staged_uploads_create', stagedUploadsCreate);
    app.use('/api/data_create_media', dataCreateMedia);
    app.use('/api/create_file', createFile);
    app.use('/api/data_delete_media', dataDeleteMedia);
    app.use('/api/delete_media_s3', deleteMediaS3);
};