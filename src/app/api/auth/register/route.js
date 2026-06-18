import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    console.log('📝 Register attempt:', { name, email });
    console.log('📝 Password length:', password?.length);

    // Validate
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // ✅ Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('🔑 Generated hash:', hashedPassword);

    // Create user with hashed password
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    console.log('✅ User created successfully:', user._id);
    
    // Verify stored password
    const storedUser = await User.findById(user._id).select('+password');
    console.log('✅ Stored in DB:', storedUser.password);
    console.log('✅ Hashes match:', storedUser.password === hashedPassword);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Register error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}