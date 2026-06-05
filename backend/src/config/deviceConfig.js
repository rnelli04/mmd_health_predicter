let selectedDevice = "/dev/sda";

function getSelectedDevice() {
    return selectedDevice;
}

function setSelectedDevice(device) {
    selectedDevice = device;
}

module.exports = {
    getSelectedDevice,
    setSelectedDevice
};