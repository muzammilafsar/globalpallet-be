exports.shopTiming = (req, res) => {
    let date = new Date().getHours();
    if( date >= 11  && date <= 22 ) {
        res.send(true);
    } else {
        res.send(true);  // make it false for shop timings 
    }
}

exports.ocassional = (req, res) => {
    let msg = false;
    if(!msg) {
        res.send({
            message: "currently unavailable due to diwali till next 2 days", // message to display on web
            status: 200    //make it 400 to break the service
        });
    }
}