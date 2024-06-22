import React, {useState, useEffect, useRef} from 'react';
import Button from 'react-bootstrap/Button';
import {FaMinus} from "react-icons/fa";
import {FaPlus} from "react-icons/fa";
import './App.css';
import { Dimmer, Loader, Select, Card, GridColumn } from 'semantic-ui-react';


var paused = false;
var countdowndate = new Date(new Date().getTime()+36000000).getTime();
var dis = 0;
var diff = 0;

function App() {
  const[timerHours, setTimerHours] = useState('00');
  const[timerMinutes, setTimerMinutes] = useState('00');
  const[timerSeconds, setTimerSeconds] = useState('00');
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [priceDataBefore, setPriceDataBefore] = useState(null);
  const [p, setP] = useState(false);
  const [updated, setUpdated] = useState(false);

  var updatedE = 0;
  var updatedU = 0;
  var updatedG = 0;
  
  let interval = useRef();
  let interval1 = useRef();

function inch(){
  diff = diff + (1*60*60*1000);
  setTimerHours(Math.floor((((timerSeconds*1000) + (timerMinutes*60*1000) + (timerHours*60*60*1000) + (new Date().getTime()) + diff - new Date().getTime()) % (1000*60*60*24)) / (1000*60*60) ));
  diff = 0;
}
function dech(){
  diff = diff - (1*60*60*1000);
  setTimerHours(Math.floor((((timerSeconds*1000) + (timerMinutes*60*1000) + (timerHours*60*60*1000) + (new Date().getTime()) + diff - new Date().getTime()) % (1000*60*60*24)) / (1000*60*60) ));
  diff = 0;
}
function incm(){
  diff = diff + (1*60*1000);
  setTimerMinutes(Math.floor((((timerSeconds*1000) + (timerMinutes*60*1000) + (timerHours*60*60*1000) + (new Date().getTime()) + diff - new Date().getTime()) % (1000*60*60))/(1000*60) ));
  diff = 0;
}
function decm(){
  diff = diff - (1*60*1000);
  setTimerMinutes(Math.floor((((timerSeconds*1000) + (timerMinutes*60*1000) + (timerHours*60*60*1000) + (new Date().getTime()) + diff - new Date().getTime()) % (1000*60*60))/(1000*60) ));
  diff = 0;
}
function incs(){
  diff = diff + (1*1000);
  setTimerSeconds(Math.floor((((timerSeconds*1000) + (timerMinutes*60*1000) + (timerHours*60*60*1000) + (new Date().getTime()) + diff - new Date().getTime()) % (1000*60))/(1000) ));
  diff = 0;
}
function decs(){
  diff = diff - (1*1000);
  setTimerSeconds(Math.floor((((timerSeconds*1000) + (timerMinutes*60*1000) + (timerHours*60*60*1000) + (new Date().getTime()) + diff - new Date().getTime()) % (1000*60))/(1000) ));
  diff = 0;
}
  
function pause(){
  setP(true);
  paused = true;
 
}

function contin(){
  countdowndate = (timerSeconds*1000) + (timerMinutes*60*1000) + (timerHours*60*60*1000) + (new Date().getTime()) + diff; 
  setInterval(count,1000);
  paused = false;
  setP(false);
  diff = 0;

}

function res(){
  setTimerSeconds("00");
  setTimerMinutes("00");
  setTimerHours("00");
}
 
function count(){
  const now = new Date().getTime();
  const distance =  countdowndate - now ;
  const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((distance % (1000*60*60))/(1000*60));
  const seconds = Math.floor((distance % (1000*60))/(1000));

  dis = distance;

  if(distance<0 || paused ){
    clearInterval(interval.current);
  }else{
    setTimerHours(hours);
    setTimerMinutes(minutes);
    setTimerSeconds(seconds);   
  }
}



   



  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      const data = await res.json();

      if((updatedU == data.bpi["USD"].rate)&&(updatedE == data.bpi["EUR"].rate)&&(updatedG == data.bpi["GBP"].rate)){
        setUpdated(true);

      }else{

        setPriceData(data.bpi);
        updatedU = data.bpi["USD"].rate;
        updatedE = data.bpi["EUR"].rate;
        updatedG = data.bpi["GBP"].rate;
        setPriceDataBefore(data.bpi);
        setLoading(false);
        setUpdated(false);
      
      }

      
    }
    interval1 = setInterval(()=>{
      fetchData();
    },1000);
    
    interval = setInterval(count,1000);
  }, []);
 
  

  return (
    <div className="App">
      <div className='nav' style={{ padding : 15, backgroundColor: 'dimgray	'}}>
        Bitcoin Dashboard
      </div>
      <section className="timer-container">
        <section className="timer">
          <div>
            <section>
  <p>{timerHours}</p>
            <p><small>Hours</small></p>
            {p ? (<><FaPlus onClick={inch}></FaPlus>
            <FaMinus onClick={dech}></FaMinus></>) : (<></>)
            }
            
            </section>
            <span>:</span>
            <section>
  <p>{timerMinutes}</p>
            <p><small>Minutes</small></p>
            {p ? (<><FaPlus onClick={incm}></FaPlus>
            <FaMinus onClick={decm}></FaMinus></>) : (<></>)
            }
            </section>
            <span>:</span>
            <section>
  <p>{timerSeconds}</p>
            <p><small>Seconds</small></p>
            {p ? (<><FaPlus onClick={incs}></FaPlus>
            <FaMinus onClick={decs}></FaMinus></>) : (<></>)
            }
            </section>
            <Button onClick={pause} variant="primary">Pause</Button>
            <Button onClick={contin}variant="primary">Continue</Button>
            {p ? (<><Button onClick={res} variant="primary">Reset</Button></>) : (<></>)
            }
          </div>
          
        </section>
      </section>
      {
        loading ? (
          <div>
            <Dimmer active inverted>
              <Loader>Loading</Loader>
            </Dimmer>  
          </div>
        ) : (
          <>
            <div className="price-container" style={{
              backgroundColor: "lightgray",
              display: 'flex',
              justifyContent : 'space-around',
              alignItem: 'center',
              
            }}>
            <div className="price" style={{
              display: 'inline-table',
              justifyContent : 'space-around',
            }}>
              <div style={{
                float:"left",
                padding:"3em" 
            }}>
              {updated ? (<><Card >
                <Card.Content>
                  <Card.Header>{"USD"} Currency</Card.Header>
                  <Card.Description>
                    {priceData["USD"].rate}
                  </Card.Description>
                </Card.Content>
              </Card></>) : (<><Card style={{backgroundColor: 'salmon'}}>
                <Card.Content>
                  <Card.Header>{"USD"} Currency</Card.Header>
                  <Card.Description>
                    {priceData["USD"].rate}
                  </Card.Description>
                </Card.Content>
              </Card></>)
            }
              </div>
              <div style={{
                float:"left",
                padding:"3em", 
            }}>
              {updated ? (<><Card >
                <Card.Content >
                  <Card.Header>{"GBP"} Currency</Card.Header>
                  <Card.Description >
                    {priceData["GBP"].rate}
                  </Card.Description>
                </Card.Content>
              </Card></>) : (<><Card  style={{backgroundColor: 'salmon'}}>
                <Card.Content >
                  <Card.Header>{"GBP"} Currency</Card.Header>
                  <Card.Description >
                    {priceData["GBP"].rate}
                  </Card.Description>
                </Card.Content>
              </Card></>)
            }
              </div>
              <div style={{
                float:"left",
                padding:"3em" 
            }}>
              {updated ? (<><Card >
                <Card.Content>
                  <Card.Header>{"EUR"} Currency</Card.Header>
                  <Card.Description>
                    {priceData["EUR"].rate}
                  </Card.Description>
                </Card.Content>
              </Card></>) : (<><Card style={{backgroundColor: 'salmon'}}>
                <Card.Content>
                  <Card.Header>{"EUR"} Currency</Card.Header>
                  <Card.Description>
                    {priceData["EUR"].rate}
                  </Card.Description>
                </Card.Content>
              </Card></>)
            }
              </div>
            </div>

            </div>
          </>
        )
      } 
    </div>
  );
}

export default App;
