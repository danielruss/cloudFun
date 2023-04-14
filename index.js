const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');

// Register an HTTP function with the Functions Framework
functions.http('myHttpFunction', async (req, res) => {

    // Your code here

    let storage = new Storage();
    if (process.env?.KEY_PATH) {
        console.log(`key file: ${process.env.KEY_PATH}`)
        storage = new Storage({ keyFilename: process.env.KEY_PATH });
    }

    const bucketName = 'nih-nci-dceg-druss-bucket1'
    const bucket = storage.bucket(bucketName)
    const [files] = await bucket.getFiles();


    let resp = 'Ok<br>List of files in the bucket:<ul>'
    files.forEach(file => resp = `${resp}<li>${file.name}</li>`)
    resp += '</ul>'

    // note: this does not actually create a file...
    const newfile = bucket.file('This-Is-A-Test-File.json');
    resp += `<br>${newfile.name} ${newfile.cloudStorageURI}`
    let json = {
        'obj1': {
            name: "Daniel",
            action: "was here"
        }
    }
    await newfile.save(JSON.stringify(json))

    // Send an HTTP response
    res.send(resp);
});

async function read_file(file) {
    // https://stackoverflow.com/questions/51970205/how-to-read-content-of-json-file-uploaded-to-google-cloud-storage-using-node-js
    // https://stackoverflow.com/questions/58431076/how-to-use-async-await-with-fs-createreadstream-in-node-js
    let buf = ""
    let done = false
    return new Promise((resolve, reject) => {
        file.createReadStream()
            .on('data', d => (buf += d))
            .on('end', () => {
                console.log(".... end ... \n", buf)
                resolve(buf)
            })
            .on('error', e => reject(e))
    })
}

functions.http('s2', async (req, res) => {
        const storage = new Storage({ keyFilename: "/home/druss/nih-nci-dceg-druss-91b670657c7a.json" });

        const bucketName = 'nih-nci-dceg-druss-bucket1'
        const bucket = storage.bucket(bucketName)
        console.log(bucket)
        const [files] = await bucket.getFiles();
        let resp = 'Ok<br>List of files in the bucket:<ul>'
        files.forEach(file => resp = `${resp}<li>${file.name}</li>`)
        resp += '</ul><hr> read the contents of data/This-Is-A-Test-File.json:'

        let file = bucket.file('data/This-Is-A-Test-File.json')
        let txt = await read_file(file)
        resp += `<pre>${txt}</pre>`

        res.send(resp);
    })