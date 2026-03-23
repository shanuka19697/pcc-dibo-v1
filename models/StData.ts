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
    Agreement: {
      type: String,
      required: true,
    },
    AgreementEndDate: {
      type: Date,
      required: true,
    },
    TeacherTitle: {
      type: String,
      enum: ['Sir', 'Madam'],
      required: true,
      default: 'Sir'
    },
    Isactive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "StDatas"
  }
);

// In Next.js, model caching can prevent schema updates from applying during hot reloads.
// We check for the model in models, and if it's not there or if we want to ensure it's fresh, we register it.
const StData = models.StData || model('StData', sDataSchema);

export default StData;
