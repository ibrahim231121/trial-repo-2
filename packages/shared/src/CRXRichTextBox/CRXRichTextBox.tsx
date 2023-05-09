import React, { useRef, useEffect, useState, useImperativeHandle, ForwardRefRenderFunction, forwardRef } from "react";
import { CompositeDecorator, Editor, EditorState, convertToRaw, convertFromRaw, ContentState } from "draft-js";
import { Popover, makeStyles } from '@material-ui/core';
import './CRXRichTextBox.scss';

type CRXRichTextBoxPropsType = {
    value: string,
    disabled?: boolean,
    onChange: (value: any) => void
  }
  
const CRXRichTextBox: ForwardRefRenderFunction<any, CRXRichTextBoxPropsType> = (props, ref) => {

    const compositeDecorator = new CompositeDecorator([
        {
            strategy: (contentBlock, callback, contentState) => hashtagStrategy(contentState, contentBlock, callback),
            component: hashtagHTML,
            props: { context: [{assetID: 1, evidenceGroupId: 1, description: "Asset 1", thumbnail: "abc", orderIdStr: "1" }], onChange: props.onChange }
        }
    ]);

    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty(compositeDecorator));
    const editorElementRef = useRef(null);

    useEffect(() => {
        if(props.value != null && props.value.length > 0) {
            const exitingContentState = editorState.getCurrentContent();
            const parsedValue = tryParseValue(props.value);
            const newContentState = parsedValue === false ? ContentState.createFromText('') : convertFromRaw(parsedValue);
            if(newContentState.getPlainText('\u0001') != exitingContentState.getPlainText('\u0001')) {
                const stateFromParent = EditorState.createWithContent(newContentState, compositeDecorator);
                if(stateFromParent != editorState) {
                    setEditorState(stateFromParent);
                }
            }
        }
    }, [props.value])

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
        if(currentContentState !== newContentState) {
            setEditorState(newEditorState);
        }
        if(typeof props.onChange === "function") {
            props.onChange(newContentState);
        }
    }

    const getContentAsPlainText = (delimiter?: any) => {
        let plainText = "";
        let contentState = editorState.getCurrentContent();
        if (contentState.hasText())
            plainText = contentState.getPlainText(delimiter ? delimiter : null);
        return plainText;
    }

    const getContentAsRaw = () => {
        return convertToRaw(editorState.getCurrentContent());
    }

    return (
        <Editor ref={editorElementRef} editorState={editorState} onChange={(e: EditorState) => onContentChange(e)} readOnly={props.disabled === true} />
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

function hashtagStrategy(contentState: any, contentBlock: any, callback: any) {
    console.log(contentState);
    findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

const hashtagHTML = (props: any) => {
    let decoratedText = props.decoratedText;
    let arr = decoratedText.split('#');

    let ui = <span>{props.children}</span>
    if (arr.length > 1) {
        let orderId = arr[1];
        let taggedAsset = props.context.find((e: any) => e.orderIdStr == orderId);
        if (taggedAsset != null) {
            ui = <HashValue propsChildren={props.children} taggedAsset={taggedAsset} />
            assetRefrenceIds.push(orderId);
            props.onChange("Tagged asset matched strategy: " + assetRefrenceIds);
        }
    }
    return ui;
};

type HashValuePopoverPropsType = {
    taggedAsset: any,
    anchorEl: any,
    onClose: (e: React.MouseEvent) => void
}

const HashValuePopover: React.FC<HashValuePopoverPropsType> = ({ taggedAsset, anchorEl, onClose }) => {
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

    return (
    <Popover
            id="mouse-over-popover"
            ref={paperRef}
            open={true}
            anchorEl={anchorEl}
            onClose={onClose}
            classes={{
                ...classesPopover
            }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            
            transformOrigin={{
                vertical: "bottom",
                horizontal: 'center',
            }}
            className="crxRichTextBox-taggedAssetPopover"
        >
        <div className="crxRichTextBox-taggedAssetPopover-container">
            <div className="taggedAssetPopover-container-thumbnail">
                <img src={url} onError={onErrorMediaImage} />
            </div>
            <div className="taggedAssetPopover-container-detail">
                <a href="#">{taggedAsset.assetID}</a>
                <p>{taggedAsset.description}</p>
            </div>
        </div>
    </Popover>
    )
}

type HashValuePropsType = {
propsChildren: any,
taggedAsset: any
}

const HashValue: React.FC<HashValuePropsType> = ({ propsChildren, taggedAsset }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const targetContainerRef = useRef(null);

    const onClick = (e: any) => {
        e.preventDefault();
        let url = "/Media/Detail?id=" + taggedAsset.assetID + 
                "&EvidenceGroupId=" + taggedAsset.evidenceGroupId;
        window.open(url);
    }

    const popoverHandleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setAnchorEl(targetContainerRef.current);
        }, 100);
    }

    const popoverHandleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setAnchorEl(null);
        }, 100);
    }

    return (<span className="hash-value">
        <a  ref={targetContainerRef} style={{'color':'#006aae','textDecoration':'none', 'padding' : '15px 0px', 'cursor' : 'pointer'}}
                onMouseOver={(e: React.MouseEvent) => popoverHandleClick(e)}
                onMouseLeave={(e: React.MouseEvent) => popoverHandleClose(e)}
                onClick={(e: any) => onClick(e)}>
            <span>{propsChildren}</span>
        </a>
        {  Boolean(anchorEl) === true ? <HashValuePopover taggedAsset={taggedAsset}
                anchorEl={targetContainerRef.current} onClose={(e: React.MouseEvent) => popoverHandleClose(e)} />
            : null
        }
    </span>)
}

export default forwardRef(CRXRichTextBox);
