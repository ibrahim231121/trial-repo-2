import { useEffect, useRef, useState } from "react";
import { AlprCapturePlateInfo } from "../../../utils/Api/models/AlprCapturePlateInfo";
import { CRXRows } from "@cb/shared";
import { CRXColumn } from "@cb/shared";
import { DateTimeComponent, DateTimeObject } from "../../../GlobalComponents/DateTime";
import { useTranslation } from "react-i18next";
import { basicDateDefaultValue, dateOptionsTypes } from "../../../utils/constant";
import moment from "moment";
import { CRXButton } from "@cb/shared";
import jwt_decode from "jwt-decode";
import Cookies from "universal-cookie";
import { IDecoded } from "../../../Login/API/auth";
import AdvanceOption from "./AdvanceOption";
import AlprPredictiveSearchBox from '../AdvanceSearch/PredectiveSearch/PredectiveSearch';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import "./PredectiveSearch/PredectiveSearch.scss"
import "./AlprAdvanceSearch.scss"
import AdvanceSearchLister from "./AdvanceSearchDataTable/Index";
import { GenerateLockFilterQuery, SearchType } from "../../Assets/utils/constants";
import { ClearAdvanceSearchProperty, getAlprSearchInfoAsync, getNumberPlateSearchNameAsync } from "../../../Redux/AlprAdvanceSearchReducer";
import { useHistory } from "react-router-dom";
import { urlList, urlNames } from "../../../utils/urlList";
import { IconButton } from "@material-ui/core";
import { CRXTooltip } from "@cb/shared";
import { CRXAlert } from "@cb/shared";
import { alprToasterMessages } from "../AlprGlobal";
import { AlprAdvanceSearchModel } from "../../../utils/Api/models/AlprAdvanceSearch";
const AlprAdvanceSearchInitialValues: AlprAdvanceSearchModel =
{
    recId: 0,
    capturePlate: '',
    numberPlate: '',
    hotlistName: '',
    capturedAt: '',
    stateName: '',
    unitId: '',
    user: '',
    confidence: '',
    ticketNumber: '',
    longitude: 0,
    latitude: 0,
    ncicNumber: '',
    dateOfInterest: '',
    licenseYear: '',
    licenseType: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    insertType: '',
    status: '',
    note: '',
    firstName: '',
    lastName: '',
    violationInfo: '',
}
const AlprAdvanceSearch = (props: any) => {
    const responseForSearch: AlprAdvanceSearchModel[] = useSelector(
        (state: RootState) => state.alprAdvanceSearchReducer.alprSearchInfo
    );
    const responseForSearchName: any = useSelector(
        (state: RootState) => state.alprAdvanceSearchReducer.alprSearchName
    );
    const history = useHistory();
    const dispatch = useDispatch();
    const [showShortCutSearch, setShowShortCutSearch] = useState(true);
    const [searchPanelModal, setSearchPanelModal] = useState<string>("Alpr_panel_show");
    const [fieldsNumber, setFieldsNumber] = useState(0);
    const [searchPanelIdentifer, setSearchPanelIdentifer] = useState<boolean>(false);
    const [searchData, setSearchData] = useState<AlprAdvanceSearchModel[]>([]);
    const [dateOptionType, setDateOptionType] = useState(dateOptionsTypes.basicoptions);
    const [predictiveText, setPredictiveText] = useState('');
    const [advanceSearchText, setAdvanceSearchText] = useState<any[]>([]);
    const [showAdvance, setShowAdvance] = useState(false);
    const [addvancedOptions, setAddvancedOptions] = useState<any>();
    const [showAdvanceSearch, setAdvanceSearch] = useState(false);
    const [stickyBorder, setStickyBorder] = useState(false);
    const [searchResult, setSearchResult] = useState<boolean>(false);
    const [isEmptySearch, setIsEmptySearch] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<any>({
        message: "",
        type: "",
        alertType: ""
    });
    const [searchResultText, setSearchResultText] = useState<any>({
        type: '',
        name: ''
    });
    const cookies = new Cookies();
    let decoded: IDecoded = jwt_decode(cookies.get("access_token"));
    const [querryString, setQuerryString] = useState('');
    const [compactDateRange, setCompactDateRange] = useState({
        showCompact: false,
        minDate: "",
        maxDate: ""
    });
    const QUERRY: any = {
        query_string: {
            query: {
                "numberPlate": `${querryString}`,
                "fromDate": null,
                "toDate": null
            },
        },
    };
    const AdvancedSearchQuerry: any = {
        query_string: {
            query: {
                "unitId": null,
                "userId": null,
                "hotlist": null,
                "state": null,
                "fromDate": null,
                "toDate": null,
                "numberPlateId": null,
                "numberPlate": null
            }
        }
    };


    const [dateTimeDropDown, setDateTimeDropDown] = useState<DateTimeObject>({
        startDate: moment().startOf("day").subtract(10000, "days").set("second", 0).format(),
        endDate: moment().endOf("day").set("second", 0).format(),
        value: basicDateDefaultValue,
        displayText: basicDateDefaultValue
    });

    const [dateTime, setDateTime] = useState<DateTimeObject>({
        startDate: "",
        endDate: "",
        value: "",
        displayText: ""
    });

    const searchBar: any = useRef();
    const adSearchBar: any = useRef()
    const titleSearchBox: any = useRef();
    const [isSearchBtnDisable, setIsSearchBtnDisable] = useState<boolean>(true);
    const { t } = useTranslation<string>();
    const [isOverLay, setIsOverlay] = useState<boolean>(false);

    const iconRotate = showAdvance ? ' ' : 'rotate90';
    const PreSearchButtonClass = showAdvance ? "Alpr_PreSearchButton_Open" : "PreSearchButton_Close";
    const fieldsNumberClass = fieldsNumber == 1 ? "alpr_scrollMainPage_1" : fieldsNumber == 2 ? "Alpr_scrollMainPage_2" : "";
    const stickyBorderClass = stickyBorder ? "Alpr_stickyBorder_Add" : "stickyBorder_Remove";
    useEffect(() => {
        setSearchData([]);
    }, []);
    useEffect(() => {
        dispatch(enterPathActionCreator({ val: `` }));
    }, [])

    useEffect(() => {
        document.addEventListener("scroll", () => {
            if (window.pageYOffset > 100) {
                setStickyBorder(true);
            } else {
                setStickyBorder(false);
            }
        })
    }, [])

    useEffect(() => {
        showAdvanceSearch == true ? setSearchPanelModal("Alpr_panel_show Alpr_main_master_page_panel") : setSearchPanelModal("Alpr_panel_hide")
    }, [showAdvanceSearch])

    useEffect(() => {
        if( showAdvanceSearch == true ) {
         window.scrollTo({ top: 0, behavior: "smooth" });
     
        }else {
         window.scrollTo({ top: 2, behavior: "smooth" });
         
        }
        
        
    }, [searchData]);
    useEffect(() => {
        // NOTE: To Enable Search Button, on the basis of Query String.
        if (dateTimeDropDown.value === 'anytime' && querryString.length > 0)
            setIsSearchBtnDisable(false);
        else if (dateTimeDropDown.value === 'anytime' && querryString.length === 0) {
            setIsSearchBtnDisable(true);
        }
    }, [querryString]);

    useEffect(() => {
        if (dateTimeDropDown.value === 'anytime' && querryString.length === 0)
            setIsSearchBtnDisable(true);
        else
            setIsSearchBtnDisable(false);
    }, [dateTimeDropDown]);

    useEffect(() => {
        if (props.isopen) {
            dispatch(getAlprSearchInfoAsync({ QUERRY: "", searchType: "" }));
            dispatch(getNumberPlateSearchNameAsync({ QUERRY: "", dateTime: dateTimeDropDown, SearchType: "" }));
            setShowShortCutSearch(false);
            if (addvancedOptions && addvancedOptions.options) {
                setAdvanceSearch(true);
            }

        }
        else {
            setDateTimeDropDown({
                startDate: moment().startOf("day").subtract(10000, "days").set("second", 0).format(),
                endDate: moment().endOf("day").set("second", 0).format(),
                value: basicDateDefaultValue,
                displayText: basicDateDefaultValue
            });
            setPredictiveText('')
            setSearchData([])
            setShowShortCutSearch(true);
            setAdvanceSearch(true);
        }
        return () => {
            dispatch(enterPathActionCreator({ val: "" }));
        }
    }, [props.isopen]);

    useEffect(() => {
        let obj: any = {};
        if (addvancedOptions && addvancedOptions.options) {
            obj = addvancedOptions.options.map((x: any) => {
                if (x.inputValue) {
                    return { key: x.key, inputValue: x.inputValue };
                }
            });

            obj.map((object: any) => {
                if (object) {
                    if (object.key == 'unitId') {
                        AdvancedSearchQuerry.query_string.query.unitId = `${object.inputValue}`;
                    }
                    else if (object.key == 'userId') {
                        AdvancedSearchQuerry.query_string.query.userId = `${object.inputValue}`;
                    }
                    else if (object.key == 'hotlist') {
                        AdvancedSearchQuerry.query_string.query.hotlist = `${object.inputValue}`;
                    }
                    else if (object.key == 'state') {
                        AdvancedSearchQuerry.query_string.query.state = `${object.inputValue}`;
                    }
                }
            });
            if (dateTimeDropDown.displayText != "anytime") {
                if (addvancedOptions.dateTimeDropDown.startDate) {
                    AdvancedSearchQuerry.query_string.query.fromDate = `${moment(addvancedOptions.dateTimeDropDown.startDate).toISOString()}`;
                }
                if (addvancedOptions.dateTimeDropDown.endDate) {
                    AdvancedSearchQuerry.query_string.query.toDate = `${moment(addvancedOptions.dateTimeDropDown.endDate).toISOString()}`;
                }
            }
            fetchData(AdvancedSearchQuerry, SearchType.AdvanceSearch, '');
        }
    }, [addvancedOptions]);



    useEffect(() => {
        if (isEmptySearch && searchData.length === 0) {
            setAdvanceSearch(true)
            setShowShortCutSearch(true);
        }
        else if (searchData.length !== 0) {
            setShowShortCutSearch(false);
            setAdvanceSearch(false)
        }
        else {
            setSearchResult(false)
        }
    }, [isEmptySearch, searchData])
    useEffect(() => {
        if (responseForSearchName[0] != undefined) {
            if (props.isopen) {
                setPredictiveText(responseForSearchName[1].replaceAll('*', ''))
                setDateTimeDropDown(responseForSearchName[0])
            }
            else {
                setPredictiveText("")
                setDateTimeDropDown({
                    startDate: moment().startOf("day").subtract(10000, "days").set("second", 0).format(),
                    endDate: moment().endOf("day").set("second", 0).format(),
                    value: basicDateDefaultValue,
                    displayText: basicDateDefaultValue
                });
            }
            if (window.location.href.includes('Alpr/AlprAdvanceSearchResult')) {
                setQuerryString(responseForSearchName[1].replaceAll('*', ''))
            }
            else {
                setQuerryString('');
            }
        }
    }, [searchData])

    useEffect(() => {
        if (isEmptySearch && (responseForSearch.length === 0 || +responseForSearch === 404)) {
            setSearchResult(true)
            setErrorMessage({
                message: t("Data Not Found."),
                type: "info",
                alertType: "inline"
            })
        }
        else if (responseForSearch.length !== 0) {
            setSearchResult(false)
        }
        else {
            setSearchResult(false)
        }
        if (+responseForSearch === 500 || +responseForSearch === 400) {
            setSearchResult(true);
            setErrorMessage({
                message: "An Error occurred with your search, please try again. Contact your admin if issues persist.",
                type: "error",
                alertType: "inline"
            })
        }

    }, [responseForSearch])


    useEffect(() => {
        if (responseForSearch.length > 0) {
            const footer: any = document.querySelector(".footerDiv")
            setSearchData(responseForSearch);
            footer && (footer.style.bottom = "18px")
        }
        else {
            setSearchData([]);
            setSearchPanelModal("Alpr_panel_show Alpr_main_master_page_panel");
        }
    }, [responseForSearch]);

    const showSearchBar = () => {
        
        console.log(showAdvanceSearch)
        setSearchPanelModal("alpr_panel_show Alpr_panelDesign Alpr_panelDesignUi Alpr_panelDesignPopup")
        setSearchPanelIdentifer(true);
        setIsOverlay(true)
    }

    const closeSearchPanel = () => {
        
        console.log(showAdvanceSearch)
        setSearchPanelModal("Alpr_panel_hide")
        setSearchPanelIdentifer(false);
        setIsOverlay(false)
    }

    const onChangePredictiveSearch = (e: any) => {
        setQuerryString(e);
        let dateOptionType = dateOptionsTypes.basicoptions;
        setDateTime(dateTimeDropDown);
        setDateOptionType(dateOptionType);
    }
    const clearResponseForSearch=()=>
    {
        dispatch(ClearAdvanceSearchProperty())

    }
    const removeQueryStringObjectFromQuery = (queryToModify: any) => {
        let modifiedQuery = JSON.parse(JSON.stringify(queryToModify)); // Copy object without reference.
        let must = modifiedQuery.bool.must;
        must.splice(0, 1);
        modifiedQuery.bool.must = must;
        const lockQuery = GenerateLockFilterQuery(decoded);
        modifiedQuery.bool.filter = lockQuery;
        return modifiedQuery;
    }
    const fetchData = (querry: any, searchValue: any, searchValueType: any) => {
        setIsEmptySearch(true);
        setSearchResult(false)
        dispatch(getAlprSearchInfoAsync({ QUERRY: (querry || QUERRY), searchType: searchValue }));
        dispatch(getNumberPlateSearchNameAsync({ QUERRY: QUERRY, dateTime: dateTimeDropDown, searchType: { searchValue, searchValueType } }));


        if (searchValue === SearchType.SimpleSearch || searchValue === SearchType.ShortcutSearch) {
            setShowShortCutSearch(false);
            setAdvanceSearch(false);
        }
        if (!props.isopen) {
            history.push(urlList.filter((item: any) => item.name === urlNames.AlprAdvanceSearchResult)[0].url);
            dispatch(enterPathActionCreator({ val: t('Search_Results') }));
        }
    }
    const NormalSearch = () => {
        setDateTime(dateTimeDropDown);
        if (dateTimeDropDown.value !== 'anytime') {
            if (dateTimeDropDown.startDate) {
                QUERRY.query_string.query.fromDate = `${moment(dateTimeDropDown.startDate).toISOString()}`;
            }
            if (dateTimeDropDown.endDate) {
                QUERRY.query_string.query.toDate = `${moment(dateTimeDropDown.endDate).toISOString()}`;
            }
        }
        if (querryString.length === 0) {
            const modifiedQuery = removeQueryStringObjectFromQuery(QUERRY);
            fetchData(modifiedQuery, SearchType.SimpleSearch, '');
        } else {
            fetchData(QUERRY, SearchType.SimpleSearch, '');
        }

        setAdvanceSearch(false);
        setShowAdvance(false);
    }
    const Search = () => {
        clearResponseForSearch()
        setSearchResultText({ type: "Search Term:", name: querryString })
        if (querryString && querryString.length > 0 && querryString.includes("#")) {
            if (querryString.startsWith("#")) {
                setSearchData([]);
            }
        } else {
            NormalSearch();
        }
        closeSearchPanel();
    }
    const showAdvanceSearchBox = () => {
        setShowAdvance(!showAdvance)
        // titleSearchBox.current.style.borderBottom = "1px solid #dedede"
        setTimeout(() => {
            const advanceSearchBox: any = document.querySelector("#Alpr_advanceSearchBox")
            advanceSearchBox.scrollTop = 170;
            advanceSearchBox.scrollIntoView({ behavior: 'smooth', block: 'start' });

        }, 500)

    }

    const getAllOptions = (e: any) => {
        setAddvancedOptions(e);
        setDateTimeDropDown({
            startDate: e.dateTimeDropDown.startDate,
            endDate: e.dateTimeDropDown.endDate,
            value: e.dateTimeDropDown.value,
            displayText: e.dateTimeDropDown.displayText
        });
        setDateTime({
            startDate: e.dateTimeDropDown.startDate,
            endDate: e.dateTimeDropDown.endDate,
            value: e.dateTimeDropDown.value,
            displayText: e.dateTimeDropDown.displayText
        })
    }

    const searchButton =
        <IconButton
            aria-controls="viewControle"
            className="viewControleButton"
            aria-haspopup="true"
            onClick={showSearchBar}
            disableRipple={true}
        >
            <CRXTooltip iconName="fa-solid fa-file-magnifying-glass" className='crxTooltipFilter' placement={"top"} arrow={false} title={"Search Number Plate"}></CRXTooltip>
        </IconButton>

    return (
        <div>
            <div className='Alpr_advanceSearchChildren'>
                <div className='Alpr_AdvanceSearchComponents' style={{ paddingTop: showShortCutSearch == false ? "49px" : "124px" }}>
                    {isOverLay == true ? <div className='search-modal-overlay'></div> : ""}
                    <div ref={searchBar} className={`Alpr_lister_search_panel ${searchPanelModal}`}>
                        {
                            showShortCutSearch == false ?
                                <div className='Alpr_modal-title_cs'>
                                    <div className='Alpr_advanceSearch_title_div'>{t('Search_Number_Plate')}
                                        <div className='hr-line' ref={titleSearchBox}></div>
                                    </div>
                                    <div className='Alpr_Advance_close-icon-modal'>
                                        <button className='Alpr_AdvanceSearch_closeButton-modal' onClick={() => closeSearchPanel()}>
                                            <i className='icon icon-cross2'></i>
                                        </button>
                                    </div>
                                </div>
                                : ""}
                        <div className={`Alpr_AdvanceSearch_scrollMainPage ${fieldsNumberClass}`} ref={adSearchBar}>
                            <div className={`Alpr_predictiveSearch_wraper`}>
                                <div className={`Alpr_predictiveSearch ${searchData.length > 0 ? "Alpr_CRXPredictiveDisable" : ""}`} >
                                    <CRXRows container spacing={0}>
                                        <CRXColumn item xs={6} className='topColumn'>
                                            <label className='searchLabel'>{t("Search_Number_Plate")}</label>
                                            <AlprPredictiveSearchBox
                                                onSet={(e) => onChangePredictiveSearch(e)}
                                                value={predictiveText}
                                                decoded={decoded}
                                                onKeyUp={(event: any) => {
                                                    if (event.keyCode == 13)
                                                        Search()
                                                }}
                                            />
                                        </CRXColumn>
                                        <CRXColumn item xs={6}>
                                            <label className='dateTimeLabel'>{t("Date_and_Time")}</label>
                                            <DateTimeComponent
                                                showCompact={compactDateRange.showCompact}
                                                minDate={compactDateRange.minDate}
                                                maxDate={compactDateRange.maxDate}
                                                dateTimeDetail={dateTimeDropDown}
                                                getDateTimeDropDown={(datetime: DateTimeObject) => setDateTimeDropDown(datetime)}
                                                dateOptionType={dateOptionType}
                                            />
                                        </CRXColumn>
                                    </CRXRows>
                                </div>
                                <div className='Alpr_preSearcBtnContent'>
                                    <CRXButton
                                        className='Alpr_PreSearchButton'
                                        onClick={() => Search()}
                                        color='primary'
                                        variant='contained'
                                        disabled={isSearchBtnDisable}
                                    >
                                        {t("Search")}
                                    </CRXButton>
                                </div>
                            </div>
                            <div className='Alpr_advanceSearchContet'>
                                <CRXButton
                                    onClick={() => showAdvanceSearchBox()}
                                    className={`Alpr_PreSearchButton ${PreSearchButtonClass}`}
                                >
                                    <i className={'fas fa-sort-down ' + iconRotate}></i> {t("Advanced")}&nbsp;
                                    {t("Search")}
                                </CRXButton>
                                {showAdvance && (
                                    <AdvanceOption
                                    clearResponseForSearch={clearResponseForSearch}
                                        searchPanelIdentifer={searchPanelIdentifer}
                                        getOptions={(e) => getAllOptions(e)}
                                        hideOptions={() => setShowAdvance(false)}
                                        dateOptionType={dateOptionType}
                                        dateTimeDetail={dateTimeDropDown}
                                        closeSearchPanel={() => closeSearchPanel()}
                                        className="animate animate__slideInUp"
                                        setAdvanceSearchText={setAdvanceSearchText}
                                        setFieldsNumber={setFieldsNumber}

                                    />
                                )}
                            </div>
                        </div>

                    </div>
                    {searchResult &&
                        <CRXAlert
                            className="Alpr_Alert_Msg"
                            message={errorMessage.message}
                            type={errorMessage.type}
                            alertType={errorMessage.alertType}
                            open={searchResult}
                            setShowSucess={() => null}
                        />
                    }

                </div>
            </div>
            {
                    (searchData && searchData.length > 0) &&
                    (
                        <div >
                            <AdvanceSearchLister
                                rowsData={searchData}
                                dateOptionType={dateOptionType === dateOptionsTypes.approachingDeletion ? "" : dateOptionType}
                                dateTimeDetail={dateTime}
                                // showDateCompact={showAssetDateCompact}
                                showAdvanceSearch={showAdvanceSearch}
                                showSearchPanel={searchButton}
                                searchResultText={searchResultText}
                                advanceSearchText={advanceSearchText}
                            />
                        </div>
                    )}
        </div>
    )
}

export default AlprAdvanceSearch;

