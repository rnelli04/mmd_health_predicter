const smartService =
    require("../services/smartService");

const deviceConfig =
    require("../config/deviceConfig");

const db = require("../database/db");

async function getAvailableDrives(req, res) {

    try {

        const drives =
            await smartService.getAvailableDrives();

        res.json(drives);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

}

async function selectDrive(req, res) {

    const { device } = req.body;

    if (!device) {
        return res.status(400).json({
            error: "Device is required"
        });
    }

    deviceConfig.setSelectedDevice(device);

    res.json({
        success: true,
        selectedDevice: device
    });
}

async function getRawSmartData(req, res) {

    try {

        const data =
            await smartService.getRawSmartData();

        res.send(data);

    } catch (error) {

        res.status(500).send(error);

    }

}

async function getSmartSummary(req, res) {

    try {

        const data =
            await smartService.getSmartSummary();

        res.json(data);

    } catch (error) {

        res.status(500).send(error);

    }

}

async function getSmartHistory(req, res) {

    try {

        const data =
            await smartService.getSmartHistory();

        res.json(data);

    } catch (error) {

        res.status(500).send(error);

    }

}

module.exports = {
    getAvailableDrives,
    selectDrive,
    getRawSmartData,
    getSmartSummary,
    getSmartHistory
};