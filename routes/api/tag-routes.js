const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// Get All Tags
router.get("/", async (req, res) => {
  try {
    const getTags = await Tag.findAll({
      include: [{ model: Product }],
    });
    console.log("GET Request Successful - Tags");
    return res
      .status(200)
      .json({ message: "GET Request Successful - Tags", getTags });
  } catch (err) {
    console.error("GET Request Failed - Tags", err);
    return res
      .status(500)
      .json({ error: "GET Request Failed - Tags", details: err });
  }
});

// Get Tag by ID
router.get("/:id", async (req, res) => {
  try {
    // Check if tag exists
    const getTagByID = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    // If tag exists, retrieve it
    if (getTagByID) {
      // Return 200 response if GET request successful
      console.log("GET Request Successful - Tag ID");
      return res
        .status(200)
        .json({ message: "GET Request Successful - Tag ID", getTagByID });
    } else {
      // If tag not found, return 404 error
      return res.status(404).json({ error: "Could not find tag" });
    }
    // Return 500 response if GET request failed
  } catch (err) {
    console.error("GET Request Failed - Tag ID", err);
    return res
      .status(500)
      .json({ error: "GET Request Failed - Tag ID", details: err });
  }
});

// Add Tag
router.post("/", (req, res) => {
  // create a new tag
});

// Update Tag
router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
});

// Delete Tag
router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
