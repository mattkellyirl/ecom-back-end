const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// Get All Tags
router.get("/", async (req, res) => {
  try {
    const getTags = await Tag.findAll({
      include: [{ model: Product }],
    });
    // Return 200 response if GET request successful
    console.log("GET Request Successful - Tags");
    return res
      .status(200)
      .json({ message: "GET Request Successful - Tags", getTags });
  } catch (err) {
    // Return 500 response if GET request failed
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
      // Return 404 response if tag not found
      return res.status(404).json({ error: "Could not find tag" });
    }
  } catch (err) {
    // Return 500 response if GET request failed
    console.error("GET Request Failed - Tag ID", err);
    return res
      .status(500)
      .json({ error: "GET Request Failed - Tag ID", details: err });
  }
});

// Add Tag
router.post("/", async (req, res) => {
  try {
    const newTag = await Tag.create({
      tag_name: req.body.tag_name,
    });
    // Return 200 response if POST request successful
    console.log("POST Request Succesful - New Tag");
    return res
      .status(200)
      .json({ message: "POST Request Successful - New Tag ", newTag });
  } catch (err) {
    // Return 500 response if GET request failed
    console.error("POST Request Failed - New Tag", err);
    return res
      .status(500)
      .json({ error: "POST Request Failed - New Tag", details: err });
  }
});

// Update Tag
router.put("/:id", async (req, res) => {
  try {
    // Check if tag to be updated exists
    const updateTagByID = await Tag.findByPk(req.params.id);

    // If tag exists, update it
    if (updateTagByID) {
      await Tag.update(
        { tag_name: req.body.tag_name },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      // Return 200 response if PUT request successful
      console.log("PUT Request Successful - Update Tag");
      return res
        .status(200)
        .json({ message: "PUT Request Succesful - Update Tag", updateTagByID });
    } else {
      // Return 404 response if tag not found
      return res.status(404).json({ error: "Could not find tag" });
    }
  } catch (err) {
    // Return 500 response if PUT request failed
    console.error("PUT Request Failed - Update Tag", err);
    return res
      .status(500)
      .json({ error: "PUT Request Failed - Update Tag", details: err });
  }
});

// Delete Tag
router.delete("/:id", async (req, res) => {
  try {
    // Check if tag to be deleted exists
    const deleteTagByID = await Tag.findByPk(req.params.id);

    // If tag exists, delete it
    if (deleteTagByID) {
      await deleteTagByID.destroy();
    } else {
      // Return 404 response if tag not found
      return res.status(404).json({ error: "Could not find tag" });
    }
    // Return 200 response if DELETE request successful
    console.log("DELETE Request Successful - Delete Tag");
    return res.status(200).json({
      message: "DELETE Request Successful - Delete Tag",
      deleteTagByID,
    });
  } catch (err) {
    // Return 500 response if DELETE request failed
    console.error("DELETE Request Failed - Delete Tag", err);
    return res
      .status(500)
      .json({ error: "DELETE Request Failed - Delete Tag", details: err });
  }
});

module.exports = router;
