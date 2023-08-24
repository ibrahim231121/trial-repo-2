import React, { FC, useState, useEffect, useRef, ForwardRefRenderFunction, useImperativeHandle, forwardRef } from "react";
import {
    CRXMultiSelectBoxLight,
    CRXButton,
    TextField,
    CRXHeading,
    CRXRadio,
  } from "@cb/shared";
import { AutoCompleteOptionType, CASE_ACTION_MENU_PARENT_COMPONENT, CASE_ASSET_TYPE, CASE_AUDIT_TYPE, CASE_TIMELINE_TYPE, TCaseAsset, TCaseNote, TCaseTimeline } from "../CaseTypes";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { CasesAgent, FileAgent } from "../../../utils/Api/ApiAgent";
import moment from "moment";
import CasesActionMenu from "../CasesLister/CasesActionMenu";
import "./CaseTimeline.scss";
import { Link, useHistory } from "react-router-dom";
import { urlList, urlNames } from "../../../utils/urlList";
import { getAssetSearchInfoAsync } from "../../../Redux/AssetSearchReducer";
import { SearchType } from "../../Assets/utils/constants";
import { SearchModel } from "../../../utils/Api/models/SearchModel";
import { RootState } from "../../../Redux/rootReducer";
import { resetRelatedAsset } from "../../../Redux/FilteredRelatedAssetsReducer";
import { convertDateTimeToLocalInString, getFormattedDateTime } from "../utils/globalFunctions";
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import { FILE_SERVICE_URL_V2 } from "../../../utils/Api/url";

type CaseTimeLinePropType = {
    caseId: number,
    isViewOnly: boolean,
    timeline: TCaseTimeline[],
    showToastMsg: (obj: any) => void,
    updateCaseTimelineData: (data: any) => void
}

const filterAutocompleteOptions = [
    {id: 0, label: 'All Entries'},
    {id: 1, label: 'Evidence'},
    {id: 4, label: 'Notes'},
    {id: 3, label: 'Sharing'},
    {id: 6, label: 'Status Update'},
];

const CaseTimeLine : ForwardRefRenderFunction<any, CaseTimeLinePropType> = (props, ref) => {

    const [timelineData, setTimelineData] = useState<TCaseTimeline[]>([]);
    const [filteredTimelineData, setFilteredTimelineData] = useState<TCaseTimeline[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [searchBy, setSearchBy] = useState<AutoCompleteOptionType>(filterAutocompleteOptions[0]);
    const [highlightsData, setHighlightsData] = useState<TCaseTimeline[]>([]);
    const [sortBy, setSortBy] = useState<string>("2");

    const assetFetchedFromSearch: SearchModel.Evidence[] = useSelector((state: RootState) => state.assetSearchReducer.assetSearchInfo);
    const tenantSettingsKeyValues: any = useSelector((state: RootState) => state.tenantSettingsReducer.keyValues);
  
    const { t } = useTranslation<string>();
  
    const dispatch = useDispatch();
    const history = useHistory();
  
    const isFirstRenderRef = useRef<boolean>(true);
    const timelineDataRef = useRef<TCaseTimeline[]>([]);
    const highlightsDataRef = useRef<TCaseTimeline[]>([]);
    const assetDataForAssetDetailRef = useRef<{assetName: string, assetId: number} | null>(null);
    const sortByRadioOptionsRef = useRef([
      {
        value: "1", label: `${t("OLD")}`, Comp: () => { }
      },
      {
        value: "2", label: `${t("NEW")}`, Comp: () => { }
      }
    ])

    useImperativeHandle(ref, () => ({
      highlightAssetByReference
    }));
  
    useEffect(() => {
      if(Array.isArray(props.timeline)) {
        setTimelineData(props.timeline);
        getHighlightData(props.timeline);
      }
    }, [props.timeline]);
  
    useEffect(() => {
      timelineDataRef.current = timelineData.map(item => ({...item}));
      filterTimelineData();
    }, [searchText, searchBy, timelineData])
  
    useEffect(() => {
      if(!isFirstRenderRef.current) {
        sortTimelineData(filteredTimelineData);
      }
    }, [sortBy])
  
    useEffect(() => {
      highlightsDataRef.current = highlightsData.map(item => ({...item}));
    }, [highlightsData])

    useEffect(() => {
      if(!isFirstRenderRef.current) {
        if(Array.isArray(assetFetchedFromSearch) && assetFetchedFromSearch.length > 0 && assetDataForAssetDetailRef.current != null){
          const fetchedAsset = assetFetchedFromSearch[0];
          if(assetDataForAssetDetailRef.current.assetId === fetchedAsset.masterAsset.assetId) {
            history.push({
              pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
              state: {
                evidenceId: fetchedAsset.id,
                assetId: assetDataForAssetDetailRef.current.assetId,
                assetName: assetDataForAssetDetailRef.current.assetName,
                evidenceSearchObject: fetchedAsset
              }
            });
          }
        }
      }
    }, [assetFetchedFromSearch]);
  
    useEffect(() => {
      isFirstRenderRef.current = false;
    }, [])
  
    const getCaseTimeline = () => {
      dispatch(setLoaderValue({isLoading: true}));
      CasesAgent.getCaseTimeline(props.caseId)
      .then((res:any) => {
        dispatch(setLoaderValue({isLoading: false}));
        if(Array.isArray(res)) {
          setTimelineData(res);
          getHighlightData(res);
          props.updateCaseTimelineData(res);
        }
      })
      .catch((ex:any) => {
        dispatch(setLoaderValue({isLoading: false}));
      })
    }
  
    const saveCaseNote = (caseNoteData: TCaseNote, item: TCaseTimeline, isHighlightedItem?: boolean) => {
      dispatch(setLoaderValue({isLoading: true}));
      CasesAgent.addCaseNote(`Case/${props.caseId}/CaseNote`, caseNoteData)
      .then((res:any) => {
        dispatch(setLoaderValue({isLoading: false}));
        if(res != null && typeof props.showToastMsg === "function") {
          getCaseTimeline();
          props.showToastMsg({ message: t("You_have_added_the_note_successfully"), variant: "success" })
          onCancelNoteButtonClick(item, Boolean(isHighlightedItem));
        }
      })
      .catch((ex:any) => {
        dispatch(setLoaderValue({isLoading: false}));
        props.showToastMsg({ message: ex.response.data.toString(), variant: "error" });
      });
    }
  
    const updateCaseNote = (caseNoteData: TCaseNote, item: TCaseTimeline, isHighlightedItem?: boolean) => {
      dispatch(setLoaderValue({isLoading: true}));
      CasesAgent.updateCaseNote(`Case/${props.caseId}/CaseNote/${item.recId}`, caseNoteData)
      .then((res:any) => {
        dispatch(setLoaderValue({isLoading: false}));
        if(res != null && typeof props.showToastMsg === "function") {
          getCaseTimeline();
          props.showToastMsg({ message: t("You_have_update_the_note_successfully"), variant: "success" })
          onCancelNoteButtonClick(item, Boolean(isHighlightedItem));
        }
      })
      .catch((ex:any) => {
        dispatch(setLoaderValue({isLoading: false}));
        props.showToastMsg({ message: ex.response.data.toString(), variant: "error" });
      });
    }
  
    const updateCaseHighlights = (url: string) => {
      dispatch(setLoaderValue({isLoading: true}));
      CasesAgent.updateCaseHighlight(url)
      .then(() => {
        props.showToastMsg({ message: t("You_have_added_item_to_highlight_successfully"), variant: "success" })
        dispatch(setLoaderValue({isLoading: false}));
        getCaseTimeline();
      })
      .catch((ex:any) => {
        dispatch(setLoaderValue({isLoading: false}));
        props.showToastMsg({ message: ex.response.data.toString(), variant: "error" });
      });
    }

    const getAssetFromSearch = (assetName: string, obj: TCaseTimeline) => {
      const QUERY: any = {
        bool: {
          must: [
            {
              multi_match: {
                query: `${assetName}*`,
                fields: [
                  'asset.assetName',
                  'masterAsset.assetName',
                  'categories',
                  'cADId',
                  'asset.unit',
                  'asset.owners',
                  'formData.key',
                  'formData.value'
                ],
                operator : 'and'
              },
            },
          ],
          filter: []
        },
      };
      assetDataForAssetDetailRef.current = {
        assetName: assetName,
        assetId: obj.detailId,
      }
      dispatch(getAssetSearchInfoAsync({ QUERRY: QUERY, searchType: SearchType.SimpleSearch }));
    }

    const onUntagAssetFromCase = (item: TCaseTimeline) => {
      const caseAssets: TCaseAsset[] = [{
          id: item.recId.toString(),
          caseId: props.caseId,
          assetId: item.detailId,
          assetName: item.assetName ?? "",
          assetType: item.assetType,
          evidenceId: item.evidenceId ?? 0,
          notes: "",
          sequenceNumber: item.sequenceNumber ?? "1",
          fileId: item.fileId,
          fileName: item.fileName,
          fileType: item.fileType,
        }];
      dispatch(setLoaderValue({isLoading: true}));
      CasesAgent.untagAssetsToCase(caseAssets)
        .then(() => {
          dispatch(setLoaderValue({isLoading: false}));
          getCaseTimeline();
          dispatch(resetRelatedAsset()) 
        })
        .catch(ex => {
          dispatch(setLoaderValue({isLoading: false}));
          props.showToastMsg({ message: ex.response.data.toString(), variant: "error" });
        });
    }
  
    const getHighlightData = (data: TCaseTimeline[]) => {
      const timelineDataCopy = data.map(item => ({...item}));
      const highlightedData = timelineDataCopy.filter(item => {
        if(item.isHighlight === true)
          return true;
        return false;
      });
      if(highlightedData != null) {
        setHighlightsData(highlightedData);
      }
    }
  
    const filterTimelineData = () => {
      const data = timelineData.map(item => ({...item}));
      const filteredRecords = data.filter(item => {
        if(((searchBy.id == 0 ? true : searchBy.id === item.type) && item.text.toLowerCase().includes(searchText.toLowerCase())) || (item.recId === -1 && item.type === CASE_AUDIT_TYPE.Notes))
          return item;
        return false;
      });
      sortTimelineData(filteredRecords);
    }
  
    const sortTimelineData = (records: TCaseTimeline[]) => {
      try {
        const dataToSort = records.map(item => ({...item}));
        dataToSort.sort((item1, item2) => {
          if(sortBy === "1")
            return moment(item1.timeStamp).valueOf() - moment(item2.timeStamp).valueOf()
  
          return moment(item2.timeStamp).valueOf() - moment(item1.timeStamp).valueOf()
        })
        if(Array.isArray(dataToSort) && records.length === dataToSort.length) {
          setFilteredTimelineData(dataToSort);
        }
        else {
          setFilteredTimelineData(records);
        }
      }
      catch {
        setFilteredTimelineData(records);
      }
    }
  
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const value = e.target.value;
      setSearchText(typeof (value) === "string" ? value : "");
    }
  
    const onSearchByChange = (e: any, value: any) => {
      e.preventDefault();
      if(value != null)
        setSearchBy(value);
      else
        setSearchBy(filterAutocompleteOptions[0]);
    }
  
    const onAddNoteClick = () => {
      if(timelineData.find(x => x.recId === -1 && x.type === CASE_AUDIT_TYPE.Notes) == null) {
        const timelineRecordsCopy = timelineData.map(item => ({...item}));
        timelineRecordsCopy.unshift({
          recId: -1,
          text: "",
          type: CASE_AUDIT_TYPE.Notes,
          timeStamp: "Now",
          thumbnail: "",
          assetType: 0,
          detailId: 0,
          sequenceNumber: null,
          isEdit: true,
          isHighlight: false,
          fileId: 0,
          fileName: "",
          fileType: "",
          accessCode: ""
        })
        setTimelineData(timelineRecordsCopy);
      }
    }
  
    const onSaveNoteButtonClick = (value: string, item: TCaseTimeline, isHighlightedItem?: boolean) => {
      if(value != null && value.trim() != "" && props.isViewOnly == false) {
        const caseNoteData: TCaseNote = {
          id: "0",
          caseId: props.caseId,
          text: value,
          isHighlight: item.isHighlight
        }
        if(item.recId > -1) {
          caseNoteData.id = item.recId.toString();
          updateCaseNote(caseNoteData, item, isHighlightedItem);
        }
        else if(item.recId === -1) {
          saveCaseNote(caseNoteData, item, isHighlightedItem);
        }
      }
    }
  
    const onCancelNoteButtonClick = (caseTimeline: TCaseTimeline, isHighlightedItem: boolean) => {
      if(caseTimeline != null) {
        if(isHighlightedItem === true) {
          let recordIndex = -1;
          const highlightsCopy = highlightsData.map((item, idx: number) => {
            if(item.recId === caseTimeline.recId && item.type === CASE_AUDIT_TYPE.Notes) {
              recordIndex = idx;
            }
            return {...item}
          });
          if(recordIndex > -1) {
            highlightsCopy[recordIndex].isEdit = false;
            setHighlightsData(highlightsCopy);
          }
        }
        else {
          let recordIndex = timelineData.findIndex(x => x.recId === caseTimeline.recId && x.type === CASE_AUDIT_TYPE.Notes);
          const timelineRecordsCopy = timelineData.map((item, idx: number) => {
            if(item.recId === caseTimeline.recId && item.type === CASE_AUDIT_TYPE.Notes) {
              recordIndex = idx;
            }
            return {...item}
          });
          if(recordIndex > -1) {
            if(caseTimeline.recId === -1) {
              timelineRecordsCopy.splice(recordIndex, 1);
              setTimelineData(timelineRecordsCopy);
            }
            else {
              timelineRecordsCopy[recordIndex].isEdit = false;
              setTimelineData(timelineRecordsCopy);
            }
          }
        }
      }
  
    }
  
    const onEditNoteClick = (item: TCaseTimeline, isHighlightedItem: boolean) => {
      if(item && item.recId > 0) {
        if(isHighlightedItem === true) {
          const highlightsCopy = highlightsDataRef.current.map(item => ({...item}));
          const idx = highlightsCopy.findIndex(a => a.recId === item.recId && a.type === CASE_AUDIT_TYPE.Notes);
          if(idx > -1) {
            highlightsCopy[idx].isEdit = true;
            setHighlightsData(highlightsCopy);
          }
        }
        else {
          const timelineCopy = timelineDataRef.current.map(item => ({...item}));
          const idx = timelineCopy.findIndex(a => a.recId === item.recId && a.type === CASE_AUDIT_TYPE.Notes);
          if(idx > -1) {
            timelineCopy[idx].isEdit = true;
            setTimelineData(timelineCopy);
          }
        }
      }
    }
  
    const onUpdateHighlightClick = (item: TCaseTimeline, isHighlight: boolean) => {
      if(item && item.recId > 0 ) {
        let url = '';
        switch(item.type) {
          case CASE_AUDIT_TYPE.Asset:
            url = `Case/${props.caseId}/CaseAsset/UpdateCaseAssetOnHighlight/${item.recId}/${Boolean(isHighlight)}`;
            break;
          case CASE_AUDIT_TYPE.Share:
            url = `Case/${props.caseId}/CaseSharing/UpdateCaseSharingOnHighlight/${item.recId}/${Boolean(isHighlight)}`;
            break;
          case CASE_AUDIT_TYPE.Notes:
            url = `Case/${props.caseId}/CaseNote/UpdateCaseNoteOnHighlight/${item.recId}/${Boolean(isHighlight)}`;
            break;
          default:
            break;
        }
        if(url.trim().length != 0 && props.isViewOnly == false) {
          updateCaseHighlights(url);
        }
      }
    }

    const highlightAssetByReference = (sequenceNumber: string) => {
      if(highlightsData.find(x => x.sequenceNumber === sequenceNumber && x.type === CASE_AUDIT_TYPE.Asset) == undefined) {
        const data = timelineData.find(x => x.sequenceNumber === sequenceNumber && x.type === CASE_AUDIT_TYPE.Asset);
        if(data != null) {
          onUpdateHighlightClick(data, true);
        } 
      }
    }
  
    const assetTypeActionMenuItems = [
      // {
      //   label: t('View'),
      //   icon: null,
      //   onClickHandler: () => {},
      // },
      {
        label: t('Remove_From_Case'),
        icon: null,
        onClickHandler: (row: TCaseTimeline) => onUntagAssetFromCase(row),
      },
      // {
      //   label: t('Download'),
      //   icon: null,
      //   onClickHandler: () => {},
      // }
    ]
  
    const sharingTypeActionMenuItems = [
      {
        label: t('Update_Share_Options'),
        icon: null,
        onClickHandler: () => {},
      },
      {
        label: t('Revoke_Access'),
        icon: null,
        onClickHandler: () => {},
      }
    ]
  
    const getNoteActionMenuItems = (isHighlightedItem: boolean) => {
      return [
        {
          label: t('Edit'),
          icon: null,
          onClickHandler: (row: TCaseTimeline) => onEditNoteClick(row, isHighlightedItem),
        },
      ]
    }
  
    const getActionMenuItem = (type: number, isHighlightedItem?: boolean) => {
      let menuItems: any[] = [];
      switch(type) {
        case CASE_AUDIT_TYPE.Asset:
          menuItems = [...assetTypeActionMenuItems];
          break;
        case CASE_AUDIT_TYPE.Notes:
          menuItems = getNoteActionMenuItems(Boolean(isHighlightedItem));
          break;
        case CASE_AUDIT_TYPE.Share:
          menuItems = [];
          break;
        default:
          break;
      }
      // For Customer Pilot -- Case Lister View: Hide Inactive Actions Items --- afterwards the "type" clause will be removed.
      if(menuItems.length > 0 || type === CASE_AUDIT_TYPE.Share) {
        if(isHighlightedItem === true) {
          menuItems.unshift({
            label: t('UnHighlight'),
            icon: null,
            onClickHandler: (row: TCaseTimeline) => onUpdateHighlightClick(row, false),
          })
        }
        else {
          menuItems.unshift({
            label: t('Highlight'),
            icon: null,
            onClickHandler: (row: TCaseTimeline) => onUpdateHighlightClick(row, true),
          })
        }
      }
      return menuItems;
    }

    const getTimelineThumbnailContent = (type: number) => {
      let content = null;
      switch(type) {
        case CASE_AUDIT_TYPE.Notes:
          content = <i className="icon icon-notebook" />
          break;
        case CASE_AUDIT_TYPE.Share:
          content = <i className="icon icon-user3" />
          break;
        case CASE_AUDIT_TYPE.StatusUpdate:
          content = <i className="icon icon-flag3" />
          break;
        default:
          content = <i className="icon icon-flag3" />
          break;
      }
      return content;
    }

    const getTimelineFormattedAssetText = (item: TCaseTimeline) => {
      if(item) {
        const value = item.text;
        const idx = value.indexOf('ID');
        if(idx > -1) {
          const assetName = value.substring(idx + 3);
          const textValue = value.substring(0, idx + 2);
          return <>
              <label className="caseTimeline-assetText">{ t(textValue) }</label>
              <Link
                className="linkColor caseTimeline-assetName"
                onClick={() => getAssetFromSearch(assetName, item)}
                to="#"
              >
                {assetName}
              </Link>
            </> 
        }
      }
    }

    const getTimelineFormattedNoteText = (item: TCaseTimeline) => {
      if(item) {
        if(item.updatedOn != null)
          return `${item.userName} updated note on ${getFormattedDateTime(item.updatedOn, tenantSettingsKeyValues ?? null)} : ${item.text}`
        return `${item.userName} Note: ${item.text}`
      }
    }
    
    return (
      <div className="caseTimeline-main">
        <div className="caseTimeline-content">
          <div className="caseTimeline-searchArea">
            <TextField
              value={searchText}
              type="text"
              label={t('Search')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e)}
            />
            <div className="caseDetailFilterAutocompleteContainer">
              <CRXMultiSelectBoxLight
                id="searchBy"
                className="caseDetailFilterAutocomplete"
                label= "Search By"
                multiple={false}
                value={ searchBy }
                options={filterAutocompleteOptions}
                onChange={(e: any, value: AutoCompleteOptionType) => onSearchByChange(e, value)}
                onOpen={(e: any) => {
                  e.preventDefault();
                }}
                CheckBox={false}
                checkSign={false}
                required={false}
              />
            </div>
          </div>
          <div className="caseTimeline-sectionSeparator">
            <i className='far fa-ellipsis-h'></i>
          </div>
          <div className="caseTimeline-highlightsArea">
            <CRXHeading className="highlightsArea-subHeading" variant="subtitle1" >{t('HIGHLIGHTS')} </CRXHeading>
            {
              highlightsData.map((item, idx: number) => {
                return (
                  <div className='caseTimeline-item'
                    key={`caseHighlight-item-${idx}`}>
                    <div className="caseTimeline-item-timestamp">
                      { getFormattedDateTime(item.timeStamp, tenantSettingsKeyValues ?? null) }
                      </div>
                      {
                      item.type === CASE_AUDIT_TYPE.Asset ?
                        <div className="case-Timeline-item-sequenceNumber-container">
                          <span>#{item.sequenceNumber}</span>
                        </div>
                      : null
                      }
                    <div className="caseTimeline-item-detailContainer">
                      <div className="caseTimeline-item-thumbnail">
                        { item.type === CASE_TIMELINE_TYPE.Asset ?
                            <AssetThumbnailIcon assetName={ String(item.assetName)} assetType={item.assetType} fileType={item.fileType} accessCode={item.accessCode}/>//("", item.assetType, item.assetType, item.fileType, item.accessCode)
                          : getTimelineThumbnailContent(item.type) }
                      </div>
                      <div className="caseTimeline-item-detail">
                        {item.isEdit === true ?
                        (
                          <EditableCaseNote key={`caseHighlight-item-editableNote-${item.recId}-${idx}`} text={item.text}
                            onSave={(value: string) => onSaveNoteButtonClick(value, item)} onCancel={() => onCancelNoteButtonClick(item, true)} />
                        )
                        : <>
                            { item.type === CASE_AUDIT_TYPE.Asset ?
                                getTimelineFormattedAssetText(item)
                              : item.type === CASE_AUDIT_TYPE.Notes ?
                                getTimelineFormattedNoteText(item)
                              : item.type === CASE_AUDIT_TYPE.StatusUpdate ?
                                convertDateTimeToLocalInString(item.text, tenantSettingsKeyValues ?? null)
                              : item.text }
                          </>
                        }
                      </div>
                      {
                        item.type !== CASE_AUDIT_TYPE.StatusUpdate && props.isViewOnly !== true ?
                        <CasesActionMenu
                          row={item}
                          menuItems={getActionMenuItem(item.type, true)}
                          offsetX={5}
                          offsetY={-24}
                          className=''
                          hasEditMenu={false}
                          showToastMsg={(obj: any) => {}}//showToastMsg(obj)}
                          parentComponent={CASE_ACTION_MENU_PARENT_COMPONENT.CaseTimeline}
                        />
                        : null
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="caseTimeline-sectionSeparator">
            <i className='far fa-ellipsis-h'></i>
          </div>
          <div className="caseTimelineButtonContainer">
            <CRXButton
                className="caseTimelineAddNoteButton secondary"
                color="secondary"
                variant="outlined"
                onClick={() => onAddNoteClick()}
                disabled={props.isViewOnly === true}
              >
                {t("Add Note")}
            </CRXButton>
            <div className="caseTimelineSortbyContainer">
              <CRXHeading variant="subtitle1" className="label">
                {t("Sort_By")}
              </CRXHeading>
              <CRXRadio
                className='caseTimelineSortByRadioBtn'
                disableRipple={true}
                content={sortByRadioOptionsRef.current}
                value={sortBy}
                setValue={(value: string) => { value === "2" ? setSortBy(value) : setSortBy("1") }}
              />
            </div>
          </div>
          <div className="caseTimeline-detail">
            {
              filteredTimelineData.map((item, idx: number) => {
                return (
                  <div className={`caseTimeline-item ${item.recId === -1 && item.type === CASE_AUDIT_TYPE.Notes ? '--temporaryHeight' : ''}`}
                    key={`caseTimeline-item-${idx}`}>
                    <div className="caseTimeline-item-timestamp">
                      { item.recId === -1 && item.type === CASE_AUDIT_TYPE.Notes ? item.timeStamp :
                          getFormattedDateTime(item.timeStamp, tenantSettingsKeyValues ?? null)
                      }
                      </div>
                    {
                      item.type === CASE_AUDIT_TYPE.Asset ?
                        <div className="case-Timeline-item-sequenceNumber-container">
                          <span>#{item.sequenceNumber}</span>
                        </div>
                      : null
                    }
                    <div className="caseTimeline-item-detailContainer">
                      <div className="caseTimeline-item-thumbnail">
                        { item.type === CASE_TIMELINE_TYPE.Asset ?
                            <AssetThumbnailIcon assetName={String(item.assetName)} assetType={item.assetType} fileType={item.fileType} accessCode={item.accessCode}/>//("", item.assetType, item.assetType, item.fileType, item.accessCode)
                          : getTimelineThumbnailContent(item.type) }
                      </div>
                      <div className="caseTimeline-item-detail">
                        {item.isEdit === true ?
                        (
                          <EditableCaseNote key={`caseTimeline-item-editableNote-${item.recId}-${idx}`} text={item.text}
                            onSave={(value: string) => onSaveNoteButtonClick(value, item)} onCancel={() => onCancelNoteButtonClick(item, false)} />
                        )
                        : <>
                            { item.type === CASE_AUDIT_TYPE.Asset ?
                                getTimelineFormattedAssetText(item)
                              : item.type === CASE_AUDIT_TYPE.Notes ?
                                getTimelineFormattedNoteText(item)
                              : item.type === CASE_AUDIT_TYPE.StatusUpdate ?
                                convertDateTimeToLocalInString(item.text, tenantSettingsKeyValues ?? null)
                              : item.text }
                          </>
                        }
                      </div>
                      {
                        item.type !== CASE_AUDIT_TYPE.StatusUpdate && !(item.recId === -1 && item.type === CASE_AUDIT_TYPE.Notes)
                          && props.isViewOnly !== true ?
                        <CasesActionMenu
                          row={item}
                          menuItems={getActionMenuItem(item.type)}
                          offsetX={5}
                          offsetY={-24}
                          className=''
                          hasEditMenu={false}
                          showToastMsg={(obj: any) => {}}//showToastMsg(obj)}
                          parentComponent={CASE_ACTION_MENU_PARENT_COMPONENT.CaseTimeline}
                        />
                        : null
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
}

type EditableCaseNoteType = {
    text: string;
    onSave: (value: string) => void;
    onCancel: () => void;
}

const EditableCaseNote: FC<EditableCaseNoteType> = (props) => {
    const [value, setValue] = useState<string>(props.text);
  
    const { t } = useTranslation<string>();
  
    const onValueChange = (e: any) => {
      if(e != null && e.target && typeof(e.target.value) === "string") {
        e.preventDefault();
        setValue(e.target.value);
      }
    }
  
    return (
      <>
        <TextField
          id="addNote"
          key="addNote"
          label={t('Note')}
          required={false}
          value={ value }// ? temporaryNoteValue : item.text}
          onChange={(e: any) => onValueChange(e)}
          disabled = {false}
          type="text"
          multiline
          variant="outlined"
          rows={1}
        />
        <div className="caseTimeline-item-noteButtonContainer">
          <CRXButton
            className="caseDetailButton secondary"
            color="secondary"
            variant="outlined"
            onClick={() => props.onSave(value)}
          >
            {t("Save")}
          </CRXButton>
          <CRXButton
            className="caseDetailButton secondary"
            color="secondary"
            variant="outlined"
            onClick={() => props.onCancel()}
          >
            {t("Cancel")}
          </CRXButton>
        </div>
      </>
    )
}

const videoIcon = <i className="fas fa-solid fa-file-video"/>;

type AssetThumbnailPropTypes = {
  assetName: string,
  assetType: number,
  fileType: string,
  accessCode: string,
}

const AssetThumbnailIcon : FC<AssetThumbnailPropTypes> = ({assetName, assetType, fileType, accessCode}) => {
  const { tenantId } = React.useContext(ApplicationPermissionContext);
  const [videoElement, setVideoElement] = useState<JSX.Element>(videoIcon);
  useEffect(() => {
    if (fileType === 'Video' || fileType === 'Image') {
      const url = `${FILE_SERVICE_URL_V2}/Files/FetchThumbnail/${assetName}/${accessCode}/${tenantId}/${fileType === 'Video'}`;
      const imageTag = <img src={url} alt="Alt Text" />;
      setVideoElement(imageTag);
    }
  }, []);

  const getContent = () => {
    let content = <div className="Unspecified-file-type"><i className="fas fa-solid fa-file"></i></div>;
    switch (assetType) {
      case CASE_ASSET_TYPE.Audio:
      case CASE_ASSET_TYPE.AudioOnly:
        content = <div className="caseTimeline-assetThumbnail"><i className="fa-regular fa-waveform-lines"></i></div>;
        break;
      case CASE_ASSET_TYPE.Video:
        content = <div className="caseTimeline-assetThumbnail">
            <div className="_video_play_icon">
              <span className="icon icon-play4"></span>
            </div>
            {videoElement}
          </div>;
        break;
      case CASE_ASSET_TYPE.Image:
        content = <div className="caseTimeline-assetThumbnail">{videoElement}</div>;
        break;
        case CASE_ASSET_TYPE.Doc:
          switch (fileType) {
            case "PDFDoc":
              content = <i className="fas fa-file-pdf tumbFontIcon"></i>;
              break;
            case "ExcelDoc":
              content = <i className="fas fa-file-excel tumbFontIcon"></i>;
              break;
            case "CSVDoc":
              content = <i className="fas fa-file-csv tumbFontIcon"></i>;
              break;
            case "WordDoc":
              content = <i className="fas fa-file-word tumbFontIcon"></i>;
              break;
            default:
              break;
          }
        break;
      default:
        break;
    }
    return content;
  }

  return(
    <>
      {getContent()}
    </>
  )
};

export default forwardRef(CaseTimeLine);
