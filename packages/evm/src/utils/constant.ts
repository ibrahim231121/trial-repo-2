import moment from "moment";

const basicDateOptions = [
  
    { 
      value: "today", 
      displayText: "today",  
      startDate : function(){ return moment().startOf("day").format() }, 
      endDate : function(){ return   moment().endOf("day").set("second", 0).format() } 
    },
    { 
      value: "yesterday", 
      displayText: " yesterday" ,
      startDate : function(){ return moment().startOf("day").subtract(1, "days").format() }, 
      endDate : function(){ return   moment().endOf("day").subtract(1, "days").format() } 
      
    },
    {
      value: "last 7 days",
      displayText: "last 7 days" ,
      startDate : function(){ return moment().startOf("day").subtract(7, "days").format() }, 
      endDate : function(){ return   moment().endOf("day").subtract(1, "days").set("second", 0).format()} 
    },     
    { 
      value: "last 30 days", 
      displayText: "last 30 days" ,
      startDate : function(){ return moment().startOf("day").subtract(30, "days").format() }, 
      endDate : function(){ return   moment().endOf("day").set("second", 0).format() } 
    },
    { 
      value: "current calendar month", 
      displayText: "current calendar month" ,
      startDate : function(){ return moment().startOf("month").format() }, 
      endDate : function(){ return  moment().format()}  
    },
    { 
      value: "last calendar month", 
      displayText: "last calendar month" ,
      startDate : function(){ return moment().subtract(1, "months").endOf("month").format() }, 
      endDate : function(){ return   moment().startOf("month").format() } 
    },
    { 
      value: "custom", 
      displayText: "custom range" , 
      startDate :function(){ return  moment().format()} , 
      endDate :  function(){ return  moment().format()} 
    },
];

const approachingDeletionDateOptions = [
  
  { 
    value: "tomorrow", 
    displayText: "tomorrow", 
    current:  moment() , 
    startDate : function(){ return moment().startOf("day").add(1, "days").format() }, 
    endDate : function(){ return   moment().endOf("day").add(1, "days").set("second",59).format() }
  },
  { 
    value: "next 7 days", 
    displayText: " next 7 day" ,
    current:  moment() , 
    startDate : function(){ return moment().startOf("day").add(1, "days").set("second", 0).format()  }, 
    endDate : function(){ return moment().endOf("day").add(7, "days").set("second",59).format()  } 
    
  },
  {
    value: "next 30 days",
    displayText: "next 30 days",
    current:  moment() , 
    startDate : function(){ return moment().startOf("day").add(1,"days").set("second", 0).format()  }, 
    endDate : function(){ return moment().endOf("day").add(30, "days").set("second",59).format()   } 
  }
];

export {
  basicDateOptions,
  approachingDeletionDateOptions
}