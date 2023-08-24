import React, { useRef, useEffect, useState, useImperativeHandle, ForwardRefRenderFunction, forwardRef, useMemo } from "react";
import { CompositeDecorator, Editor, EditorState, convertToRaw, convertFromRaw, ContentState, RichUtils } from "draft-js";
import { Popover, makeStyles } from '@material-ui/core';
import './CRXRichTextBox.scss';
import { Link } from "react-router-dom";
import CRXTruncation from "../controls/CRXTextPopover/CRXTruncation";

type CRXRichTextBoxPropsType = {
    value: string,
    disabled?: boolean,
    assets: any[],
    onChange: (value: string) => void,
    onHashLinkChange: (value: string[]) => void,
  }
  
const CRXRichTextBox: ForwardRefRenderFunction<any, CRXRichTextBoxPropsType> = (props, ref) => {

    const compositeDecorator = new CompositeDecorator([
        {
            strategy: (contentBlock, callback) => hashtagStrategy(contentBlock, callback),
            component: hashtagHTML,
            props: { context: props.assets ?? [], value: props.value, onChange: props.onHashLinkChange }
        }
    ]);

    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty(compositeDecorator));
    const editorElementRef = useRef<any>(null);

    const memoizedEditorValue = useMemo(() => {
        return props.value;
    }, [props.value]);

    useEffect(() => {
        if(memoizedEditorValue != null && memoizedEditorValue.length > 0) {
            const parsedValue = tryParseValue(memoizedEditorValue);
            const newContentState = parsedValue === false ? ContentState.createFromText('') : convertFromRaw(parsedValue);
            const compositeDecorator = new CompositeDecorator([
                {
                    strategy: (contentBlock, callback) => hashtagStrategy(contentBlock, callback),
                    component: hashtagHTML,
                    props: { context: props.assets ?? [], value: memoizedEditorValue, onChange: props.onHashLinkChange }
                }
            ]);
            const stateFromParent = EditorState.createWithContent(newContentState, compositeDecorator);
            let editorSelectionState = stateFromParent;
            if(newContentState.hasText()) {
                editorSelectionState = EditorState.moveSelectionToEnd(stateFromParent);
            }
            if(editorSelectionState != editorState) {
                setEditorState(editorSelectionState);
            }
        }
    }, [memoizedEditorValue]);

    useImperativeHandle(ref, () => ({
        getContentAsPlainText,
        getContentAsRaw
    }));

    const tryParseValue = (value: string) => {
        try {
            return JSON.parse(value);
        }
        catch(ex) {
            return false;
        }
    }

    const onContentChange = (newEditorState: EditorState) => {
        const currentContentState = convertToRaw(editorState.getCurrentContent());
        const newContentState = convertToRaw(newEditorState.getCurrentContent());
        setEditorState(newEditorState);
        if(typeof props.onChange === "function" && deepEqual(currentContentState, newContentState) === false) {
            props.onChange(getContentAsPlainText(newEditorState));
        }
    }

    const getContentAsPlainText = (newEditorState?: EditorState, delimiter?: any) => {
        let plainText = "";
        let contentState = newEditorState != null ? newEditorState.getCurrentContent() : editorState.getCurrentContent();
        if (contentState.hasText())
            plainText = contentState.getPlainText(delimiter ? delimiter : null);
        return plainText;
    }

    const getContentAsRaw = () => {
        return convertToRaw(editorState.getCurrentContent());
    }

    const handleKeyCommand = (command: any, editorState: any) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onContentChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    return (
        <Editor ref={editorElementRef} editorState={editorState} onChange={(e: EditorState) => onContentChange(e)} readOnly={props.disabled === true}
            handleKeyCommand={(command, editorState) => handleKeyCommand(command, editorState)}/>
    )
}

const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;
let assetRefrenceIds: number[] = [];

function findWithRegex(regex: any, contentBlock: any, callback: any) {      
    const text = contentBlock.getText();
    let matchArr, start;
    assetRefrenceIds = [];
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
}

function hashtagStrategy(contentBlock: any, callback: any) {
    findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

const hashtagHTML = (props: any) => {
    let decoratedText = props.decoratedText;
    let arr = decoratedText.split('#');

    let ui = <span>{props.children}</span>
    if (arr.length > 1) {
        let orderId = arr[1];
        let taggedAsset = props.context.find((e: any) => e.sequenceNumber == orderId);
        if (taggedAsset != null) {
            ui = <HashValue propsChildren={props.children} taggedAsset={taggedAsset} />
            assetRefrenceIds.push(orderId);
            props.onChange(orderId);
        }
    }
    return ui;
};

type HashValuePropsType = {
    propsChildren: any,
    taggedAsset: any
}
    
const HashValue: React.FC<HashValuePropsType> = ({ propsChildren, taggedAsset }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null);
    const targetContainerRef = useRef<HTMLAnchorElement>(null);

    const openPopoverTimeoutRef = useRef<number>(0);
    const closePopoverTimeoutRef = useRef<number>(0);

    const onClick = (e: any) => {
        e.preventDefault();
        let url = "/Media/Detail?id=" + taggedAsset.assetID + 
                "&EvidenceGroupId=" + taggedAsset.evidenceGroupId;
        window.open(url);
    }

    const popoverHandleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const {currentTarget} = e;
        e.preventDefault();
        clearTimeout(openPopoverTimeoutRef.current);
        openPopoverTimeoutRef.current = window.setTimeout(() => {
            setAnchorEl(currentTarget);
        }, 100);
    }

    const popoverHandleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log("On Mouse Leave fired")
        clearTimeout(closePopoverTimeoutRef.current);
        closePopoverTimeoutRef.current = window.setTimeout(() => {
            setAnchorEl(null);
        }, 100);
    }

    return (<span className="hash-value"> 
        <a  ref={targetContainerRef} style={{'color':'#006aae','textDecoration':'none', 'padding' : '15px 0px', 'cursor' : 'pointer'}}
                onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => popoverHandleClick(e)}
                onMouseLeave={(e: React.MouseEvent) => popoverHandleClose(e)}
                onClick={(e: any) => onClick(e)}>
            <span>{propsChildren}</span>
        </a>
        {   Boolean(anchorEl) === true ?
                <HashValuePopover taggedAsset={taggedAsset} anchorEl={anchorEl}/>
            : null
        }
    </span>)
}    

type HashValuePopoverPropsType = {
    taggedAsset: any,
    anchorEl: HTMLAnchorElement | null,
}

const HashValuePopover: React.FC<HashValuePopoverPropsType> = ({ taggedAsset, anchorEl }) => {
    const [url, setUrl] = useState<string>(taggedAsset?.thumbnail ?? "");

    const paperRef = useRef<HTMLInputElement>(null);

    const useGapStyles = makeStyles({
    paper: {
        marginBottom: "2rem",
        overflowY: "auto",
        position: "absolute",
        minHeight: "95px",
    }
    });

    const classesPopover = useGapStyles();

    const onErrorMediaImage = () => {
       setUrl("");
    }

    const assetNameTemplate = (assetName: string) => {
        // let assets = evidence.asset.filter(x => x.assetId != evidence.masterAsset.assetId);
        let dataLink =
          <>
            <Link
              className="linkColor"
              to={{
                // pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
                // state: {
                //   evidenceId: evidence.id,
                //   assetId: evidence.masterAsset.assetId,
                //   assetName: assetName,
                //   evidenceSearchObject: evidence
                // } as AssetDetailRouteStateType,
              }}
            >
              <div className="assetName">
    
                <CRXTruncation placement="top" content={assetName.length >
                  25
                  ? assetName.substring(0,
                    25
                  ) + "..."
                  : assetName} />
              </div>
            </Link>
            {/* <DetailedAssetPopup asset={assets} row={evidence} /> */}
          </>
        return dataLink;
    }

    return (
    <Popover
            id="mouse-over-popover"
            ref={paperRef}
            open={true}
            className="crxRichTextBox-taggedAssetPopover"
            anchorEl={anchorEl}
            anchorReference="anchorPosition"
            classes={classesPopover}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: 'center',
            }}
            disableRestoreFocus
            disableAutoFocus={true}
            disableEnforceFocus={true}
        >
        <div className="crxRichTextBox-taggedAssetPopover-container">
            <div className="taggedAssetPopover-container-thumbnail">
                <img src={url} onError={onErrorMediaImage} />
            </div>
            <div className="taggedAssetPopover-container-detail">
                {assetNameTemplate(taggedAsset.assetName)}
            </div>
        </div>
    </Popover>
    )
}

const deepEqual = (x: any, y: any) => {
    if (x === y) {
      return true;
    }
    else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
      if (Object.keys(x).length != Object.keys(y).length)
        return false;
  
      for (var prop in x) {
        if (y.hasOwnProperty(prop))
        {  
          if (! deepEqual(x[prop], y[prop]))
            return false;
        }
        else
          return false;
      }
      
      return true;
    }
    else 
      return false;
  }

export default forwardRef(CRXRichTextBox);
