const multitextDisplayAssigned = (text: any, classes: string | undefined) => {
    return (
        <div className={"dataTableSimpleText " + classes}>
            {text.map((item: any) => item).join(", ")}
            <p>lorem.user1 (U), lorm (U), lorem.user.n (U), lorem.group (G)</p>
        </div>
    )
  };
  
  export default multitextDisplayAssigned;
  