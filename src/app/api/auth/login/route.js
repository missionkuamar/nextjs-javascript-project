import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    
    console.log('📝 Login attempt:', { email });
    console.log('📝 Password length:', password?.length);

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('✅ User found:', {
      id: user._id,
      email: user.email,
      storedHash: user.password
    });

    // ✅ Direct bcrypt compare
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log('🔍 Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      
      // Debug: Try hashing the input
      const testSalt = await bcrypt.genSalt(10);
      const testHash = await bcrypt.hash(password, testSalt);
      console.log('🔍 Test hash of input:', testHash);
      
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('✅ Login successful');

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}