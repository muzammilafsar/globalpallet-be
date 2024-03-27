var mongoose = require('mongoose');
var daily = require('./daily_report_creator');
var business = require('./business_report_creator');

// Testing below
// Delete this later

// exports.testFire = (req, res) => {

//     let myOrder = {
//           __v: 0,
//           _id: '5cb3ccde87fa740015882426',
//           applied_coupon_discount: 20,
//           applied_coupon_name: 'TEST10',
//           cod: true,
//           coupon_applied: true,
//           delivery_charge: 30,
//           device: 'Android',
//           items: [
//             {
//               price: 40,
//               product: {
//                 _id: '5c34ca6fe7cab321d53e6aa5',
//                 bit: 10,
//                 name: 'Chicken Biryani',
//                 order_score: 1,
//                 price_1: 188,
//                 product_id: 'F01',
//                 qty_1: 39,
//                 status: true,
//                 veg: false,
//               },
//               quantity: 2,
//             },
//           ],
//           last_updated: 1555286784756,
//           mobile: 9818598849,
//           order_cancelled: false,
//           order_completed: false,
//           order_special_id: 1629,
//           total_items: 2,
//           total_price: 188,
//           updated: false,
//     };

//     let proding2 = [{
//         product: {
//             name: 'Kele',
//             product_id: 'F00',
//             bit: 1,
//         }, 
//         quantity: 25
//     },
//     {   product: {
//             name: 'Chicken Biryani',
//             product_id: 'F01',
//             bit: 2,
//         }, 
//         quantity: 25, 
//     }];

//     let proding = [{
//             product: {
//                 name: 'Chicken Biryani',
//                 product_id: 'F01',
//                 bit: 2,
//             }, 
//             quantity: 2
//         },
//         {   product: {
//                 name: 'Egg Roll',
//                 product_id: 'F07',
//                 bit: 3
//             }, 
//             quantity: 2, 
//         }];

//     let orderPP = [
//         {
//           product: {
//             _id: '5c34ca6fe7cab321d53e6aa5',
//             bit: 10,
//             name: 'Chicken Biryani',
//             order_score: 1,
//             price_1: 89,
//             product_id: 'F01',
//             qty_1: 39,
//             status: true,
//             veg: false,
//           },
//           quantity: 2,
//         }
//       ];

//         // daily.orderPlace(proding, 188, 30, 'TEST10', 17, 'iOS', 'Amroha');
//         // daily.orderCancel(proding);
        
//         // daily.orderCancel(myOrder);
//         daily.orderPlace(orderPP, 188, 30, 'TEST10', 20, 'Android', 'Hasanpur');

//         res.send({
//             'message': 'Working'
//         });
// }
