import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the interface for TypeScript
export interface IInspectionLog extends Document {
  kind: 'INSPECTION_CREATED' | 'PLAN_GENERATED' | 'FINDING_ADDED';
  inspectionId: string;
  details?: any; // Flexible field to store JSON data
  timestamp: Date;
}

// 2. Define the Mongoose Schema
const InspectionLogSchema: Schema = new Schema({
  kind: { 
    type: String, 
    required: true,
    enum: ['INSPECTION_CREATED', 'PLAN_GENERATED', 'FINDING_ADDED', 'FINDING_UPDATED'] 
  },
  inspectionId: { 
    type: String, 
    required: true,
    index: true // Index for faster filtering by inspection
  },
  details: { 
    type: Schema.Types.Mixed, // Allows storing unstructured data/snapshots
    default: {} 
  },

}, 
{
	timestamps: true
});
// 3. Export the Model
export default mongoose.model<IInspectionLog>('InspectionLog', InspectionLogSchema);