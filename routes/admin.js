const express = require("express");
const path = require("path");
const supabase = require("../supabaseClient");
const router = express.Router();

// Add new machine
router.post("/machines", async (req, res) => {
  try {
    const { machine_id, machine_name, machine_type, last_maintenance } = req.body;

    if (!machine_id || !machine_name || !machine_type || !last_maintenance) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("machines")
      .insert([{ machine_id, machine_name, machine_type, last_maintenance }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "Machine registered successfully", machine: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add new product
router.post("/products", async (req, res) => {
  try {
    const { product_id, product_name, sku } = req.body;

    if (!product_id || !product_name || !sku) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{ product_id, product_name, sku }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "Product registered successfully", product: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
