function calculateFailureScore(summary) {

    let failureScore = 85;

    const alerts = [];

    if (summary.temperature > 60) {
        failureScore -= 20;

        alerts.push({
            severity: "critical",
            message: "Drive temperature is critical"
        });
    }
    else if (summary.temperature > 50) {
        failureScore -= 10;

        alerts.push({
            severity: "warning",
            message: "Drive temperature is high"
        });
    }
    else if (summary.temperature > 45) {
        failureScore -= 5;

        alerts.push({
            severity: "warning",
            message: "Drive temperature is elevated"
        });
    }

    if (summary.reallocatedSectors > 50) {
        failureScore -= 20;

        alerts.push({
            severity: "critical",
            message: "Large number of bad sectors detected"
        });
    }
    else if (summary.reallocatedSectors > 10) {
        failureScore -= 10;

        alerts.push({
            severity: "warning",
            message: "Bad sectors detected"
        });
    }
    else if (summary.reallocatedSectors > 0) {
        failureScore -= 5;

        alerts.push({
            severity: "warning",
            message: "Some reallocated sectors detected"
        });
    }

    if (summary.pendingSectors > 0) {
        failureScore -= 15;

        alerts.push({
            severity: "critical",
            message: "Pending sectors detected"
        });
    }

    if (summary.offlineUncorrectable > 0) {
        failureScore -= 15;

        alerts.push({
            severity: "critical",
            message: "Uncorrectable sectors found"
        });
    }

    if (summary.reportedUncorrect > 1000) {

        failureScore -= 15;

        alerts.push({
            severity: "critical",
            message: "Large number of reported uncorrectable errors detected"
        });

    } else if (summary.reportedUncorrect > 100) {

        failureScore -= 10;

        alerts.push({
            severity: "warning",
            message: "Reported uncorrectable errors detected"
        });

    } else if (summary.reportedUncorrect > 0) {

        failureScore -= 5;

        alerts.push({
            severity: "info",
            message: "A small number of reported uncorrectable errors detected"
        });
    }

    if (summary.crcErrorCount > 100) {

        failureScore -= 10;

        alerts.push({
            severity: "critical",
            message: "High number of CRC communication errors detected"
        });

    } else if (summary.crcErrorCount > 0) {

        failureScore -= 5;

        alerts.push({
            severity: "warning",
            message: "CRC communication errors detected"
        });
    }

    if (failureScore < 0) {
        failureScore = 0;
    }

    return {
        failureScore,
        alerts
    };
}

function calculateAgeScore(summary) {

    let ageScore = 15;

    const alerts = [];

    if (summary.powerOnHours > 50000) {

        ageScore -= 5;

        alerts.push({
            severity: "warning",
            message: "Drive has very high operating hours"
        });

    } else if (summary.powerOnHours > 30000) {

        ageScore -= 3;

        alerts.push({
            severity: "info",
            message: "Drive has high operating hours"
        });

    } else if (summary.powerOnHours > 10000) {

        ageScore -= 1;

        alerts.push({
            severity: "info",
            message: "Drive has moderate operating hours"
        });
    }

    if (summary.startStopCount > 50000) {

        ageScore -= 2;

        alerts.push({
            severity: "info",
            message: "High start-stop cycle count"
        });
    }

    if (summary.powerCycleCount > 10000) {

        ageScore -= 1;

        alerts.push({
            severity: "info",
            message: "High power cycle count"
        });
    }

    if (summary.loadCycleCount > 300000) {

        ageScore -= 1;

        alerts.push({
            severity: "info",
            message: "High load cycle count"
        });
    }

    if (summary.spinUpTime > 10000) {

        ageScore -= 1;

        alerts.push({
            severity: "info",
            message: "Spin-up time is unusually high"
        });
    }

    if (ageScore < 0) {
        ageScore = 0;
    }

    return {
        ageScore,
        alerts
    };
}

module.exports = {
    calculateFailureScore,
    calculateAgeScore
};