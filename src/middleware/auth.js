import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export function verifyToken(req) {
  try {
    // Check cookie first
    let token = req.cookies.get('token')?.value;
    
    // If not in cookie, check Authorization header
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function withAuth(handler) {
  return async (req) => {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }
    req.user = user;
    return handler(req);
  };
}

export function withAdmin(handler) {
  return async (req) => {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    req.user = user;
    return handler(req);
  };
}