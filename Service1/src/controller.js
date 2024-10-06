const os = require('os');
const { exec } = require('child_process');

const getIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'IP address not found';
};

const getRunningProcesses = () => {
    return new Promise((resolve, reject) => {
        exec('ps -aux', (error, stdout, stderr) => {
            if (error) {
                resolve('No process found');
                return;
            }
            if (stderr) {
                resolve('No process found');
                return;
            }
            resolve(stdout);
        });
    });
};

const getDiskSpace = () => {
    return new Promise((resolve, reject) => {
        exec('df -h', (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`Stderr: ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
};

const getUptime = () => {
    const uptimeSeconds = os.uptime();
    const days = Math.floor(uptimeSeconds / (24 * 3600));
    const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const getSystemInfo = async () => {
    try {
        const ipAddress = getIpAddress();
        const uptime = getUptime();
        const diskSpace = await getDiskSpace();
        const runningProcesses = await getRunningProcesses();
        console.log("ipAddress", ipAddress);
        console.log("uptime", uptime);
        console.log("diskSpace", diskSpace);
        console.log("runningProcesses", runningProcesses);

        return {
            message: 'Service1 is running',
            ipAddress,
            uptime,
            diskSpace,
            runningProcesses
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            message: 'Error retrieving system information',
            error: error.message
        };
    }
};

exports.getResponse = async (req, res) => {

    // res.status(200).send('Service1 is running');
    const sysInfo = await getSystemInfo();
    res.status(200).json({
        message: "Service1 is running",
        data: {
            ipAddress: sysInfo.ipAddress,
            uptime: sysInfo.uptime,
            diskSpace: sysInfo.diskSpace,
            runningProcesses: sysInfo.runningProcesses
        }

    });
    
};