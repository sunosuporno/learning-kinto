const fs = require('fs');
const csv = require('csv-parse/sync');

// Read the CSV file
const input = fs.readFileSync('./script/data/weETH_final_distribution.csv', 'utf8');

// Parse the CSV data
const records = csv.parse(input, {
  columns: true,
  skip_empty_lines: true
});

// Create the output object
const output = {};
let totalTokens = 0n;

records.forEach(record => {
  console.log('record:', record)
  const wallet = record['Kinto Wallet'];
  console.log('wallet:', wallet)
  const amountStr = record['August 17'];
  // Remove the comma and convert to cents (multiply by 100)
  const valueInCents = BigInt(Math.round(parseFloat(amountStr .replace(",", "")) * 100));

  // Multiply by 10^16 to get to 1e18 (since we're already at 100 cents)
  const amount = valueInCents * BigInt(10**16);
  console.log('amount:', amount)

  totalTokens += amount;
  console.log('totalTokens:', totalTokens)

  if (wallet && amount && amount > 0) {
    output[wallet] = amount.toString();
  }
});

console.log('totalTokens:', totalTokens)

// Write the output to a JSON file
fs.writeFileSync('./script/data/weETH_final_distribution.json', JSON.stringify(output, null, 2));

console.log('Conversion complete. Check output.json for the result.');
