const textDisplayStatus = (text:string ,classes: string | undefined) => {
    return(
      <div className="textDisplayStatus">
          <div className={"dataTableEllipsesText " + classes}>{text}</div>
             <div className={`statusDot ${text} `}></div>
      </div>
    
    ) 
  }

  export default textDisplayStatus;