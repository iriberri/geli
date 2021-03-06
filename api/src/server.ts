import 'reflect-metadata';
import {createExpressServer} from 'routing-controllers';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as winston from 'winston';
import * as passport from 'passport';
import {Express} from 'express';
import config from './config/main';
import passportLoginStrategy from './security/passportLoginStrategy';
import passportJwtStrategy from './security/passportJwtStrategy';

/**
 * Root class of your node server.
 * Can be used for basic configurations, for instance starting up the server or registering middleware.
 */
export class Server {

  public app: Express;

  static setupPassport() {
    passport.use(passportLoginStrategy);
    passport.use(passportJwtStrategy);
  }

  constructor() {
    // Do not use mpromise
    (<any>mongoose).Promise = global.Promise;

    mongoose.connect(config.database);

    this.app = createExpressServer({
      routePrefix: '/api',
      controllers: [__dirname + '/controllers/*.js'] // register all controller's routes
    });

    // Request logger
    this.app.use(morgan('combined'));

    Server.setupPassport();
    this.app.use(passport.initialize());
  }

  start() {
    this.app.listen(config.port, () => {
      winston.log('info', '--> Server successfully started at port %d', config.port);
    });
  }
}

/**
 * For testing mocha will start express itself
 */
if (process.env.NODE_ENV !== 'test') {
  new Server().start();
}
