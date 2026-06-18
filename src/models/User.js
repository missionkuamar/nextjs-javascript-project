import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true,
});

// ❌ COMPLETELY DISABLE - No pre-save hook
// UserSchema.pre('save', async function() {
//   if (!this.isModified('password')) return;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('🔍 Comparing passwords...');
    console.log('🔍 Input length:', candidatePassword?.length);
    console.log('🔍 Stored hash length:', this.password?.length);
    console.log('🔍 Stored hash:', this.password);
    
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('🔍 Match result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Comparison error:', error);
    return false;
  }
};

// Remove password from JSON
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);