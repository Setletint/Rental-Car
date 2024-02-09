const rentalPrice = require('../rentalPrice');

describe('Main Function', () => {
    test('All requirements met. 1 day rental. 21 y.o.', () => {
        expect(rentalPrice.price('2024-02-09', '2024-02-09', 'compact', '21', '2020-02-09')).toBe(21);
    });
    test('Individuals under the age of 18 are ineligible to rent a car.', () => {
        expect(rentalPrice.price('2024-02-09', '2024-02-09', 'compact', '17', '2020-02-09')).toBe("Driver too young - cannot quote the price");
    })
    test('Those aged 18-21 can only rent Compact cars.', () =>{
        expect(rentalPrice.price('2024-02-09', '2024-02-09', 'racer', '20', '2020-02-09')).toBe("Drivers 21 y/o or less can only rent Compact vehicles");
    })
    test('For Racers, the price is increased by 50% if the driver is 25 years old or younger (except during the low season).',()=>{
        expect(rentalPrice.price('2024-05-09', '2024-05-09', 'racer', '24', '2020-02-09')).toBe(((24*1.50)*1.15));
    });
    test('Rental cars are categorized into 4 classes: Compact, Electric, Cabrio, Racer.', ()=>{
        expect(rentalPrice.price('2024-05-09', '2024-05-09', 'ramonez', '24', '2020-02-09')).toBe('Selected car class did not exist');
    })
    /*test("Individuals holding a driver's license for less than a year are ineligible to rent.",()=>{
        expect(rentalPrice.price('2024-05-09', '2024-05-09', 'compact', '24', '2024-05-08')).toBe("Driver holding a driver's license less than a year")
    })*/


});