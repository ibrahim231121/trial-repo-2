const textDisplayStatus = (text:string ,classes: string | undefined) => {
    return(
      <div className="textDisplayStatus">
          <div className={"dataTableSimpleText " + classes}>{text}</div>
             <p className={`statusDot ${text} `}></p>
      </div>
    
    ) 
  }

  export default textDisplayStatus;