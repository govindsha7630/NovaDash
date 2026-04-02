import React, { useState, useEffect } from "react";

function Pricing() {
  const [opened, setOpened] = useState(false);
  const data = {
    head: "how to fix",
    description: "just learn ",
  };
  return (
    <div>
      <div className="w-8 font-bold bg-blue-500 rounded-3xl" onClick={()=>setOpened(!opened)}>{data.head}</div>
      <div
        className="w-8  bg-blue-300 rounded-3xl"
        style={{ display: opened? "block" :"hidden", 


         }}
      >
        {data.description}
      </div>
    </div>
  );
}

export default Pricing;
