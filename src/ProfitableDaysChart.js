import React, { useState, useEffect } from 'react';
import './App.css';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Brush, Legend, ResponsiveContainer} from 'recharts';
import axios from 'axios';

export default function ProfitableDaysChart(){
    const [data, setData] = useState([]);
    const [formattedData, setformattedData] = useState([]);
    let staticData = [];

    useEffect(() => {
        axios.get('https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&allData=true&api_key=c76391cf666cfdd3dfdb8e3e1dcd057c7efb42524f94d5fb1f6e86895c1ddd7f')
        .then(response => {
            setData(response.data.Data.Data);

            for(let i = 0; i < response.data.Data.Data.length; i++){
                let a = new Date(response.data.Data.Data[i].time * 1000);
                let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                let year = a.getFullYear();
                let month = months[a.getMonth()];
                let date = a.getDate();
                let time = date + ' ' + month + ' ' + year + ' ';

                staticData.push({
                    Price: response.data.Data.Data[i].close,
                    Loss_Price: 0,
                    time: time,
                    isProfit: null
                })
            }
            for(let i = 0; i <= staticData.length - 1; i++){
                const currentPrice = staticData[staticData.length - 1].Price;
                //Profit Day
                if(staticData[i].Price <= currentPrice){
                    staticData[i].isProfit = true;
                }
                //Loss Day
                else{
                    console.log(staticData[i].isProfit)
                    staticData[i].Loss_Price = staticData[i].Price;
                    staticData[i].Price = 0;
                    staticData[i].isProfit = false;
                }
            }
            setformattedData(staticData);

        })

        
    }
    ,[]);

    function CustomTooltip({active, payload, label}){
        if(active){
            // console.log(payload);
            if(payload[0].value === 0){
                return (
                <div className="custom-tooltip-profit">
                <p>BTC/USD Price {` : ${payload[1].value}`} $</p>
                <p>Date {` : ${payload[1].payload.time}`} </p>
                </div>
                );
            }
            else if(payload[1].value === 0){
                return (
                    <div className="custom-tooltip-loss">
                    <p>BTC/USD Price {` : ${payload[0].value}`} $</p>
                    <p>Date{` : ${payload[0].payload.time}`} </p>
                    </div>
                    );
            }
        }
        return null;
    };

    const CustomLegend = function CustomLegend(props){

        const totalDays = formattedData.length;

        let lossDays = 0;
        let profitDays = 0;
        let percentProfitDays = 0;

        for(let i = 0; i <= formattedData.length - 1; i++){
            if(formattedData[i].isProfit){
                profitDays++;
            }
            else if(!formattedData[i].isProfit){
                lossDays++;
            }
        }

        percentProfitDays = (profitDays / totalDays) * 100;



        return(
            <div className="legend">
                <p>Profitable: <div className="green-box"></div></p>
                <p>Non-Profitable: <div className="red-box"></div></p>
                <p>Total of Days: {`${totalDays}`}</p>
                <p>Total of Profit Days: {`${profitDays}`}</p>
                <p>Total of Loss Days: {`${lossDays}`}</p>
                <p>% of Profitable Days: {`${percentProfitDays.toFixed(2)} %`}</p>
            </div>
        );
    };
    

    return (
        // <ResponsiveContainer width={1200} height="80%">
        <AreaChart width={1200} height={800} data={formattedData} margin={{top: 50, right: 20, bottom: 5, left: 20}} className="chart">
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3"/>
            <XAxis dataKey="time" name="time"/>
            <YAxis label={{ value: 'BTC/USD Price', position: 'left', angle: -90}}/>
            <Tooltip content={CustomTooltip}/>
            <Legend content={<CustomLegend/>} className="legend-container"/>
            <Area type="step" dataKey={"Loss_Price"} stroke="#DD0C05" fill="#DD0C05"/>
            <Area type="step" dataKey="Price" stroke="#29AB87" fill="#0FDD05"/>
            <Brush width={1000} dataKey="time"/>
        </AreaChart>
        // </ResponsiveContainer>
    );
}