import React from "react";
import Upcoming30daystool from "../upcoming30daystool/Upcoming30daystool";
import Upcoming30daysppe from "../upcoming30daysppe/Upcoming30daysppe";

import Upcoming30daysmedical from "../upcoming30daysmedical/Upcoming30daysmedical";
import Upcoming30daysdress from "../upcoming30daysdress/Upcoming30daysdress";
export default function Upcoming30daysbody(){
    return(
        <>
        <Upcoming30daystool/>
        <Upcoming30daysppe/>
        <Upcoming30daysdress/>
        <Upcoming30daysmedical/>
        </>
    )
}