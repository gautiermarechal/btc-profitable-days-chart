import React, { useState, useEffect } from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Brush} from 'recharts';
import axios from 'axios';

export default function ProfitableDaysChart(){
    const [data, setData] = useState([]);
    const [formattedData, setformattedData] = useState([]);
    const staticData = [];

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
                let hour = a.getHours();
                let min = a.getMinutes();
                let sec = a.getSeconds();
                let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + '0:' + sec + "0" ;

                staticData.push({
                    Price: response.data.Data.Data[i].close,
                    time: time
                })
            }
            setformattedData(staticData);

        })
    }
    ,[]);

    const getProfitableDays = () => {
        if(formattedData.length === 0){
            return;
        }
        else{
        const currentPrice = formattedData[formattedData.length - 1].Price;
        for(let i = 0; i < formattedData.length - 1; i++){
            console.log("Hello 123");
            if(formattedData[i].Price < currentPrice){
                console.log("Hello" + formattedData.length);
                return 1;
            }
            else{
                console.log("Hello 0");
                return 0;
            }
        }
        }
    }

    const profitableDays = getProfitableDays();

    return (
        <AreaChart width={1200} height={600} data={formattedData} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
            <defs>
                
                    {formattedData.map((props) => (
                        <linearGradient id="profitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={profitableDays} stopColor="green" stopOpacity={1}></stop>
                        <stop offset={profitableDays} stopColor="red" stopOpacity={1}></stop>
                        </linearGradient>
                    ))}
                
            </defs>
            <Area type="monotone" dataKey="Price" stroke="#29AB87" fill="url(#profitColor)"/>
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3"/>
            <XAxis dataKey="time" name="time" label="Time"/>
            <YAxis label="BTC/USD Price"/>
            <Tooltip/>
            <Brush/>
        </AreaChart>
    );
}