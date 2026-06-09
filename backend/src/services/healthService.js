function calculateHddFailureScore(summary) {

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

function calculateSsdFailureScore(summary) {

    let failureScore = 85;

        const alerts = [];

        if (summary.temperature > 80) {

        failureScore -= 20;

        alerts.push({
            severity: "critical",
            message: "SSD temperature is critical"
        });

    }
    else if (summary.temperature > 70) {

        failureScore -= 10;

        alerts.push({
            severity: "warning",
            message: "SSD temperature is high"
        });

    }
    else if (summary.temperature > 60) {

        failureScore -= 5;

        alerts.push({
            severity: "info",
            message: "SSD temperature is elevated"
        });

    }

    if (summary.criticalWarning > 0) {

        failureScore -= 40;

        alerts.push({
            severity: "critical",
            message: "Critical warning flag active"
        });

    }

    if (summary.mediaErrors > 0) {

        failureScore -= 20;

        alerts.push({
            severity: "critical",
            message: "Media errors detected"
        });

    }

    if (summary.availableSpare < 10) {

        failureScore -= 25;

        alerts.push({
            severity: "critical",
            message: "Available spare critically low"
        });

    } else if (summary.availableSpare < 20) {

        failureScore -= 10;

        alerts.push({
            severity: "warning",
            message: "Available spare decreasing"
        });

    }

    if (summary.percentageUsed > 95) {

        failureScore -= 30;

        alerts.push({
            severity: "critical",
            message: "SSD endurance nearly exhausted"
        });

    } else if (summary.percentageUsed > 80) {

        failureScore -= 15;

        alerts.push({
            severity: "warning",
            message: "SSD wear level is high"
        });

    } else if (summary.percentageUsed > 60) {

        failureScore -= 5;

        alerts.push({
            severity: "info",
            message: "SSD wear level increasing"
        });

    }

    if (summary.unsafeShutdowns > 100) {

        failureScore -= 5;

        alerts.push({
            severity: "warning",
            message: "High unsafe shutdown count"
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

function calculateSsdAgeScore(summary) {

    let ageScore = 15;

    const alerts = [];

    if (summary.powerOnHours > 50000) {

        ageScore -= 5;

        alerts.push({
            severity: "warning",
            message: "SSD has very high operating hours"
        });

    } else if (summary.powerOnHours > 30000) {

        ageScore -= 3;

        alerts.push({
            severity: "info",
            message: "SSD has high operating hours"
        });

    } else if (summary.powerOnHours > 10000) {

        ageScore -= 1;

        alerts.push({
            severity: "info",
            message: "SSD has moderate operating hours"
        });

    }

    if (summary.dataUnitsWritten > 100000000) {

        ageScore -= 3;

        alerts.push({
            severity: "info",
            message: "High write workload detected"
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

function calculateHddAgeScore(summary) {

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

function calculateFailureScore(summary) {

    if (summary.isSSD) {
        return calculateSsdFailureScore(summary);
    }

    return calculateHddFailureScore(summary);
}

function calculateAgeScore(summary) {

    if (summary.isSSD) {
        return calculateSsdAgeScore(summary);
    }

    return calculateHddAgeScore(summary);
}

module.exports = {
    calculateFailureScore,
    calculateAgeScore
};