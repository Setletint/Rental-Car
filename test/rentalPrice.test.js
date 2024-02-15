const rentalPrice = require('../rentalPrice');

describe('Main Function', () => {
    test('All requirements met. 1 day rental. 21 y.o.', () => {
        expect(rentalPrice.price('2024-02-09', '2024-02-09', 'compact', '21', '2020-02-09')).toBe(21);
    })

    test('Rental cars are categorized into 4 classes: Compact, Electric, Cabrio, Racer.', ()=>{
        expect(rentalPrice.price('2024-05-09', '2024-05-09', 'ramonez', '24', '2020-02-09')).toBe('Selected car class did not exist');
    })
    test('Individuals under the age of 18 are ineligible to rent a car.', () => {
        expect(rentalPrice.price('2024-02-09', '2024-02-09', 'compact', '17', '2020-02-09')).toBe("Driver too young - cannot quote the price");
    })

    test('Those aged 18-21 can only rent Compact cars.', () =>{
        expect(rentalPrice.price('2024-02-09', '2024-02-09', 'racer', '20', '2020-02-09')).toBe("Drivers 21 y/o or less can only rent Compact vehicles");
    })

    test('For Racers, the price is increased by 50% if the driver is 25 years old or younger (except during the low season)',()=>{
        expect(rentalPrice.price('2024-05-09', '2024-05-09', 'racer', '24', '2020-02-09')).toBe(((24*1.50)*1.15));
    })
    test("If renting for more than 10 days, price is decresed by 10% (except during the high season)", ()=>{
        expect(rentalPrice.price('2024-02-09', '2024-02-19', 'compact', '24','2020-02-09')).toBe((24*11)*0.9);
    })

    test("Individuals holding a driver's license for less than a year are ineligible to rent.",()=>{
        expect(rentalPrice.price('2024-05-09', '2024-05-09', 'compact', '24',Date.now())).toBe("Driver holding a driver's license less than a year");
    })
    test("If the driver's license has been held for less than two years, the rental price is increased by 30%.", ()=>{
        Moment = Date.now();
        TwoYearsAgo = Moment-31536000001;
        expect(rentalPrice.price('2024-02-09', '2024-02-09', 'compact', '24',TwoYearsAgo)).toBe((24*1.3));
    })
    test("If the driver's license has been held for less than three years, then an additional 15 euros will be added to the daily rental price during high season",()=>{
        Moment = Date.now();
        ThreeYearsAgoWithoutDay = Moment-(31536000001*2);
        expect(rentalPrice.price('2024-05-09', '2024-05-09', 'compact', '27',ThreeYearsAgoWithoutDay)).toBe((27+15)*1.15);
    })

});