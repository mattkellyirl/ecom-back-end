const router = require("express").Router();
const { Category, Product } = require("../../models");

// Get All Categories
router.get("/", async (req, res) => {
  try {
    const getCategories = await Category.findAll({
      include: [{ model: Product }],
    });
    console.log("GET Request Successful - Categories");
    res
      .status(200)
      .json({ message: "GET Request Successful - Categories", getCategories });
  } catch (err) {
    console.error("GET Request Failed - Categories", err);
    res
      .status(500)
      .json({ error: "GET Request Failed - Categories", details: err });
  }
});

// Get Category by ID
router.get("/:id", async (req, res) => {
  try {
    // Check if category exists
    const getCategoryByID = await Category.findByPk(req.params.id, {
      include: { model: Product },
    });

    // If category exists, retrieve it
    if (getCategoryByID) {
      // Return 200 response if GET request successful
      console.log("GET Request Successful - Category ID");
      res.status(200).json({
        message: "GET Request Successful - Category ID",
        getCategoryByID,
      });
    } else {
      // If category not found, return 404 error
      return res.status(404).json({ error: "Could not find category" });
    }

    // Return 500 response if PUT request failed
  } catch (err) {
    console.error("GET Request Failed - Category ID", err);
    res
      .status(500)
      .json({ error: "GET Request Failed - Category ID", details: err });
  }
});

// Add Category
router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });
    console.log("POST Request Successful - New Category");
    res
      .status(200)
      .json({ message: "POST Request Successful - New Category", newCategory });
  } catch (err) {
    console.error("POST Request Failed - New Category", err);
    res
      .status(500)
      .json({ error: "POST Request Failed - New Category", details: err });
  }
});

// Update Category
router.put("/:id", async (req, res) => {
  try {
    // Check if category to be updated exists
    const updateCategoryByID = await Category.findByPk(req.params.id);

    // If category exists, update it
    if (updateCategoryByID) {
      await Category.update(
        { category_name: req.body.category_name },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      // Return 200 response if PUT request successful
      console.log("PUT Request Successful - Update Category");
      res.status(200).json({
        message: "PUT Request Successful - Update Category",
        updateCategoryByID,
      });
    } else {
      // If category not found, return 404 error
      return res.status(404).json({ error: "Could not find category" });
    }
    // Return 500 response if PUT request failed
  } catch (err) {
    console.error("PUT Request Failed - Update Category", err);
    res
      .status(500)
      .json({ error: "PUT Request Failed - Update Category", details: err });
  }
});

// Delete Category
router.delete("/:id", async (req, res) => {
  try {
    // Check if category to be deleted exists
    const deleteCategoryByID = await Category.findByPk(req.params.id);

    // If category exists, delete it
    if (deleteCategoryByID) {
      await deleteCategoryByID.destroy();
    } else {
      // If category not found, return 404 error
      return res.status(404).json({ error: "Could not find category" });
    }

    // Return 200 response if DELETE request successful
    console.log("DELETE Request Successful - Delete Category");
    res.status(200).json({
      message: "DELETE Request Successful - Delete Category",
      deleteCategoryByID,
    });
  } catch (err) {
    console.error("DELETE Request Failed - Delete Category", err);
    res
      .status(500)
      .json({ error: "DELETE Request Failed - Delete Category", details: err });
  }
});

module.exports = router;
