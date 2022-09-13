import moment from "moment";

const basicDateDefaultValue ="last 30 days";
const approachingDateDefaultValue = "tomorrow"

const dateOptionsTypes ={
  basicoptions : "basicoptions",
  approachingDeletion : "approachingDeletion"
}


var dateOptions = {

   "basicoptions":[ 
        { 
          value: "today", 
          displayText: "today",  
          startDate : function(){ return moment().startOf("day").set("second", 0).format() }, 
          endDate : function(){ return   moment().endOf("day").set("second", 0).format() } 
        },
        { 
          value: "yesterday", 
          displayText: "yesterday" ,
          startDate : function(){ return moment().startOf("day").subtract(1, "days").set("second", 0).format() }, 
          endDate : function(){ return   moment().endOf("day").subtract(1, "days").set("second", 0).format() } 
          
        },
        {
          value: "last 7 days",
          displayText: "last 7 days" ,
          startDate : function(){ return moment().startOf("day").subtract(6, "days").set("second", 0).format() }, 
          endDate : function(){ return   moment().endOf("day").set("second", 0).format()} 
        },     
        { 
          value: "last 30 days", 
          displayText: "last 30 days" ,
          startDate : function(){ return moment().startOf("day").subtract(29, "days").set("second", 0).format() }, 
          endDate : function(){ return   moment().endOf("day").set("second", 0).format() } 
        },
        { 
          value: "current calendar month", 
          displayText: "current calendar month" ,
          startDate : function(){ return moment().startOf("month").set("second", 0).format() }, 
          endDate : function(){ return  moment().endOf("month").set("second", 0).format()}  
        },
        { 
          value: "last calendar month", 
          displayText: "last calendar month" ,
          startDate : function(){ return moment().subtract(1, "months").startOf("month").set("second", 0).format() }, 
          endDate : function(){ return   moment().subtract(1, "months").endOf("month").set("second", 0).format() } 
        },
        { 
          value: "custom", 
          displayText: "custom range" , 
          startDate :function(){ return  moment().set("second", 0).format()} , 
          endDate :  function(){ return  moment().set("second", 0).format()} 
        },
    ],
    "approachingDeletion":[
  
      { 
        value: "tomorrow", 
        displayText: "tomorrow", 
        current:  moment() , 
        startDate : function(){ return moment().startOf("day").add(1, "days").set("second",0).format() }, 
        endDate : function(){ return   moment().endOf("day").add(1, "days").set("second",0).format() }
      },
      { 
        value: "next 7 days", 
        displayText: " next 7 day" ,
        current:  moment() , 
        startDate : function(){ return moment().startOf("day").add(1, "days").set("second", 0).format()  }, 
        endDate : function(){ return moment().endOf("day").add(7, "days").set("second",0).format()  } 
        
      },
      {
        value: "next 30 days",
        displayText: "next 30 days",
        current:  moment() , 
        startDate : function(){ return moment().startOf("day").add(1,"days").set("second", 0).format()  }, 
        endDate : function(){ return moment().endOf("day").add(30, "days").set("second",0).format()   } 
      }
    ]
}

const MAX_REQUEST_SIZE_FOR = {
  CATEGORY : 1000,
  STATION: 100
}

export {
  dateOptions,
  basicDateDefaultValue,
  approachingDateDefaultValue,
  dateOptionsTypes,
  MAX_REQUEST_SIZE_FOR
}


// const basicDateOptions = [
  
//     { 
//       value: "today", 
//       displayText: "today",  
//       startDate : function(){ return moment().startOf("day").set("second", 0).format() }, 
//       endDate : function(){ return   moment().endOf("day").set("second", 0).format() } 
//     },
//     { 
//       value: "yesterday", 
//       displayText: " yesterday" ,
//       startDate : function(){ return moment().startOf("day").subtract(1, "days").set("second", 0).format() }, 
//       endDate : function(){ return   moment().endOf("day").subtract(1, "days").set("second", 0).format() } 
      
//     },
//     {
//       value: "last 7 days",
//       displayText: "last 7 days" ,
//       startDate : function(){ return moment().startOf("day").subtract(6, "days").set("second", 0).format() }, 
//       endDate : function(){ return   moment().endOf("day").set("second", 0).format()} 
//     },     
//     { 
//       value: "last 30 days", 
//       displayText: "last 30 days" ,
//       startDate : function(){ return moment().startOf("day").subtract(29, "days").set("second", 0).format() }, 
//       endDate : function(){ return   moment().endOf("day").set("second", 0).format() } 
//     },
//     { 
//       value: "current calendar month", 
//       displayText: "current calendar month" ,
//       startDate : function(){ return moment().startOf("month").set("second", 0).format() }, 
//       endDate : function(){ return  moment().endOf("month").set("second", 0).format()}  
//     },
//     { 
//       value: "last calendar month", 
//       displayText: "last calendar month" ,
//       startDate : function(){ return moment().subtract(1, "months").startOf("month").set("second", 0).format() }, 
//       endDate : function(){ return   moment().subtract(1, "months").endOf("month").set("second", 0).format() } 
//     },
//     { 
//       value: "custom", 
//       displayText: "custom range" , 
//       startDate :function(){ return  moment().set("second", 0).format()} , 
//       endDate :  function(){ return  moment().set("second", 0).format()} 
//     },
// ];

// const approachingDeletionDateOptions = [
  
//   { 
//     value: "tomorrow", 
//     displayText: "tomorrow", 
//     current:  moment() , 
//     startDate : function(){ return moment().startOf("day").add(1, "days").set("second",0).format() }, 
//     endDate : function(){ return   moment().endOf("day").add(1, "days").set("second",0).format() }
//   },
//   { 
//     value: "next 7 days", 
//     displayText: " next 7 day" ,
//     current:  moment() , 
//     startDate : function(){ return moment().startOf("day").add(1, "days").set("second", 0).format()  }, 
//     endDate : function(){ return moment().endOf("day").add(7, "days").set("second",0).format()  } 
    
//   },
//   {
//     value: "next 30 days",
//     displayText: "next 30 days",
//     current:  moment() , 
//     startDate : function(){ return moment().startOf("day").add(1,"days").set("second", 0).format()  }, 
//     endDate : function(){ return moment().endOf("day").add(30, "days").set("second",0).format()   } 
//   }
// ];

