import React, { useEffect, useContext, useRef, useState } from "react";
import {
    useStyles,
} from "./cadSetupStyles";
import {
    CRXTabs,
    CrxTabPanel,
    CRXButton,
    CRXMultiSelectBoxLight,
    CRXCheckBox,
    CRXTooltip,
    CRXToaster,
    TextField,
} from "@cb/shared";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import * as Yup from "yup";
// import XMLViewer from 'react-xml-viewer';asd

interface ConfigurationSettingsProps {
    showSettingsContent: boolean;
    rootNode: Function;
}

const ConfigurationSettings = (props: ConfigurationSettingsProps) => {

    interface xPath {
        key: string;
        value: string;
    }

    const { t } = useTranslation<string>();
    const classes = useStyles();
    const [xmlTabValue, setXmlTabValue] = React.useState<number>(0);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [fromTimezone, setFromTimezone] = useState<object>({ label: 'Central Standard Time (CST)', value: 'Central Standard Time (CST)' })
    const [xmlContent, setXmlContent] = useState<any>('')
    const [uploadedFile, setUploadedFile] = useState<any>()
    const [encoding, setEncoding] = useState<object>({ label: 'UTF-8', value: 'UTF-8' })
    const [isUTC, setIsUTC] = useState<string>("false")
    const [joiningSpecifier, setJoiningSpecifier] = useState<string>("")
    const [friendlyName, setFriendlyName] = useState<string>("")
    const [mappingValue, setMappingValue] = useState<string>("")
    const [mappingXPath, setMappingXpath] = useState<string>("")
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [xmlSettings, setXMLSettings] = React.useState<any>({
        fileDetails: uploadedFile,
        fromTimezone: fromTimezone,
        encoding: encoding,
        isUTC: isUTC,
        joiningSpecifier: joiningSpecifier,
        friendlyName: friendlyName,
        mappingValue: mappingValue,
        mappingXPath: mappingXPath
    })
    const [xPath, setXPath] = useState<xPath[]>([])
    const [defaultPath, setDefaultPath] = useState<xPath[]>([])
    const [showXPaths, setShowXPaths] = useState(false)
    const allowedExtensions = ['.xml', '.csv']
    const nodes = ['Incident', 'Call', 'ComplexCallForService', 'DOC', 'Doc']
    const [showSettings, setShowSettings] = useState(false)
    const toasterRef = useRef<typeof CRXToaster>(null);

    useEffect(() => {
        setXMLSettings({
            joiningSpecifier: joiningSpecifier,
            fromTimezone: fromTimezone,
            isUTC: isUTC,
            encoding: encoding,
            fileDetails: uploadedFile,
            mappingValue: mappingValue,
            mappingXPath: mappingXPath,
            friendlyName: friendlyName
        })
    }, [xmlTabValue])

    useEffect(() => {
        setShowXPaths(false)

        setTimeout(() => {
            setShowXPaths(true)
        }, 1000)
    }, [xmlContent])

    useEffect(() => {
        if (props.showSettingsContent) {
            setTimeout(() => {
                setShowSettings(props.showSettingsContent)
            }, 1000)
        }
    }, [props.showSettingsContent])

    const customTheme = {
        attributeKeyColor: "green",
        attributeValueColor: "blue",
        tagColor: "#c34400"
    };

    const timezones = [
        { label: 'Central Standard Time (CST)', value: 'Central Standard Time (CST)' },
        { label: 'Eastern Standard Time (EST)', value: 'Eastern Standard Time (EST)' },
        { label: 'Pacific Standard Time (PST)', value: 'Pacific Standard Time (PST)' },
        { label: 'Mountain Standard Time (MST)', value: 'Mountain Standard Time (MST)' },
    ];

    const encodings = [
        { label: 'UTF-8', value: 'UTF-8' },
        { label: 'UTF-16', value: 'UTF-16' },
        { label: 'UTF-16 (Big Endian)', value: 'UTF-16 (Big Endian)' },
        { label: 'UTF-16 (Little Endian)', value: 'UTF-16 (Little Endian)' },
        { label: 'UTF-32', value: 'UTF-32' },
        { label: 'UTF-32 (Big Endian)', value: 'UTF-32 (Big Endian)' },
        { label: 'UTF-32 (Little Endian)', value: 'UTF-32 (Little Endian)' },
        { label: 'US-ASCII', value: 'US-ASCII' },
    ];

    const mappingTabs = [
        { label: t("Cad_Event"), index: 0 },
        { label: t("Event_Detail"), index: 1 },
        { label: t("Event_Location"), index: 2 },
        { label: t("Responders"), index: 3 },
        { label: t("Agency"), index: 4 },
    ];

    const xmlTabs = [
        { label: t("File_Specifications"), index: 0 },
        { label: t("Viewer"), index: 1 },
    ];

    function handleXmlTabChange(event: any, newValue: number) {
        setXmlTabValue(newValue);
        const overlay: any = document.getElementsByClassName("overlayPanel");
        overlay.length > 0 && (overlay[0].style.width = "28px")
    }

    const getLinks = (content: string, start: number, index: number) => {
        var str = content;
        var searchKeyword = '"';
        var xlinks: any = xPath
        var defaultLinks: any = defaultPath

        var startingIndices = [];

        var indexOccurence = str.indexOf(searchKeyword, start);

        while (indexOccurence >= 0) {
            startingIndices.push(indexOccurence);

            indexOccurence = str.indexOf(searchKeyword, indexOccurence + 1);
        }

        let path = content.substring(start, startingIndices[1] + 1)

        if (path.includes("=")) {
            let pathArray = path.split('')

            pathArray.map((item, index) => {
                if (item == "=") {
                    pathArray[index] = ":"
                }
            })

            let preColon = pathArray.join('').substring(0, pathArray.indexOf(":"))
            let rejoinedPath = pathArray.join('').slice(preColon.length + 1)

            let keyValueObject = {
                key: preColon,
                value: rejoinedPath
            }

            xlinks.push(keyValueObject)
            setXPath([...xlinks])
        } else {

            var keyValueObject = {}

            if (index == 1) {
                keyValueObject = {
                    key: "x",
                    value: path
                }
            } else {
                keyValueObject = {
                    key: "x" + (index - 1),
                    value: path
                }
            }

            defaultLinks.push(keyValueObject)
            setDefaultPath([...defaultLinks])
        }
    }

    const getXPath = (searchStr: any) => {
        let newXPath = xPath
        let newDefaultPath = defaultPath

        while (newXPath.length) { newXPath.pop(); }
        while (newDefaultPath.length) { newDefaultPath.pop(); }

        setXPath(newXPath)
        setDefaultPath(newDefaultPath)

        var str = searchStr;
        var searchKeyword = "xmlns";

        var startingIndices = [];

        var indexOccurence = str.indexOf(searchKeyword, 0);

        while (indexOccurence >= 0) {
            startingIndices.push(indexOccurence);

            indexOccurence = str.indexOf(searchKeyword, indexOccurence + 1);
        }

        startingIndices.map((item, index) => {
            const colon = item + 6
            getLinks(str, colon, index)
        })
    }

    const checkValidFile = (file: any) => {
        let fileName = file[0].name
        let extension = fileName.slice(-4)

        if (allowedExtensions.includes(extension)) {
            return true
        } else {
            return false
        }
    }

    const xmlValidationSchema = Yup.object().shape({
        fromTimezone: Yup.object().nullable().required("Please select from timezone"),
        encoding: Yup.object().nullable().required("Please select encoding"),
        fileDetails: Yup.mixed().nullable().required("Please upload a file")
            .test("fileType", "Only xml files are supported", value => checkValidFile(value)),
        joiningSpecifier: Yup.string().max(5, 'Joining specifier has a max length of 5 characters')
    });

    const onSubmit = (values: any) => {
        setFormSubmitted(true)
        onSaveForm(true, 'Settings have been saved successfully.')

        let newFormValues = values

        if (joiningSpecifier.length) {
            newFormValues = { ...newFormValues, joiningSpecifier: joiningSpecifier }
        } else {
            newFormValues = { ...newFormValues, joiningSpecifier: " " }
        }

        console.log(newFormValues)
    };

    const getRootNode = (content: any) => {
        let splittedContent = content.split('')
        let count = 0
        let occurence = 0
        const rootNodes: string[] = []

        splittedContent.map((item: string, index: number) => {
            if (item == "<") {
                count++
            }

            if (item == "<" && count == 2) {
                occurence = index
            }
        })

        let final = content.slice(occurence + 1)
        let rootNode = final.slice(0, final.indexOf(">"))

        nodes.map((item) => {
            if (rootNode.includes(item)) {
                rootNodes.unshift(item)
            }
        })

        props.rootNode(rootNodes[0])
    }

    const getXMLFileContent = (e: any) => {
        setUploadedFile(e.target.files[0])
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text: any = (e.target!.result)
            // console.log(text)
            // alert(text)
            setXmlContent(text)
            getXPath(text)
            getRootNode(text)
            onFileUpload(true, 'File loaded successfully, view in XML Viewer tab.')
        };
        reader.readAsText(e.target.files[0])
    }

    const menuOpened = () => {
        console.log('Opened')
    }

    const fileUpload = () => {
        if (hiddenFileInput?.current)
            hiddenFileInput.current.click();
    };

    // const checkForm = () => {
    //     if (encoding != undefined && uploadedFile != undefined && fromTimezone != undefined) {
    //         if (joiningSpecifier.length) {
    //             if (joiningSpecifier.length <= 5) {
    //                 return false
    //             } else {
    //                 return true
    //             }
    //         } else {
    //             return false
    //         }
    //     } else {
    //         return true
    //     }
    // }

    const showMessage = (obj: any) => {
        toasterRef?.current?.showToaster({
            message: obj.message,
            variant: obj.variant,
            duration: obj.duration,
            clearButtton: true,
        });
    };

    const onSaveForm = (isSuccess: boolean, message: string) => {
        showMessage({
            message: message,
            variant: isSuccess ? "success" : "error",
            duration: 5000,
        });
    };

    const onFileUpload = (isSuccess: boolean, message: string) => {
        showMessage({
            message: message,
            variant: isSuccess ? "success" : "error",
            duration: 5000,
        });
    };

    return (
        <div>
            <CRXToaster ref={toasterRef} />
            {showSettings && <div className={classes.settingsContainer}>
                <h2>Configurations</h2>

                <div className={classes.tabsHolder}>
                    <CRXTabs
                        value={xmlTabValue}
                        onChange={handleXmlTabChange}
                        tabitems={xmlTabs}
                        stickyTab={0}
                    />

                    <CrxTabPanel value={xmlTabValue} index={0} customStyle={{ minHeight: 'auto' }}>
                        <Formik
                            enableReinitialize={true}
                            initialValues={xmlSettings}
                            validationSchema={xmlValidationSchema}
                            onSubmit={(values) => {
                                console.log("SUBMIT : " + values);
                            }}
                        >
                            {({ setFieldValue, values, errors, touched, dirty, isValid }) => (
                                <Form>
                                    <div className={classes.formContainer}>
                                        <div className={classes.formSection}>
                                            <h3>File</h3>

                                            <label htmlFor="File Upload">
                                                File Upload
                                            </label>

                                            <CRXButton
                                                onClick={fileUpload}
                                                variant="contained"
                                                className={"groupInfoTabButtons" + ' ' + classes.uploadButton}
                                            >
                                                Upload
                                            </CRXButton>

                                            <input
                                                type="file"
                                                accept=".xml"
                                                ref={hiddenFileInput}
                                                style={{ display: 'none' }}
                                                id="contained"
                                                name="fileDetails"
                                                onChange={(event) => {
                                                    // setFieldValue(
                                                    //     "fileDetails",
                                                    //     event.currentTarget.files
                                                    // ),
                                                    //     getXMLFileContent(event)
                                                }}
                                            />

                                            {uploadedFile && <p style={{ marginBottom: '0px' }}><b>File name: </b><br />{uploadedFile.name}</p>}

                                            {errors.fileDetails !== undefined && formSubmitted ? (
                                                <div className={classes.formError}>
                                                    <i className={"fas fa-exclamation-circle" + " " + classes.errorIcon}></i>
                                                    {errors.fileDetails}
                                                </div>
                                            ) : (
                                                <></>
                                            )}

                                            <br />

                                            <CRXMultiSelectBoxLight
                                                className="DateTimeFormatAutocomplete"
                                                label="Encoding"
                                                multiple={false}
                                                CheckBox={true}
                                                required={false}
                                                options={encodings}
                                                value={values.encoding}
                                                isSearchable={true}
                                                customWidth={'80%'}
                                                onOpen={(e: any) => {
                                                    // menuOpened
                                                }}
                                                onChange={(
                                                    e: React.SyntheticEvent,
                                                    value: string[]
                                                ) => {
                                                    setFieldValue("encoding", value, true);
                                                    setEncoding(value)
                                                }}
                                            />

                                            {errors.encoding !== undefined && formSubmitted ? (
                                                <div className={classes.formError} style={{ marginBottom: '10px' }}>
                                                    <i className={"fas fa-exclamation-circle" + " " + classes.errorIcon}></i>
                                                    {errors.encoding}
                                                </div>
                                            ) : (
                                                <></>
                                            )}

                                            <h3>Date Time Settings</h3>

                                            <div style={{ display: 'flex' }}>
                                                <label htmlFor="isUTC" style={{ marginTop: 10 }}>
                                                    Convert to UTC
                                                </label>
                                                <CRXCheckBox
                                                    checked={
                                                        values.isUTC != "false" ||
                                                        values.isUTC == "true"
                                                    }
                                                    lightMode={true}
                                                    className="crxCheckBoxCreate "
                                                    onChange={() => {
                                                        setFieldValue(
                                                            "isUTC",
                                                            values.isUTC == "true"
                                                                ? "false"
                                                                : "true",
                                                            true
                                                        );
                                                        setIsUTC(values.isUTC == "true"
                                                            ? "false"
                                                            : "true")
                                                    }}
                                                />
                                            </div>

                                            <CRXMultiSelectBoxLight
                                                className="DateTimeFormatAutocomplete"
                                                label="Convert From Timezone"
                                                multiple={false}
                                                CheckBox={true}
                                                required={false}
                                                options={timezones}
                                                customWidth={'80%'}
                                                onOpen={(e: any) => {
                                                    // menuOpened
                                                }}
                                                value={values.fromTimezone}
                                                disabled={isUTC == "false" ? true : false}
                                                isSearchable={true}
                                                onChange={(
                                                    e: React.SyntheticEvent,
                                                    value: string[]
                                                ) => {
                                                    setFieldValue("fromTimezone", value, true)
                                                    setFromTimezone(value)
                                                }}
                                            />

                                            {errors.fromTimezone !== undefined && formSubmitted ? (
                                                <div className={classes.formError}>
                                                    <i className={"fas fa-exclamation-circle" + " " + classes.errorIcon}></i>
                                                    {errors.fromTimezone}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>

                                        <div className={classes.formSection}>
                                            <h3>Namespaces</h3>
                                            {showXPaths && <div>
                                                {defaultPath.length ? defaultPath.map((item) => (
                                                    <p style={{ wordWrap: 'break-word' }}><b style={{ position: 'absolute' }}>{item.key + ':  '}
                                                    </b><span style={{ margin: item.key == "x" ? '0px 18px' : '0px 28px' }}>{item.value}</span></p>
                                                )) : <></>}

                                                {xPath.length ? xPath.map((item) => (
                                                    <p style={{ wordWrap: 'break-word' }}><b>{item.key + ':'}</b><span style={{ margin: '0px 6px' }}>{item.value}</span></p>
                                                )) : <></>}
                                            </div>}

                                            <div className={classes.specifierContainer}>
                                                <h3>Specifier</h3>

                                                <span className={classes.specifierInfoIcon}>
                                                    <CRXTooltip iconName="fas fa-info-circle" arrow={true} title="Applicable for joining XPath array values" placement="right" className="CRXLock" />
                                                </span>

                                                <TextField
                                                    label={'Joining Specifier'}
                                                    value={values.joiningSpecifier}
                                                    placeholder={'SPACE'}
                                                    // onChange={(e: any) => { setFieldValue("joiningSpecifier", e.target.value), setJoiningSpecifier(e.target.value) }}
                                                />

                                                {errors.joiningSpecifier !== undefined && formSubmitted ? (
                                                    <div className={classes.formError}>
                                                        <i className={"fas fa-exclamation-circle" + " " + classes.errorIcon}></i>
                                                        {errors.joiningSpecifier}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>

                                            <div className={classes.specifierContainer}>
                                                <h3>Dependant Field</h3>

                                                <div className={classes.dependantContainer}>
                                                    <div className={classes.questionMarkContainer}>
                                                        ?
                                                    </div>
                                                    <div className={classes.friendlyNameContainer}>
                                                        <TextField
                                                            value={values.friendlyName}
                                                            placeholder={'Friendly Name'}
                                                            // onChange={(e: any) => { setFieldValue("friendlyName", e.target.value), setFriendlyName(e.target.value) }}
                                                        />
                                                    </div>
                                                    <div className={classes.valueContainer}>
                                                        <TextField
                                                            value={values.mappingValue}
                                                            placeholder={'Value'}
                                                            // onChange={(e: any) => { setFieldValue("mappingValue", e.target.value), setMappingValue(e.target.value) }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* <span className={classes.questionMarkInfoIcon}>
                                                    <CRXTooltip iconName="fas fa-info-circle" arrow={true} title="Question Mark (?) is default" placement="right" className="CRXLock" />
                                                </span> */}

                                                <br /><br />

                                                <TextField
                                                    value={values.mappingXPath}
                                                    placeholder={'Mapping'}
                                                    // onChange={(e: any) => { setFieldValue("mappingXPath", e.target.value), setMappingXpath(e.target.value) }}
                                                />

                                                {/* {errors.joiningSpecifier !== undefined && formSubmitted ? (
                                                    <div className={classes.formError}>
                                                        <i className={"fas fa-exclamation-circle" + " " + classes.errorIcon}></i>
                                                        {errors.joiningSpecifier}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )} */}
                                            </div>
                                        </div>
                                    </div>

                                    <br />

                                    <CRXButton
                                        type="submit"
                                        //disabled={checkForm()}
                                        onClick={() => onSubmit(values)}
                                        variant="contained"
                                        className="groupInfoTabButtons"
                                    >
                                        Save
                                    </CRXButton>
                                </Form>
                            )}
                        </Formik>
                    </CrxTabPanel>

                    <CrxTabPanel value={xmlTabValue} index={1} customStyle={{ minHeight: 'auto' }}>
                        <div className={classes.viewWindow} style={{ color: uploadedFile ? 'red' : '#000' }}>
                            {/* {uploadedFile ? <XMLViewer xml={xmlContent} theme={customTheme} collapsible={true} /> : 'Please upload an xml file in File Specifications tab to view.'} */}
                        </div>
                    </CrxTabPanel>
                </div>
            </div>}
        </div>
    );
}

export default ConfigurationSettings