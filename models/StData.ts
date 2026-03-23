import mongoose, { Schema, model, models } from 'mongoose';

const sDataSchema = new Schema(
  {
    Date: {
      type: Date,
      required: true,
    },
    StudentName: {
      type: String,
      required: true,
    },
    StudentPhoto: {
      type: String,
      required: false,
    },
    Gender: {
      type: String,
      enum: ['Boy', 'Girl'],
      required: true,
      default: 'Boy'
    },
    Class: {
      type: String,
      required: true,
    },
    sIndexNum: {
      type: Number,
      required: true,
    },
    Reason: {
      type: String,
      required: true,
    },
    TeacherID: {
      type: String,
      required: true,
    },
    TeacherTitle: {
      type: String,
      enum: ['Sir', 'Madam'],
      required: true,
      default: 'Sir'
    },
    Agreement: {
      type: String,
      required: true,
    },
    AgreementEndDate: {
      type: Date,
      required: true,
    },
    Isactive: {
      type: Boolean,
      required: true,
    },
    submittedDevice: {
      ip: { type: String, default: 'Unknown' },
      os: { type: String, default: 'Unknown' },
      browser: { type: String, default: 'Unknown' },
      device: { type: String, default: 'Unknown' },
      deviceModel: { type: String, default: 'Unknown' },
      userAgent: { type: String, default: '' },
      isp: { type: String, default: 'Unknown' },
      org: { type: String, default: 'Unknown' },
      country: { type: String, default: 'Unknown' },
      region: { type: String, default: 'Unknown' },
      city: { type: String, default: 'Unknown' },
      timezone: { type: String, default: 'Unknown' },
    },
  },
  {
    timestamps: true,
    collection: "StDatas"
  }
);

// Always delete the cached model to ensure the latest schema is used.
// This prevents stale model caches causing validation errors in Next.js.
if (models.StData) {
  delete (mongoose.connection.models as any)['StData'];
}
const StData = model('StData', sDataSchema);

export default StData;
