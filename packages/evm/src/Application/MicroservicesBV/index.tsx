import React, { useEffect } from "react";
import { isDebuggerStatement } from "typescript";
import { AuditLogAgent, AuthenticationAgent, CasesAgent, ConfigurationAgent, DeviceHeartBeatAgent, EvidenceAgent, FileAgent, GvsCommandAgent, SearchAgent, SetupConfigurationAgent, UnitsAndDevicesAgent, UsersAndIdentitiesServiceAgent } from "../../utils/Api/ApiAgent";
const MicroservicesBuildVersion = (props:any) => {

    const [buildVersions, setBuildVersions] = React.useState<any>([
        {key: "Evidence", text: ""},
        {key: "UnitsDevices", text: ""},
        {key: "UsersIdentities", text: ""},
        {key: "File", text: ""},
        {key: "AuditLogs", text: ""},
        {key: "Authentication", text: ""},
        {key: "SetupConfiguration", text: ""},
        {key: "Search", text: ""},
        {key: "Cases", text: ""},
        {key: "Configuration", text: ""},
        {key: "DeviceHeartBeat", text: ""},
        {key: "GvsCommand", text: ""}
    ]);

    React.useEffect(() => {
        UnitsAndDevicesAgent.getUnitBuildVersion().then((response:any) => {
            setValue(response,"UnitsDevices");
        });
        UsersAndIdentitiesServiceAgent.getUserBuildVersion().then((response:any) => {
            setValue(response,"UsersIdentities");
        });
        FileAgent.getFileBuildVersion().then((response:any) => {
            setValue(response,"File");
        });
        AuditLogAgent.getAuditLogBuildVersion().then((response:any) => {
            setValue(response,"AuditLogs");
        });
        AuthenticationAgent.getAuthenticationBuildVersion().then((response:any) => {
            setValue(response,"Authentication");
        });
        EvidenceAgent.getEvidenceBuildVersion().then((response:any) => {
            setValue(response,"Evidence");
        });
        SetupConfigurationAgent.getSetupConfigurationBuildVersion().then((response:any) => {
            setValue(response,"SetupConfiguration");
        });
        SearchAgent.getSearchBuildVersion().then((response:any) => {
            setValue(response,"Search");
        });
        CasesAgent.getCasesBuildVersion().then((response:any) => {
            setValue(response,"Cases");
        });
        ConfigurationAgent.getConfigurationBuildVersion().then((response:any) => {
            setValue(response,"Configuration");
        });
        DeviceHeartBeatAgent.getDeviceHeartBeatBuildVersion().then((response:any) => {
            setValue(response,"DeviceHeartBeat");
        });
        GvsCommandAgent.getDeviceHeartBeatBuildVersion().then((response:any) => {
            setValue(response,"GvsCommand");
        });
    },[])

    const setValue = (response: any, serviceName: any) => {
        let tempBuildVersions = [...buildVersions];
        let tempBuildVersion = tempBuildVersions.find((x: any) => x.key == serviceName);
        tempBuildVersion.text = response
        setBuildVersions(tempBuildVersions)
    };

    return (
        <div  style={{margin: "160px 0 0 200px", fontSize : "14px"}}>
            <table style={{ border: '1px solid #000', fontSize: '20px'}}>
                <tr >
                    <th  style={{padding: "5px" , width: '250px' , textAlign: 'left' , border: '1px solid'}}>Microservices</th>
                    <th style={{border: '1px solid'}}>Build Version</th>
                </tr>
                {buildVersions.map((x:any)=>
                    {return <tr>
                                <td style={{padding: "5px" , marginLeft : '50px' , border: '1px solid'}}>{x.key}</td>
                                <td style={{border: '1px solid'}}>{x.text}</td>
                            </tr>
                    }
                )}
            </table>
        </div>
    );
};

export default MicroservicesBuildVersion;
