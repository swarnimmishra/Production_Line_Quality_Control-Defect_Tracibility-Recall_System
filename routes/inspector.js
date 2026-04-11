const express = require("express");
const path = require("path");
const supabase = require("../supabaseClient");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const router = express.Router();

// 1. Initialize AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 2. NEW ROUTE: Generate the secure S3 upload link
router.get("/get_s3_upload_url", async (req, res) => {
  try {
    const { filename, fileType } = req.query;
    
    // Create a unique file path (e.g., qc/167890_img_9904.jpg)
    const key = `qc/${Date.now()}_${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // Generate a temporary upload URL valid for 60 seconds
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    
    // The permanent public link to save in Supabase
    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not generate S3 upload URL" });
  }
});

// 3. YOUR EXISTING ROUTE (Unchanged)
router.post("/evaluate_batch", async (req, res) => {
  try {
      const { batch_id, inspector_id, inspection_id, status, defect, evidence, inspection_date } = req.body; //

      const { data, error } = await supabase
          .from("qc_inspections") //
          .insert([{ //
              batch_id, //
              inspector_id, //
              inspection_id, //
              status, //
              defect, //
              evidence, //
              inspection_date //
          }])
          .select(); //

      if (error) throw error; //

      res.status(201).json({ message: "Batch evaluation completed successfully!", batch: data[0] }); //
      } catch (err) { //
      console.error(err); //
      res.status(500).json({ message: "Server error" }); //
      }
});

module.exports = router; 