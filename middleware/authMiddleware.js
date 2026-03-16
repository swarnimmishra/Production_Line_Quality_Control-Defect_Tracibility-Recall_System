const roleRedirects = {
    admin: "/admin_dashboard.html",
    auditor: "/auditor_dashboard.html",
    operator: "/operator_entry.html",
    qc_inspector: "/qc_inspection.html",
    supply_manager: "/recall_dashboard.html"
};

function requireAuth() {
    return (req, res, next) => {
        const userRole = req.session.user.role;
        console.log("Checking auth for:", req.params.role, "Session user:", userRole);
        if (!req.session.user){
          res.redirect("/index.html");
        }
        else if (req.params.role != user) {
          res.json({ message: "Access denied." });
        }
        else{
          next();
        }
    };
}

module.exports = { requireAuth, roleRedirects };