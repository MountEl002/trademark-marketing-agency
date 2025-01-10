import React from "react";
import {
  PRICING_DATA,
  getAllTimeframes,
  getAllLevels,
} from "@/constants/writingPricing";

const WritingPricing = () => {
  const timeframes = getAllTimeframes();
  const levels = getAllLevels();

  return (
    <div className="prices-table">
      <table>
        <thead>
          <tr>
            <th>Price/page*</th>
            {timeframes.map((timeframe) => (
              <th key={timeframe}>{timeframe}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {levels.map((level) => (
            <tr key={level}>
              <td>{level}</td>
              {timeframes.map((timeframe) => (
                <td key={timeframe} className="individual-price">
                  ${PRICING_DATA[level][timeframe].toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WritingPricing;
