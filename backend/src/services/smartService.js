const { exec } = require("child_process");
const db = require("../database/db");

const deviceConfig =
    require("../config/deviceConfig");

const healthService =
    require("./healthService");

function getRawSmartData() {
    return new Promise((resolve, reject) => {

        const device =
            deviceConfig.getSelectedDevice();

        exec(
            `smartctl -a ${device}`,
            (error, stdout, stderr) => {

                console.log("ERROR:", error);
                console.log("STDERR:", stderr);
                console.log("STDOUT:", stdout);

                if (stdout && stdout.length > 0) {
                    resolve(stdout);
                    return;
                }

                reject(stderr || error?.message || "Unknown error");
            }
        );

    });
}

async function getAvailableDrives() {

    return new Promise((resolve, reject) => {

        exec(
            "smartctl --scan",
            async (error, stdout) => {

                if (error) {
                    return reject(error);
                }

                try {

                    const deviceLines = stdout
                        .split("\n")
                        .filter(line => line.trim() !== "");

                    const drives = [];

                    for (const line of deviceLines) {

                        const device =
                            line.split(" ")[0];

                        const driveInfo =
                            await getDriveInfo(device);

                        const driveType =
                            driveInfo.type;

                        const isSSD =
                            driveInfo.isSSD;

                        const isHDD =
                            driveInfo.isHDD;

                        drives.push(driveInfo);
                    }

                    resolve(drives);

                } catch (err) {

                    reject(err);

                }

            }
        );

    });

}

async function getSmartSummary() {

    const rawData = await getRawSmartData();

    const device =
        deviceConfig.getSelectedDevice();

    const driveInfo =
        await getDriveInfo(device);

    const driveType =
        driveInfo.type;

    const isSSD =
        driveInfo.isSSD;

    const isHDD =
        driveInfo.isHDD;

    const modelMatch =
        rawData.match(
            /Device Model:\s+([^\n]+)/
        ) ||
        rawData.match(
            /Model Number:\s+([^\n]+)/
        );

    const tempMatch =
        rawData.match(/Temperature_Celsius.*?-\s+(\d+)/);

    const powerOnMatch =
        rawData.match(/Power_On_Hours.*?-\s+(\d+)/);

    const rawReadMatch =
        rawData.match(/Raw_Read_Error_Rate.*?-\s+(\d+)/);

    const spinUpMatch =
        rawData.match(/Spin_Up_Time.*?-\s+(\d+)/);

    const startStopMatch =
        rawData.match(/Start_Stop_Count.*?-\s+(\d+)/);

    const reallocatedMatch =
        rawData.match(/Reallocated_Sector_Ct.*?-\s+(\d+)/);

    const seekErrorMatch =
        rawData.match(/Seek_Error_Rate.*?-\s+(\d+)/);

    const spinRetryMatch =
        rawData.match(/Spin_Retry_Count.*?-\s+(\d+)/);

    const powerCycleMatch =
        rawData.match(/Power_Cycle_Count.*?-\s+(\d+)/);

    const reportedUncorrectMatch =
        rawData.match(/Reported_Uncorrect.*?-\s+(\d+)/);

    const loadCycleMatch =
        rawData.match(/Load_Cycle_Count.*?-\s+(\d+)/);

    const pendingMatch =
        rawData.match(/Current_Pending_Sector.*?-\s+(\d+)/);

    const offlineMatch =
        rawData.match(/Offline_Uncorrectable.*?-\s+(\d+)/);

    const crcMatch =
        rawData.match(/UDMA_CRC_Error_Count.*?-\s+(\d+)/);
    
    const criticalWarningMatch =
        rawData.match(
            /Critical Warning:\s+0x([0-9A-Fa-f]+)/
        );

    const availableSpareMatch =
        rawData.match(
            /Available Spare:\s+(\d+)/
        );

    const availableSpareThresholdMatch =
        rawData.match(
            /Available Spare Threshold:\s+(\d+)/
        );

    const percentageUsedMatch =
        rawData.match(
            /Percentage Used:\s+(\d+)/
        );

    const unsafeShutdownsMatch =
        rawData.match(
            /Unsafe Shutdowns:\s+(\d+)/
        );

    const mediaErrorsMatch =
        rawData.match(
            /Media and Data Integrity Errors:\s+(\d+)/
        );

    const dataUnitsReadMatch =
        rawData.match(
            /Data Units Read:\s+([\d,]+)/
        );

    const dataUnitsWrittenMatch =
        rawData.match(
            /Data Units Written:\s+([\d,]+)/
        );

    const nvmeTempMatch =
        rawData.match(
            /Temperature:\s+(\d+)/
        );

    const nvmePowerOnMatch =
        rawData.match(
            /Power On Hours:\s+(\d+)/
        );

    console.log("TEMP MATCH:", tempMatch);
    console.log("POWER MATCH:", powerOnMatch);

    const summary = {

        driveType,
        isSSD,
        isHDD,

        model: modelMatch
            ? modelMatch[1].trim()
            : driveInfo.model,

        temperature:

            driveType === "NVMe SSD"

                ? (
                    nvmeTempMatch
                        ? Number(nvmeTempMatch[1])
                        : null
                )

                : (
                    tempMatch
                        ? Number(tempMatch[1])
                        : null
                ),

        powerOnHours:

            driveType === "NVMe SSD"

                ? (
                    rawData.match(
                        /Power On Hours:\s+(\d+)/
                    )
                        ? Number(
                            rawData.match(
                                /Power On Hours:\s+(\d+)/
                            )[1]
                        )
                        : 0
                )

                : (
                    powerOnMatch
                        ? Number(powerOnMatch[1])
                        : 0
                ),

        // HDD ATTRIBUTES

        rawReadErrorRate:
            rawReadMatch
                ? Number(rawReadMatch[1])
                : 0,

        spinUpTime:
            spinUpMatch
                ? Number(spinUpMatch[1])
                : 0,

        startStopCount:
            startStopMatch
                ? Number(startStopMatch[1])
                : 0,

        reallocatedSectors:
            reallocatedMatch
                ? Number(reallocatedMatch[1])
                : 0,

        seekErrorRate:
            seekErrorMatch
                ? Number(seekErrorMatch[1])
                : 0,

        spinRetryCount:
            spinRetryMatch
                ? Number(spinRetryMatch[1])
                : 0,

        powerCycleCount:
            powerCycleMatch
                ? Number(powerCycleMatch[1])
                : 0,

        reportedUncorrect:
            reportedUncorrectMatch
                ? Number(reportedUncorrectMatch[1])
                : 0,

        loadCycleCount:
            loadCycleMatch
                ? Number(loadCycleMatch[1])
                : 0,

        pendingSectors:
            pendingMatch
                ? Number(pendingMatch[1])
                : 0,

        offlineUncorrectable:
            offlineMatch
                ? Number(offlineMatch[1])
                : 0,

        crcErrorCount:
            crcMatch
                ? Number(crcMatch[1])
                : 0,

        // SSD ATTRIBUTES

        criticalWarning:
            criticalWarningMatch
                ? parseInt(
                    criticalWarningMatch[1],
                    16
                )
                : 0,

        availableSpare:
            availableSpareMatch
                ? Number(
                    availableSpareMatch[1]
                )
                : 0,

        availableSpareThreshold:
            availableSpareThresholdMatch
                ? Number(
                    availableSpareThresholdMatch[1]
                )
                : 0,

        percentageUsed:
            percentageUsedMatch
                ? Number(
                    percentageUsedMatch[1]
                )
                : 0,
        
        enduranceRemaining:
            percentageUsedMatch
                ? Math.max(
                    0,
                    100 - Number(percentageUsedMatch[1])
                )
                : null,

        unsafeShutdowns:
            unsafeShutdownsMatch
                ? Number(
                    unsafeShutdownsMatch[1]
                )
                : 0,

        mediaErrors:
            mediaErrorsMatch
                ? Number(
                    mediaErrorsMatch[1]
                )
                : 0,

        dataUnitsRead:
            dataUnitsReadMatch
                ? Number(
                    dataUnitsReadMatch[1]
                        .replace(/,/g, "")
                )
                : 0,

        dataUnitsWritten:
            dataUnitsWrittenMatch
                ? Number(
                    dataUnitsWrittenMatch[1]
                        .replace(/,/g, "")
                )
                : 0
    };

    console.log("isSSD =", summary.isSSD);
    console.log("isHDD =", summary.isHDD);
    console.log("driveType =", summary.driveType);
    const failure =
        healthService.calculateFailureScore(summary);

    const age =
        healthService.calculateAgeScore(summary);

    const healthScore =
        failure.failureScore +
        age.ageScore;

    let status;

    if (healthScore >= 90)
        status = "Excellent";
    else if (healthScore >= 75)
        status = "Good";
    else if (healthScore >= 50)
        status = "Bad";
    else
        status = "Critical";

    let healthCategory;

    if (healthScore >= 90)
        healthCategory = "Healthy";
    else if (healthScore >= 75)
        healthCategory = "Warning";
    else if (healthScore >= 50)
        healthCategory = "Degraded";
    else
        healthCategory = "Critical";

    const alerts = [
        ...failure.alerts,
        ...age.alerts
    ];

    const mlService =
        require("./mlService");

    let prediction = {
        prediction: "Not Available",
        failureProbability: 0
    };

    if (isHDD) {

        prediction =
            await mlService.getFailurePrediction({

                rawReadErrorRate:
                    summary.rawReadErrorRate,

                spinUpTime:
                    summary.spinUpTime,

                startStopCount:
                    summary.startStopCount,

                reallocatedSectors:
                    summary.reallocatedSectors,

                seekErrorRate:
                    summary.seekErrorRate,

                powerOnHours:
                    summary.powerOnHours,

                spinRetryCount:
                    summary.spinRetryCount,

                powerCycleCount:
                    summary.powerCycleCount,

                reportedUncorrect:
                    summary.reportedUncorrect,

                loadCycleCount:
                    summary.loadCycleCount,

                temperature:
                    summary.temperature,

                pendingSectors:
                    summary.pendingSectors,

                offlineUncorrectable:
                    summary.offlineUncorrectable,

                crcErrorCount:
                    summary.crcErrorCount
            });

    }

    return {
        ...summary,

        health: {
            healthScore,
            status,
            healthCategory,

            breakdown: {
                failureScore: failure.failureScore,
                ageScore: age.ageScore
            },

            alerts
        },

        mlPrediction: {
            prediction:
                prediction.prediction,

            failureProbability:
                prediction.failureProbability
        }
    };
}

async function saveSnapshot() {

    const summary =
        await getSmartSummary();

    db.run(
        `
        INSERT INTO smart_logs (

            drive_type,

            model,

            health_score,

            failure_probability,

            temperature,

            power_on_hours,

            raw_read_error_rate,
            spin_up_time,
            start_stop_count,
            reallocated_sectors,
            seek_error_rate,
            spin_retry_count,
            power_cycle_count,
            reported_uncorrect,
            load_cycle_count,
            pending_sectors,
            offline_uncorrectable,
            crc_error_count,

            critical_warning,
            available_spare,
            available_spare_threshold,
            percentage_used,
            unsafe_shutdowns,
            media_errors,
            data_units_read,
            data_units_written

        )
        VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?
        )
        `,
        [

            summary.driveType,

            summary.model,

            summary.health.healthScore,

            summary.mlPrediction.failureProbability,

            summary.temperature,

            summary.powerOnHours,

            summary.rawReadErrorRate,

            summary.spinUpTime,

            summary.startStopCount,

            summary.reallocatedSectors,

            summary.seekErrorRate,

            summary.spinRetryCount,

            summary.powerCycleCount,

            summary.reportedUncorrect,

            summary.loadCycleCount,

            summary.pendingSectors,

            summary.offlineUncorrectable,

            summary.crcErrorCount,

            summary.criticalWarning,

            summary.availableSpare,

            summary.availableSpareThreshold,

            summary.percentageUsed,

            summary.unsafeShutdowns,

            summary.mediaErrors,

            summary.dataUnitsRead,

            summary.dataUnitsWritten

        ],
        (err) => {

            if (err) {
                console.error(
                    "Insert Error:",
                    err.message
                );
            } else {
                console.log(
                    "SMART snapshot saved"
                );
            }

        }
    );

    return summary;
}

function getSmartHistory() {

    return new Promise((resolve, reject) => {

        db.all(
            `
            SELECT *
            FROM smart_logs
            ORDER BY timestamp DESC
            `,
            [],

            (err, rows) => {

                if (err) {
                    reject(err.message);
                    return;
                }

                resolve(rows);
            }
        );

    });

}

function getDriveInfo(device) {

    return new Promise((resolve, reject) => {

        exec(
            `smartctl -i ${device}`,
            (error, stdout) => {

                if (error) {
                    return reject(error);
                }

                const modelMatch =
                    stdout.match(
                        /Device Model:\s*(.+)/i
                    ) ||
                    stdout.match(
                        /Model Number:\s*(.+)/i
                    );

                const model =
                    modelMatch
                        ? modelMatch[1].trim()
                        : "Unknown";

                let type = "HDD";

                const lowerOutput =
                    stdout.toLowerCase();

                if (
                    lowerOutput.includes("nvme")
                ) {

                    type = "NVMe SSD";

                }
                else if (

                    lowerOutput.includes("ssd") ||

                    model.toLowerCase().includes("ssd")

                ) {

                    type = "SATA SSD";

                }

                resolve({
                    device,
                    model,
                    type,

                    isSSD:
                        type.includes("SSD"),

                    isHDD:
                        type === "HDD"
                });

            }
        );

    });

}

async function getHealthTrends() {

    return new Promise((resolve, reject) => {

        db.all(
            `
            SELECT
                timestamp,
                health_score,
                temperature
            FROM smart_logs
            ORDER BY timestamp ASC
            `,
            [],
            (err, rows) => {

                if (err) {
                    reject(err.message);
                    return;
                }

                resolve(

                    rows.map(row => ({

                        timestamp:
                            row.timestamp,

                        healthScore:
                            row.health_score,

                        temperature:
                            row.temperature

                    }))

                );

            }
        );

    });

}

module.exports = {
    getAvailableDrives,
    getRawSmartData,
    getSmartSummary,
    getSmartHistory,
    saveSnapshot,
    getHealthTrends
};