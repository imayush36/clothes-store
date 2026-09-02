export const PINCODE_DIRECTORY = {
  // Mumbai / Maharashtra
  '400001': { city: 'Mumbai', state: 'Maharashtra', days: 2, cod: true, hub: 'Mumbai Central Hub' },
  '400050': { city: 'Mumbai', state: 'Maharashtra', days: 2, cod: true, hub: 'Bandra Hub' },
  '400076': { city: 'Mumbai', state: 'Maharashtra', days: 2, cod: true, hub: 'Powai Hub' },
  '411001': { city: 'Pune', state: 'Maharashtra', days: 2, cod: true, hub: 'Pune City Hub' },
  '440001': { city: 'Nagpur', state: 'Maharashtra', days: 3, cod: true, hub: 'Nagpur Hub' },

  // Delhi NCR
  '110001': { city: 'New Delhi', state: 'Delhi', days: 2, cod: true, hub: 'Connaught Place Hub' },
  '110016': { city: 'New Delhi', state: 'Delhi', days: 2, cod: true, hub: 'Hauz Khas Hub' },
  '122001': { city: 'Gurugram', state: 'Haryana', days: 2, cod: true, hub: 'Cyber City Hub' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', days: 2, cod: true, hub: 'Noida Sector 18 Hub' },

  // Bengaluru / Karnataka
  '560001': { city: 'Bengaluru', state: 'Karnataka', days: 2, cod: true, hub: 'MG Road Hub' },
  '560034': { city: 'Bengaluru', state: 'Karnataka', days: 2, cod: true, hub: 'Koramangala Hub' },
  '560066': { city: 'Bengaluru', state: 'Karnataka', days: 2, cod: true, hub: 'Whitefield Hub' },

  // Hyderabad / Telangana
  '500001': { city: 'Hyderabad', state: 'Telangana', days: 2, cod: true, hub: 'Hyderabad Central' },
  '500081': { city: 'Hyderabad', state: 'Telangana', days: 2, cod: true, hub: 'Hitec City Hub' },

  // Chennai / Tamil Nadu
  '600001': { city: 'Chennai', state: 'Tamil Nadu', days: 3, cod: true, hub: 'Chennai Harbour Hub' },
  '600040': { city: 'Chennai', state: 'Tamil Nadu', days: 3, cod: true, hub: 'Anna Nagar Hub' },

  // Kolkata / West Bengal
  '700001': { city: 'Kolkata', state: 'West Bengal', days: 3, cod: true, hub: 'Kolkata GPO Hub' },

  // Ahmedabad / Gujarat
  '380001': { city: 'Ahmedabad', state: 'Gujarat', days: 2, cod: true, hub: 'Ahmedabad Central' },

  // Jaipur / Rajasthan
  '302001': { city: 'Jaipur', state: 'Rajasthan', days: 3, cod: true, hub: 'Jaipur City Hub' },

  // Lucknow / Uttar Pradesh
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', days: 3, cod: true, hub: 'Lucknow Central' },

  // Chandigarh
  '160017': { city: 'Chandigarh', state: 'Punjab / Chandigarh', days: 2, cod: true, hub: 'Sector 17 Hub' }
};

export function lookupPincode(pincode) {
  if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
    return { valid: false, message: 'Please enter a valid 6-digit PIN code.' };
  }

  const found = PINCODE_DIRECTORY[pincode];
  if (found) {
    return {
      valid: true,
      pincode,
      city: found.city,
      state: found.state,
      estimatedDays: found.days,
      deliveryText: `⚡ Express Delivery in ${found.days} Days`,
      codAvailable: found.cod,
      hub: found.hub
    };
  }

  // Generic estimation for all other Indian PIN codes
  const firstDigit = pincode[0];
  let stateEst = 'India';
  let days = 3;

  if (firstDigit === '1' || firstDigit === '2') { stateEst = 'Northern India'; days = 3; }
  else if (firstDigit === '3' || firstDigit === '4') { stateEst = 'Western India'; days = 2; }
  else if (firstDigit === '5' || firstDigit === '6') { stateEst = 'Southern India'; days = 3; }
  else if (firstDigit === '7' || firstDigit === '8') { stateEst = 'Eastern India'; days = 4; }

  return {
    valid: true,
    pincode,
    city: 'Serviceable Area',
    state: stateEst,
    estimatedDays: days,
    deliveryText: `⚡ Standard Express Delivery in ${days}–${days + 1} Days`,
    codAvailable: true,
    hub: 'Regional Logistics Hub'
  };
}
