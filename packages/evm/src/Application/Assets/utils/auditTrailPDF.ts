import jsPDF from "jspdf";
import { getToken } from "../../../Login/API/auth";
import autoTable from "jspdf-autotable";
import jwt_decode from "jwt-decode";
import { convertTimeToAmPm } from "../../../utils/convertTimeToAmPm";

const auditTrailPDFDownload = (assetTrail: any, assetInfo: any, uploadedOn: any, image: any)  => {
    let token = getToken();
    let accessTokenDecode: any = jwt_decode(token);
    let date = new Date();
    let data1: any[] = [];    
    let arrS1: any[] = [];
    arrS1.push(("Audit Trail Report Created for:"));
    arrS1.push(accessTokenDecode.FName + " " + accessTokenDecode.LName);
    data1.push(arrS1);
  
    arrS1 = [];
    arrS1.push("Generated On:");
    arrS1.push((date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" @ "+date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),{textColor: 'red'});
    data1.push(arrS1);
    const doc = new jsPDF();
   
    let yaxis1 = 14;
    let yaxis2 = 45;
    let xaxis = 27;
    autoTable(doc, {
      columnStyles: {
        0: {cellWidth: 70,lineColor : 'black',textColor:"black",fontSize:11,fontStyle:"normal"},
        1: {cellWidth: "auto",lineColor : 'black',textColor:"black",fontSize:11,fontStyle:"normal"},
      },
      startY: xaxis,
      showHead: 'never',
      body: data1,
      theme: 'grid',
      didDrawCell: (data: any) => {
        if (image) {
          doc.addImage(image, 'PNG', 15, 10, 28, 8)
        }
      },
    });
    let data: any[] = [];
    let arrS: any[] = [];
    doc.setFontSize(11);  
    
    
    xaxis = (doc as any).lastAutoTable.finalY + 12;
    yaxis1 += 2;
    doc.setFillColor(217, 217, 217);
    doc.rect(14,50,182,7, "f");
    doc.setTextColor(0, 0, 0);
    doc.text("Asset Details", yaxis1, xaxis);
    doc.setTextColor(0, 0, 0);
    yaxis1 += -1;
    xaxis += 15;
 
    let CheckSum = assetInfo.checksum ? assetInfo.checksum.toString() : "";
    doc.text("Asset Name" + ":", yaxis1, xaxis);
    doc.text(assetInfo.assetName, yaxis2, xaxis, { maxWidth: 148 });
    xaxis += 8;
    

    let tempxaxis = 0;
    
    doc.text("Categories" + ":", yaxis1, xaxis);
    doc.text(assetInfo.categories, yaxis2, xaxis, { maxWidth: 148 });
    xaxis += tempxaxis + 8;

    doc.text("Recorded By" + ":", yaxis1, xaxis);
    doc.text(assetInfo.owners, yaxis2, xaxis, { maxWidth: 148 });
    xaxis += 8;

    doc.text("Captured" + ":", yaxis1, xaxis);
    doc.text(assetInfo.capturedDate, yaxis2, xaxis, { maxWidth: 148 });
    xaxis += 8;

    doc.text("Uploaded" + ":", yaxis1, xaxis);
    doc.text(uploadedOn, yaxis2, xaxis, { maxWidth: 148 });
    xaxis += 8;

    doc.text("Unit ID" + ":", yaxis1, xaxis);
    doc.text(assetInfo.unit, yaxis2, xaxis, { maxWidth: 148 });
    xaxis += 8;

    doc.text("CheckSum" + ":", yaxis1, xaxis);
    doc.text(CheckSum, yaxis2, xaxis, { maxWidth: 148 });
    xaxis += 15;
    yaxis1 += 1;
    doc.setFillColor(217, 217, 217);
    doc.rect(14,128,182,7, "f");
    doc.setTextColor(0, 0, 0);
    doc.text("Asset Audit Trail", yaxis1, xaxis);
    xaxis += 10;
    const head = [["Seq. No", "Captured", "User", "Activity"]];
    assetTrail.forEach((x: any) => {
      arrS.push(x.seqNo);
      arrS.push(new Date(x.performedOn).toLocaleString());
      arrS.push(x.userName);
      arrS.push(x.notes);
      data.push(arrS);
      arrS = [];
    });

    autoTable(doc, {
      headStyles: { textColor:"#ffffff",fontSize: 11, lineWidth: 0.3,lineColor : 'black',fillColor: "#595959",valign:"middle",cellPadding:3,fontStyle:"normal"},
      columnStyles: {
        0: {cellWidth: 20,lineColor : 'black',textColor:"black",fontSize:11,cellPadding:2,fontStyle:"normal"},
        1: {cellWidth: 44,lineColor : 'black',textColor:"black",fontSize:11,cellPadding:2,fontStyle:"normal"},
        2: {cellWidth: 43,lineColor : 'black',textColor:"black",fontSize:11,cellPadding:2,fontStyle:"normal"},
        3: {cellWidth: "auto",lineColor : 'black',textColor:"black",fontSize:11,cellPadding:2,fontStyle:"normal"},
      },
      startY: xaxis,
      head: head,
      body: data,
      theme: 'grid',
      didDrawCell: (data: any) => {
      },
    });
    let assetName = assetInfo.assetName?.length > 0 ? assetInfo.assetName : "ASSET ID";
    doc.save(assetName + "_Audit_Trail.pdf");
}

export const toDataURL = (url: any) => fetch(url)
.then(response => response.blob())
.then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
}))

export const convertDateTime = (date: string) => {
    const newDate = date.split("T");
    const [yy, mm, dd] = newDate[0].split("-");
    newDate[0] = `${mm}/${dd}/${yy}`;
    newDate[1] = convertTimeToAmPm(newDate[1]);
    return newDate;
};


export default auditTrailPDFDownload;