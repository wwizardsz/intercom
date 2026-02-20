#!/usr/bin/env node

/**
 * Simple Crypto CLI
 * Fetches real-time crypto prices from CoinGecko API
 */

const https = require("https");

// ===== CONFIG =====
const portfolio = {
  bitcoin: 0.5,
  ethereum: 2,
  solana: 10,
};

const currency = "usd";

// ===== FETCH FUNCTION =====
function fetchPrices(coins, vsCurrency) {
  return new Promise((resolve, reject) => {
    const ids = coins.join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vsCurrency}`;

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            reject("Error parsing API response.");
          }
        });
      })
      .on("error", (err) => {
        reject("Error fetching data from API.");
      });
  });
}

// ===== MAIN =====
async function main() {
  const coins = Object.keys(portfolio);

  try {
    const prices = await fetchPrices(coins, currency);

    console.log("\n=== Crypto Portfolio ===\n");

    let total = 0;

    coins.forEach((coin) => {
      const amount = portfolio[coin];
      const price = prices[coin][currency];
      const value = amount * price;

      total += value;

      console.log(
        `${coin.toUpperCase()} | Amount: ${amount} | Price: $${price.toLocaleString()} | Value: $${value.toLocaleString()}`
      );
    });

    console.log("\n--------------------------");
    console.log(`Total Portfolio Value: $${total.toLocaleString()}`);
    console.log("--------------------------\n");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
