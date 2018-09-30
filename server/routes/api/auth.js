const router = require("express").Router();
const authController = require("../../controllers/auth");
const requireAuth = require("../../middleware/requireAuth");

router.post("/register", authController.register);
router
  .route("/")
  .post(authController.login)
  .get(requireAuth, authController.refreshSession);

module.exports = router;
