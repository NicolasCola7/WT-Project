import { Schema, model } from 'mongoose';
import bcrypt, { compare } from 'bcryptjs';


// Interface for creating a new user
interface UserI {
  username: string;
  email: string;
  name: string;
  surname: string;
  password: string;
  birthday?: Date;
  comparePassword(password: string, callback: (err: any, isMatch: boolean) => void): boolean;
}

const userSchema = new Schema<UserI>({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    birthday: { type: Date, required: false}
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password'))
     return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, salt);
    
    // Replace plain text password with hashed password
    user.password = hashedPassword;
    return next();
  } catch (error: any) {
    return next(error);
  }
});

userSchema.methods.comparePassword = function(candidatePassword: string, callback: any): void {
  compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
       return callback(err);
    }
    callback(null, isMatch);
  });
};

// Remove password when converting to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

const User = model<UserI>('User', userSchema);

export default User;
export type { UserI };