const ag_psd = require('./index.js');
const engineData = require('./dist/engineData.js');
const json_diff = require('json-diff');
const diff = json_diff.diff;
const diffString = json_diff.diffString;
const fs = require('fs');
// get the directory of this file
const path = require('path');
const dir = path.dirname(__filename);
// then get the parent
const parent = path.dirname(dir);
const ps_test_files = path.join(parent, 'ps_test_files');
// then get the test file at ps_test_files

const test_filename1 = 'blank-text-hor.psd';
const test_filename2 = 'blank-text-ver-center.psd';
const test_filename3 = 'typertools-test.psd';
const test_file1 = path.join(ps_test_files, test_filename1);
const test_file2 = path.join(ps_test_files, test_filename2);
const test_file3 = path.join(ps_test_files, test_filename3);
//F:\workspace\ag-psd\test\write\write-text\expected.psd
// const expected_file = path.join(dir, "test","write","write-text",'expected.psd');
// just read as an array of bytes



function printstuff(file_path){
    var ret = {
        psd: null,
        global_engineData: null,
        layerEngineData: []
    }
    var name = path.basename(file_path);
    const test_psd_buffer = fs.readFileSync(file_path);
    const test_psd = ag_psd.readPsd(test_psd_buffer, { skipLayerImageData: true, skipCompositeImageData: true, skipThumbnail: true });
    ret.psd = test_psd;
    // write json to file
    fs.writeFileSync(path.join(ps_test_files, `${name}_psd.json`), JSON.stringify(test_psd, null, 2));

    if (test_psd.engineData) {
        // enginedata is in base64, so we need to decode it first
        const engine_data = Buffer.from(test_psd.engineData, 'base64');
        const engine_data_obj = engineData.parseEngineData(engine_data);
        console.log("engineData:");
        console.log(engine_data_obj);
        ret.global_engineData = engine_data_obj;
        // write to file
        fs.writeFileSync(path.join(ps_test_files, `${name}_global_engineData.json`), JSON.stringify(engine_data_obj, null, 2));
    }

    var i = 1;
    for (const layer of test_psd.children) {
        if (layer.engineData) {
            const engine_data = Buffer.from(layer.engineData, 'base64');
            const engine_data_obj = engineData.parseEngineData(engine_data);

            // console.log("engineData:");
            // console.log(engine_data_obj);
            ret.layerEngineData.push(engine_data_obj);
            // write to file
            fs.writeFileSync(path.join(ps_test_files, `${name}_layer_${i}_engineData.txt`), require('util').inspect(engine_data_obj, false, 99, false), 'utf8');
            fs.writeFileSync(path.join(ps_test_files, `${name}_layer_${i}_engineData.json`), JSON.stringify(engine_data_obj, null, 2));
        }
        i += 1;
    }
    return ret;
}
// var ret1= printstuff(test_file1);
// var ret2=printstuff(test_file2);
var ret3 = printstuff(test_file3);
// var ret3=printstuff(expected_file);

//let's do a diff
// console.log("\n\n****** psd obj diff:");
// console.log(diff(ret1.psd, ret2.psd));
// console.log("\n\n+++++++ global engineData diff:");
// console.log(diff(ret1.global_engineData, ret2.global_engineData, {full: true, color: true}));
// console.log("\n\n%%%%%%% layer engineData diff:");
// for (var i = 0; i < ret1.layerEngineData.length; i++) {
//     console.log(`\n\n-------- layer ${i} engineData diff:`);
//     console.log(diff(ret1.layerEngineData[i], ret2.layerEngineData[i]));
// }

