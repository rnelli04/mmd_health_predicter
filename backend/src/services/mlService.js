const { exec } = require("child_process");

function getFailurePrediction(smartData) {

    return new Promise(
        (resolve, reject) => {

            const payload =
                JSON.stringify(
                    smartData
                );

            exec(
                `/home/segv/Desktop/internship/backend/.venv/bin/python ml/predict.py '${payload}'`,
                (error, stdout, stderr) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(
                        JSON.parse(stdout)
                    );
                }
            );

        }
    );

}

module.exports = {
    getFailurePrediction
};