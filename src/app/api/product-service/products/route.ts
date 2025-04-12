import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all products with their gallery items
    const products = await prisma.itemProduct.findMany({
      include: {
        galleryItems: true,
      },
    })

    // If no products exist, create default ones from the data
    if (products.length === 0) {
      // Import the default products data
      const { Products } = await import("@/app/admin/(menus)/(beranda)/home-products/index.data")

      // Create each product and its gallery items
      for (const product of Products) {
        const createdProduct = await prisma.itemProduct.create({
          data: {
            title: product.title,
            subtitle: product.subtitle,
            banner: product.banner,
            description: product.description,
            category: product.title.toLowerCase(),
          },
        })

        // Create gallery items for this product
        for (const item of product.data) {
          await prisma.galleryProduct.create({
            data: {
              image: item.image,
              productId: createdProduct.id,
            },
          })
        }
      }

      // Fetch the newly created products
      const newProducts = await prisma.itemProduct.findMany({
        include: {
          galleryItems: true,
        },
      })

      return new Response(
        JSON.stringify({
          code: 200,
          message: "Default products created successfully",
          data: newProducts,
        }),
        { status: 200 },
      )
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Products retrieved successfully",
        data: products,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving products:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
