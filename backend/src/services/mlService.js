const { exec } = require("child_process");
const path = require("path");

function getFailurePrediction(smartData) {

    return new Promise((resolve, reject) => {

        const payload = JSON.stringify(smartData);

        const pythonPath =
            process.platform === "win32"
                ? "python"
                : path.join(
                    process.cwd(),
                    ".venv",
                    "bin",
                    "python"
                );

        exec(
            `"${pythonPath}" ml/predict2.py '${payload}'`,
            (error, stdout, stderr) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve(JSON.parse(stdout));
            }
        );

    });

}

module.exports = {
    getFailurePrediction
};