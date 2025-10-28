import {Parser} from 'json2csv';
import  ExcelJS from 'exceljs';

class NurseDownloadController {
    constructor(service){
        this.service=service;
    }

    downloadCSV = async (req,res)=>{
        const nurses = await this.service.getAll();
        const parser = new Parser();
        const csv = parser.parse(nurses.map(n=>n.get({plain:true})))
        res.header('content-type','text/csv');
       res.attachment('nurses.csv');
        res.send(csv);
    }

    downloadXLSX = async (req,res)=>{
        const nurses = await this.service.getAll();
        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet("Nurses");
        ws.columns=[
            {header:"Id",key:"id",width:10},
            {header:"Name",key:"name",width:30},
            {header:"License Number",key:"licenseNumber",width:20},
            {header:"DOB",key:"dob",width:30},
            {header:"Age",key:"age",width:5}
        ]
        nurses.forEach(n =>ws.addRow(n.get({plain:true})));
        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition','attachment; filename=nurses.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    }
}

export default NurseDownloadController;