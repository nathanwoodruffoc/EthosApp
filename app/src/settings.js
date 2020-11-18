const FS = require("tns-core-modules/file-system");

const filename = "settings.json"
const defaultSettings = {
    // username: "nathan.woodruff",
    username: "",
    token_oc: "",
    token_custom: "",
    useCustomApi: false,
    customApiURL: "https://fotn.club:3001/",
    eventCache: undefined,
    eventLastFetched: undefined
}

export async function get() {
    let path = FS.path.join(FS.knownFolders.temp().path, filename);
    let exists = FS.File.exists(path);
    let file = FS.File.fromPath(path);

    // Debug: rewrite settings file
    // file.remove();
    // exists = FS.File.exists(path);
    // file = FS.File.fromPath(path);

    if (exists) {
        console.log(" Settings file exists.  Reading...")
        return file.readText()
        .then((text) => {
            //console.log("File contents: ", text);
            return JSON.parse(text);
        })
        .catch((err) => {
            console.log("Error when reading settings file: ", err);
            console.log("Settings file is corrupt.  Writing defaults...");
            file.writeText(JSON.stringify(defaultSettings));
            return defaultSettings;
        });
        
    } else {
        console.log("Settings file doesn't exist.  Writing defaults...");
        file.writeText(JSON.stringify(defaultSettings));
        return defaultSettings;
    }
}

export async function write(settings) {
    let path = FS.path.join(FS.knownFolders.temp().path, filename);
    
    let file = FS.File.fromPath(path);
    file.remove();

    file = FS.File.fromPath(path);
    return file.writeText(JSON.stringify(settings));
}