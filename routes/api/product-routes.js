const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// Get All Products
router.get("/", async (req, res) => {
  try {
    const getProducts = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    console.log("GET Request Successful - Products");
    res
      .status(200)
      .json({ message: "Get Request Successful - Products", getProducts });
  } catch (err) {
    console.error("GET Request Failed - Products", err);
    res
      .status(500)
      .json({ error: "GET Request Failed - Products", details: err });
  }
});

// Get Product by ID
router.get("/:id", async (req, res) => {
  try {
    // Check if product exists
    const getProductByID = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    // If product exists, retrieve it
    if (getProductByID) {
      // Return 200 response if GET request successful
      console.log("GET Request Successful - Product by ID");
      res.status(200).json({
        message: "GET Request Successful - Product by ID",
        getProductByID,
      });
    } else {
      // If category not found, return 404 error
      return res.status(404).json({ error: "Could not find product" });
    }
  } catch (err) {
    console.error("GET Request Failed - Products", err);
    res
      .status(500)
      .json({ error: "GET Request Failed - Products", details: err });
  }
});

// Create New Product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Update Product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// Delete Product
router.delete("/:id", async (req, res) => {
  try {
    // Check if product to be deleted exists
    const deleteProductByID = await Product.findByPk(req.params.id);

    // If product exists, delete it
    if (deleteProductByID) {
      await deleteProductByID.destroy();
    } else {
      // If product not found, return 404 error
      return res.status(404).json({ error: "Could not find product" });
    }
    // Return 200 response if DELETE request successful
    console.log("DELETE Request Successful - Delete Product");
    return res.status(200).json({
      message: "DELETE Request Successful - Delete Product",
      deleteProductByID,
    });
  } catch (err) {
    console.error("DELETE Request Failed - Product", err);
    res
      .status(500)
      .json({ error: "DELETE Request Failed - Product", details: err });
  }
});

module.exports = router;
