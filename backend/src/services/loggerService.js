const smartService =
    require("./smartService");

async function logSmartData() {

    try {

        await smartService.saveSnapshot();

        console.log(
            `[${new Date().toISOString()}] SMART snapshot saved`
        );

    } catch (err) {

        console.log(
            `[${new Date().toISOString()}] Device unavailable`
        );

    }

}

module.exports = {
    logSmartData
};