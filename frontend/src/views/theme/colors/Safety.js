import React from 'react'
import Training from './Training'
import './Safety.css'
// import DatePeacker from './DatePeacker'


const Safety = () => {
  return (
    <div className='section'>
     <div className="section1">
      <div className="section3">
      <h3>Date:</h3>
      <input type="date" className='input1' />
      </div>
      <div className="section3">
      <h3>Reference Number:</h3>
      <input type="text" className='input1' />
      </div>
      <div className="section3">
      <h3>Training Type:</h3>
      <label for="training1">
            <input class="input1" type="radio" id="training1" name="trainingType" value="Tool box Training" />
            Tool box Training
        </label>
        <label for="training2">
            <input class="input1" type="radio" id="training2" name="trainingType" value="Job & Safety" />
            Job & Safety
        </label>
        <label for="training3">
            <input class="input1" type="radio" id="training3" name="trainingType" value="Behavioral" />
            Behavioral
        </label>
        <label for="training3">
            <input class="input1" type="radio" id="training3" name="trainingType" value="Others" />
            Others
        </label>
      </div>
      <h3>Trainer:</h3>
     <Training />
     <h3>Employee:</h3>
     <Training />

     {/* <DatePeacker/> */}
    </div> 
    </div>
  )
}

export default Safety
