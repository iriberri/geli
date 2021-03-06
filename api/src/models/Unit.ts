import * as mongoose from 'mongoose';
import {IUnit} from '../../../shared/models/IUnit';

interface IUnitModel extends IUnit, mongoose.Document {
}

const unitSchema = new mongoose.Schema({
        type: {
            type: String,
            'enum': ['video', 'text', 'multiple-choice'],
        },
        filePath: {
          type: String,
        },
        fileName: {
          type: String,
        }
    },
    {
        timestamps: true
    }
);


const Unit = mongoose.model<IUnitModel>('Unit', unitSchema);

export {Unit, IUnitModel};
