const express = require("express");
const supabase = require("../supabaseClient");

const router = express.Router();

// Fetch Audit Logs
router.post("/logs", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("audit_logs")
            .select("*");

        if (error) throw error;
        
        if (!data || data.length === 0) {
            return res.json({ logs: [] });
        }
        console.log("Fetched logs:", data);

        res.status(201).json({ message: "Logs found", logs: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;