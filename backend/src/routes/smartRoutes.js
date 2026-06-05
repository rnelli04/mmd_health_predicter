const express = require("express");

const router = express.Router();

const smartController =
    require("../controllers/smartController");

router.get(
    "/drives",
    smartController.getAvailableDrives
);

router.post(
    "/select-drive",
    smartController.selectDrive
);

router.get(
    "/raw",
    smartController.getRawSmartData
);

router.get(
    "/summary",
    smartController.getSmartSummary
);

router.get(
    "/history",
    smartController.getSmartHistory
);

module.exports = router;