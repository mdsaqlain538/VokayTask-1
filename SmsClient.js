const axios = require("axios");

const tlClient = axios.create({
  baseURL: "https://api.textlocal.in/",
  params: {
    apiKey: "fJfBJnyz91c-TbqrXa8U1yvh9RFUFlIIypeUFJkyJN", //Text local api key
    sender: "6 CHARACTER SENDER ID"
  }
});


//Hash Code
//fabb791416a1eb66fdb44f3081108fb89002cb7225558edc254cc9307340dacb


const SmsClient = {
  sendPartnerWelcomeMessage: user => {
    if (user && user.phone && user.name) {
      const params = new URLSearchParams();
      params.append("numbers", [parseInt("91" + user.phone)]);
      params.append(
        "message",
        `Hi ${user.name},
Welcome to iWheels, Download our app to get bookings from our customers with better pricing. 
https://iwheels.co`
      );
      tlClient.post("/send", params);
    }
  },
  sendVerificationMessage: user => {
    if (user && user.phone) {
      const params = new URLSearchParams();
      params.append("numbers", [parseInt("91" + user.phone)]);
      params.append(
        "message",
        `Your iWheels verification code is ${user.verifyCode}`
      );
      tlClient.post("/send", params);
    }
  }
};

module.exports = SmsClient;