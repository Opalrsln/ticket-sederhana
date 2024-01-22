import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username        : string;
  email           : string;
  password        : string;
  address         : string;
  phonenumber     : string;
  comparePassword : (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username    : { type: String, required: true },
  email       : { type: String, required: true, unique: true, lowercase: true, trim: true },
  password    : { type: String, required: true },
  address     : { type: String, required: true },
  phonenumber : { type: String, required: true }
});

UserSchema.pre<IUser>('save', async function(next) {
  const user = this;

  if (!user.isModified('password')) return next();
});

UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
