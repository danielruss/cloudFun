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
    let json={
        'obj1':{
            name:"Daniel",
            action: "was here"
        }
    }
    await newfile.save(JSON.stringify(json) )

    // Send an HTTP response
    res.send(resp);
});

functions.http('s2',async (req,res)=>{
    const storage = new Storage({ keyFilename: "/Users/druss/.gcp/nih-nci-dceg-druss-91b670657c7a.json" });

    const bucketName = 'nih-nci-dceg-druss-bucket1'
    const bucket = storage.bucket(bucketName)
    console.log(bucket)
    const [files] = await bucket.getFiles();
    let resp = 'Ok<br>List of files in the bucket:<ul>'
    files.forEach(file => resp = `${resp}<li>${file.name}</li>`)
    resp += '</ul>'

    res.send(resp);
})