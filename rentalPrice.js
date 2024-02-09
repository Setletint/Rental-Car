
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const _ALL_CAR_CLASSES = ['compact', 'electric', 'cabrio', 'racer'];

const _YEAR = 365;

function calculatePrice(pickupDate, dropoffDate, type, age, LicenseDateObtaining) {

    const licenseDays = getLicenseDays(LicenseDateObtaining);

    const rentalDays = getRentalDays(pickupDate, dropoffDate);
    const rentalSeason = getRentalSeason(pickupDate, dropoffDate);

    // Rental cars are categorized into 4 classes: Compact, Electric, Cabrio, Racer.
    if (!carClassExists(type)) {
        return "Selected car class did not exist";
    }

    // The minimum rental price per day is equivalent to the age of the driver.
    let rentalPrice = age * rentalDays;

    let ageReqMet = ageReqCheck(age, type, rentalSeason, rentalPrice);
    if (typeof ageReqMet != 'number') {
        return ageReqMet;   
    } else {
        rentalPrice = ageReqMet;
    }

    let licenseReq = licenseReqCheck(rentalDays, rentalSeason, licenseDays, rentalPrice)
    if (typeof licenseReq != 'number') {
        return licenseReq;
    } else {
        rentalPrice = licenseReq;
    }

    rentalPrice = calculateSeasonPrice(rentalSeason,rentalDays, rentalPrice);

    return rentalPrice;
}

function calculateSeasonPrice(rentalSeason, rentalDays, rentalPrice) {
    // If renting in High season, price is increased by 15%.
    if (rentalSeason === "High") {
        rentalPrice *= 1.15;
    }
    // If renting for more than 10 days, price is decresed by 10% (except during the high season). 
    else if (rentalDays > 10 && rentalSeason === "Low") {
        rentalPrice *= 0.9;
    }

    return rentalPrice;
}

function licenseReqCheck(rentalDays, rentalSeason, licenseDays, price = 0) {
    // Individuals holding a driver's license for less than a year are ineligible to rent.
    if (licenseDays < _YEAR) {
        return "Driver holding a driver's license less than a year";
    } else if (licenseDays < (_YEAR * 2)) {
        return price *= 1.3;
    } else if (licenseDays < (_YEAR * 3) && rentalSeason === "High") {
        return price += (15 * rentalDays);
    } else {
        return price;
    }
}

function ageReqCheck(age, type, rentalSeason, price) {
    // Individuals under the age of 18 are ineligible to rent a car.
    if (age < 18) {
        return "Driver too young - cannot quote the price";
    }
    // Those aged 18-21 can only rent Compact cars.
    else if (age <= 21 && type !== "compact") {
        return "Drivers 21 y/o or less can only rent Compact vehicles";
    }
    // For Racers, the price is increased by 50% if the driver is 25 years old or younger (except during the low season).
    if (type === "racer" && age <= 25 && rentalSeason !== "Low") {
        price *= 1.5;
    }
    return price;
}

function carClassExists(carClass) {
    for (currentClass in _ALL_CAR_CLASSES) {
        if (_ALL_CAR_CLASSES[currentClass] == carClass) {
            return true;
        }
    }
    return false;
}

// Function to get amount of rental days
function getRentalDays(pickupDate, dropoffDate) {

    const rentDate = new Date(pickupDate);
    const rentOverDate = new Date(dropoffDate);

    return Math.round(Math.abs((rentDate - rentOverDate) / MILLISECONDS_PER_DAY)) + 1;
}

// Function to check if rental months are high or low seasons
function getRentalSeason(pickupDate, dropoffDate) {

    // Low season is from November until end of March. 
    // High season is from April until end of October.
    const highSeasonStart = 3; //April
    const highSeasonEnd = 9; // October

    const rentDate = new Date(pickupDate);
    const rentOverDate = new Date(dropoffDate);

    const rentMonth = rentDate.getMonth();
    const rentOverMonth = rentOverDate.getMonth();

    if (
        (rentMonth >= highSeasonStart && rentMonth <= highSeasonEnd) ||
        (rentOverMonth >= highSeasonStart && rentOverMonth <= highSeasonEnd)
    ) {
        return "High";
    } else {
        return "Low";
    }
}

// NOT IMPLEMENTED YET

function getLicenseDays(obtainingDate) {

    obtainingDate = new Date(Number(obtainingDate));
    currentDate = new Date();

    const timePast = Math.abs(currentDate - obtainingDate);

    const daysPast = Math.ceil(timePast / MILLISECONDS_PER_DAY);

    return daysPast;
}

// Exports
exports.price = calculatePrice;