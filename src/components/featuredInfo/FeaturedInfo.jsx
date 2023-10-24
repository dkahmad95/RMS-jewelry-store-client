import "./featuredinfo.css";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getOverall, updateOverall } from "../../redux/apiCalls";

export default function FeaturedInfo() {
  const [goldPrice, setGoldPrice] = useState(null);
  const dispatch = useDispatch();
  const overall = useSelector((state) => state.overall.overall[0]);
  const overallId = overall?._id;

  const onClick = () => {
    axios
      .get(
        `https://api.metalpriceapi.com/v1/latest?api_key=adf23c593e89e6fdc08377d6e7cc4932&base=xau&currencies=USD`
      )
      .then((response) => {
        if (response.data.rates && response.data.rates.USD) {
          const goldPriceValue = response.data.rates.USD;
          const twoDecimalDigits = parseFloat(goldPriceValue).toFixed(2);
          setGoldPrice(twoDecimalDigits);
          console.log(twoDecimalDigits);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching gold price:", error);
      });
  };

  const w18KtoRamli = useMemo(() => {
    return ((overall?.overall18K * 750) / 995).toFixed(2);
  }, [overall?.overall18K]);

  const w21KtoRamli = useMemo(() => {
    return ((overall?.overall21K * 875) / 995).toFixed(2);
  }, [overall?.overall21K]);

  const avgOjur18K = parseFloat(
    (parseFloat(overall?.overallPrice18K) / parseFloat(overall?.overall18K)).toFixed(2)
  );

  const avgOjur21K =  parseFloat(
    (parseFloat(overall?.overallPrice21K) / parseFloat(overall?.overall21K)).toFixed(2)
  );

  const overallRamli = useMemo(() => {
    return parseFloat(
      (
        parseFloat(w18KtoRamli) +
        parseFloat(w21KtoRamli) +
        parseFloat(overall?.overall24K)
      ).toFixed(2)
    );
  }, [w18KtoRamli, w21KtoRamli, overall?.overall24K]);

  const overallSales = useMemo(() => {
    return parseFloat((
      parseFloat(overall?.overallCash) - parseFloat(overall?.overallExpenses)).toFixed(2)
    );
  }, [overall?.overallCash, overall?.overallExpenses]);
  const newOverallRamli = useMemo(() => {
    // eslint-disable-next-line
    return {overallRamli, overallSales, avgOjur18K, avgOjur21K}
  }, [overallRamli, overallSales, avgOjur18K, avgOjur21K]);
  console.log("newOverallRamli",newOverallRamli)
  console.log("overall",overall)

  useEffect(() => {
    getOverall(dispatch);
    dispatch(updateOverall(newOverallRamli, overallId));
  }, [dispatch, overallId, newOverallRamli]);

  
  return (
    <div className="dashboard-container">
      <div className="totalSales">
        <div className="cardGoldPrice" onClick={onClick}>
          <h2>Gold Price</h2>
          <div className="metric">{goldPrice}</div>
        </div>
        <div className="card">
          <h2>Total Sales</h2>
          <div className="metric">${parseFloat(overallSales).toFixed(2)}</div>
        </div>
      </div>
      <div className="ojur">
        <div className="card">
          <h2>Total Price 18K</h2>
          <div className="metric">$ {parseFloat(overall?.overallPrice18K).toFixed(2)}</div>
        </div>
        <div className="card">
          <h2>Total Price 21K</h2>
          <div className="metric">$ {parseFloat(overall?.overallPrice21K).toFixed(2)}</div>
        </div>
        <div className="card">
          <h2>avg Ojur 18K</h2>
          <div className="metric">$ {parseFloat(overall?.avgOjur18K).toFixed(2)}</div>
        </div>
        <div className="card">
          <h2>avg Ojur 21K</h2>
          <div className="metric">$ {parseFloat(overall?.avgOjur21K).toFixed(2)}</div>
        </div>
      </div>
      <div className="weights">
        <div className="card">
          <h2>Total 18K</h2>
          <div className="metric">{parseFloat(overall?.overall18K).toFixed(2)} g</div>
        </div>
        <div className="card">
          <h2>Total 21K</h2>
          <div className="metric">{parseFloat(overall?.overall21K).toFixed(2)} g</div>
        </div>
        <div className="card">
          <h2>Total 24K</h2>
          <div className="metric">{parseFloat(overall?.overall24K).toFixed(2)} g</div>
        </div>
        <div className="card">
          <h2>Total Ramli</h2>
          <div className="metric">{overallRamli} g</div>
        </div>
      </div>
      <div className="silver">
        <div className="card">
          <h2>Total Silver</h2>
          <div className="metric">{parseFloat(overall?.overallSilver).toFixed(2)} g</div>
        </div>
      </div>
    </div>
  );
}
