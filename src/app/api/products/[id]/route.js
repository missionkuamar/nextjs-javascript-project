// import { connectDB } from '@/lib/db';
// import Product from '@/models/Product';
// import { NextResponse } from 'next/server';
// import cloudinary from '@/lib/cloudinary';
// import { verifyToken } from '@/middleware/auth';

// // GET product by ID
// export async function GET(req, { params }) {
//   try {
//       console.log('Params:', {params});
//     await connectDB();
//     const { id } = params;
//     const product = await Product.findById(id).populate('user', 'name email');
//     if (!product) {
//       return NextResponse.json(
//         { message: 'Product not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // UPDATE product
// export async function PUT(req, { params }) {
//   try {
//     console.log(params);
//     const user = await verifyToken(req);
//     if (!user) {
//       return NextResponse.json(
//         { message: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     await connectDB();
//     const { id } = params;
//     const formData = await req.formData();
    
//     const product = await Product.findById(id);
//     if (!product) {
//       return NextResponse.json(
//         { message: 'Product not found' },
//         { status: 404 }
//       );
//     }

//     // Check ownership
//     if (product.user.toString() !== user.id) {
//       return NextResponse.json(
//         { message: 'Unauthorized to update this product' },
//         { status: 403 }
//       );
//     }

//     const title = formData.get('title');
//     const description = formData.get('description');
//     const price = parseFloat(formData.get('price'));
//     const category = formData.get('category');
//     const existingImages = JSON.parse(formData.get('existingImages') || '[]');
//     const newImages = formData.getAll('newImages');

//     // Upload new images
//     const uploadedImages = [...existingImages];
//     for (const image of newImages) {
//       if (image instanceof File) {
//         const bytes = await image.arrayBuffer();
//         const buffer = Buffer.from(bytes);
        
//         const result = await new Promise((resolve, reject) => {
//           cloudinary.uploader.upload_stream(
//             {
//               folder: 'products',
//               resource_type: 'auto',
//             },
//             (error, result) => {
//               if (error) reject(error);
//               else resolve(result);
//             }
//           ).end(buffer);
//         });
        
//         uploadedImages.push(result.secure_url);
//       }
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       {
//         title,
//         description,
//         price,
//         category,
//         images: uploadedImages,
//       },
//       { new: true, runValidators: true }
//     );

//     return NextResponse.json({
//       success: true,
//       message: 'Product updated successfully',
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE product
// export async function DELETE(req, { params }) {
//   try {
//     console.log(params);
//     const user = await verifyToken(req);
//     if (!user) {
//       return NextResponse.json(
//         { message: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     await connectDB();
//     const { id } = params;

//     const product = await Product.findById(id);
//     if (!product) {
//       return NextResponse.json(
//         { message: 'Product not found' },
//         { status: 404 }
//       );
//     }

//     // Check ownership
//     if (product.user.toString() !== user.id) {
//       return NextResponse.json(
//         { message: 'Unauthorized to delete this product' },
//         { status: 403 }
//       );
//     }

//     // Delete images from Cloudinary
//     for (const imageUrl of product.images) {
//       try {
//         const publicId = imageUrl.split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(`products/${publicId}`);
//       } catch (error) {
//         console.error('Error deleting image from Cloudinary:', error);
//       }
//     }

//     await product.deleteOne();

//     return NextResponse.json({
//       success: true,
//       message: 'Product deleted successfully',
//     });
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { verifyToken } from '@/middleware/auth';

// ✅ GET - Single product
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id).populate('user', 'name email');
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT - Update product
export async function PUT(req, { params }) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const formData = await req.formData();
    
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.user.toString() !== user.id) {
      return NextResponse.json(
        { message: 'Unauthorized to update this product' },
        { status: 403 }
      );
    }

    const title = formData.get('title');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const category = formData.get('category');
    const existingImages = JSON.parse(formData.get('existingImages') || '[]');
    const newImages = formData.getAll('newImages');

    // Upload new images
    const uploadedImages = [...existingImages];
    for (const image of newImages) {
      if (image instanceof File) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'products',
              resource_type: 'auto',
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

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        category,
        images: uploadedImages,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete product
export async function DELETE(req, { params }) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.user.toString() !== user.id) {
      return NextResponse.json(
        { message: 'Unauthorized to delete this product' },
        { status: 403 }
      );
    }

    // Delete images from Cloudinary
    for (const imageUrl of product.images) {
      try {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await product.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}