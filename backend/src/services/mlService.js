const { exec } = require("child_process");

function getFailurePrediction(smartData) {

    return new Promise(
        (resolve, reject) => {

            const payload =
                JSON.stringify(
                    smartData
                );

            exec(
                `python ml/predict2.py '${payload}'`,
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