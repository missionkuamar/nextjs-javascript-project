import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { verifyToken } from '@/middleware/auth';

// GET all products with pagination, search, filter
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// CREATE product with image upload
export async function POST(req) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const formData = await req.formData();
    
    const title = formData.get('title');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const category = formData.get('category');
    const images = formData.getAll('images');

    // Validate
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const image of images) {
      if (image instanceof File) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'products',
              resource_type: 'auto',
              transformation: [{ width: 800, height: 800, crop: 'limit' }],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        
        uploadedImages.push(result.secure_url);
      }
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      images: uploadedImages.length > 0 ? uploadedImages : [],
      user: user.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}