import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import getacLogo from '../../../Assets/Images/logo.png';
import moment from "moment";
import { CASE_AUDIT_TYPE, CASE_STATE } from '../CaseTypes';
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import { IDecoded } from '../../../Login/API/auth';
import { convertDateTimeToLocalInString, getFormattedDateTime } from './globalFunctions';

export const DownloadAuditTrail = (caseDetail?: any, caseAudit? : any, assetAudit? : any, tenantSetting?: any) => {
  const cookies = new Cookies();
  let decode : IDecoded | null = null;

  const access_token = cookies.get('access_token')
    if(access_token) {
       decode = jwtDecode(access_token)
    }
    
    if (caseDetail) {
      let caseTitle = `${caseDetail.caseTitle || caseDetail.title || ''}`
      const getFormattedDate = (date:string) => {
        if(typeof date === "string" && date.length > 1) {
          return getFormattedDateTime(date, tenantSetting); 
        }
        return ""
      }
      const addFooter = (doc:any) => {
        //Footer
        const pageCount = doc.internal.getNumberOfPages();
         var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
         var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
         let DateTimeNow = getFormattedDate(new Date().toLocaleString());
        doc.setTextColor(100);
        doc.setFontSize(10);
        doc.setFont('bold')
        for (var i = 1; i <= pageCount; i++) {
          doc.setPage(i)
           doc.text('Page ' + String(i) + ' of ' + String(pageCount) , pageWidth - 62, pageHeight  - 10, {align: 'center'});
           doc.text((`${caseTitle || ''} Audit Report ${DateTimeNow}`), pageWidth - 451, pageHeight - 10,{align: 'center'});
         }
      }
      var doc = new jsPDF('p', 'pt','a4');
  
      const head = [[('Seq No'), ('Captured'), ('Username'), ('Activity')]];
      let data : any[] = [];
      let arrS: any[] = [];
      
      if (caseAudit && caseAudit.length > 0) {
        let seqNo = caseAudit.length
        caseAudit.map((x:any, index: number) => {
            arrS.push(String(seqNo--));
            arrS.push(getFormattedDate(x.history.createdOn));
            arrS.push(x.userName)
            if(x.type === CASE_AUDIT_TYPE.StatusUpdate) {
              arrS.push(convertDateTimeToLocalInString((x.text), tenantSetting ?? null));
            }
            else {
              arrS.push(x.text);
            }
            data.push(arrS);
            arrS = [];
        });
      }
      autoTable(doc,{
        theme: 'grid',
        startY : 60,
        bodyStyles: { fontSize: 10,lineColor : 'black' },
        columnStyles: {
          0: {cellWidth: 200},
          1: {cellWidth: 'auto'},
        }, 
        body: [['Audit Trail Report Created for:', `${decode && decode.LoginId.includes('@') && decode.LoginId.split("@")[0]  || ''}`], ['Generated On:', getFormattedDate(new Date().toLocaleString())]],
        didDrawPage: function (data) {
          //Header
          if (getacLogo) {
            doc.addImage(getacLogo, 'JPEG', data.settings.margin.left, 15, 60, 30);
          }
        },
      });
  
      autoTable(doc,{
        body: [['Case Details:']],
      });
      doc.setFontSize(10)
      let yaxis1 = 40;
      let yaxis2 = 140;
      let xaxis = 165;

      
    
      doc.text(("Case ID") + ":", yaxis1, 165)
      doc.text(caseTitle, yaxis2, xaxis)
      xaxis += 20;

      const isValidDate = (date: string) => {
        if (typeof date === "string" && date.length > 0) {
            let formattedDate = new Date(date).toLocaleString();
            return formattedDate;
        }
        return ""
      }
      
      const getCloseStateId = (caseDetail: any) => {
        if(caseDetail.state && caseDetail.state >=0 && typeof(caseDetail.state === 'number')){
          return caseDetail.state
        }
        return caseDetail.stateId;
      }

      const getdescriptionText = (caseDetail: any) => {
        if(caseDetail.description != undefined && caseDetail.description.plainText != undefined){
          return caseDetail.description.plainText
        }
        return caseDetail.caseSummary   
      }

      let updatedOn = caseDetail.updatedOn ?? getFormattedDate(caseDetail.history.modifiedOn);
      let createdOn =  caseDetail.createdOn ?? getFormattedDate(caseDetail.history.createdOn);
      let description = getdescriptionText(caseDetail) ?? ""

      doc.text(("CAD ID") + ":", yaxis1, xaxis)
      doc.text(`${caseDetail.cadId.toString() || '' }`, yaxis2, xaxis)
      xaxis += 20;
  
      doc.text(("Case Lead") + ":", yaxis1, xaxis)
      doc.text(`${caseDetail.userName || '' }`, yaxis2, xaxis)
      xaxis += 20;
  
      doc.text(("Created On") + ":", yaxis1, xaxis)
      doc.text((`${createdOn || ''}`), yaxis2, xaxis)
      xaxis += 20;
  
      doc.text(("Updated On") + ":", yaxis1, xaxis)
      doc.text((`${updatedOn || ''}`), yaxis2, xaxis)
      xaxis += 20;
  
      doc.text(("Case Status") + ":", yaxis1, xaxis)
      doc.text(`${caseDetail.statusName || ''}`, yaxis2, xaxis)
      xaxis += 20;

      let stateId = getCloseStateId(caseDetail) ?? 0

      if(stateId== CASE_STATE.Closed) {
        doc.text(("Case Reason") + ":", yaxis1, xaxis)
        doc.text(`${caseDetail.caseClosedReasonName || ''}`, yaxis2, xaxis)
        xaxis += 20;
  
        doc.text(("Closed By") + ":", yaxis1, xaxis)
        doc.text(`${caseDetail.closedByName || ''}`, yaxis2, xaxis)
        xaxis += 20;
      }

      autoTable(doc,{
          didDrawPage: function (data) {
            var lineHeight = 13
            var wrapWidth = 420
            doc.text(("Case Summary") + ":", yaxis1, xaxis)
            var splitText = doc.splitTextToSize(`${description}`, wrapWidth)
            for (var i = 0, length = splitText.length; i < length; i++) {
            doc.setFontSize(10)
              // loop thru each line and increase
              doc.text(splitText[i], yaxis2, xaxis)
              xaxis = lineHeight + xaxis
            }
          },
        startY : xaxis,
      });
  
      autoTable(doc,{
        body: [[`Case ${caseTitle} Audit `]],
        startY: xaxis
      });
  
      autoTable(doc,{
        theme: 'grid',
        headStyles: { fontSize: 10, lineWidth : 1, lineColor : 'black',fillColor: "#595959"  },
        bodyStyles: { fontSize: 10,lineWidth : 1,lineColor : 'black' },
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: head,
        body : data,
        columnStyles: {
          0: {cellWidth: 60},
          1: {cellWidth: 130},
          2: {cellWidth: 100},
          3: {cellWidth: 'auto'},
        },
        margin : {
          top : 50
        }
      });
      
        if(assetAudit && assetAudit.length > 0) {
          let assetdata : any[] = [];
          let arrS2: any[] = [];
          assetAudit.forEach((x:any) => {
            if(x.auditData && x.auditData.length > 0) {
              x.auditData.forEach((y:any) => {
              let userName = y.userName && y.userName.includes('@') && y.userName.length > 0 ?  y.userName.split("@")[0] : ""
                arrS2.push(y.seqNo);
                arrS2.push((getFormattedDate(new Date(y.performedOn).toLocaleString())));
                arrS2.push(userName)
                arrS2.push(y.notes);
                assetdata.push(arrS2);
                arrS2 = [];
              })
              autoTable(doc,{
                body: [[`Asset ${x.assetName.toString() || ''} Audit `]],
              });
              autoTable(doc,{
                theme: 'grid',      
                headStyles: { fontSize: 10, lineWidth : 1, lineColor : 'black', fillColor: "#595959" },
                bodyStyles: { fontSize: 10,lineWidth : 1,lineColor : 'black' },
                head: head,
                body : assetdata,
                columnStyles: {
                  0: {cellWidth: 60},
                  1: {cellWidth: 130},
                  2: {cellWidth: 100},
                  3: {cellWidth: 'auto'},
                }, 
                margin : {
                  top : 50
                }
              });
              assetdata = [];
            }
          })
        }
      addFooter(doc);
      let timestamp = moment(new Date()).format("DDMMYYYY")
      doc.save(`${caseTitle || ''}_Audit_Trail_${timestamp}.pdf`);
    }
  }