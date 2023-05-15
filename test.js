const bcrypt = require("bcryptjs");

const genPassword = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Admin@123", salt);

  console.log(hashedPassword);
};

genPassword();

// console.log(
//   JSON.stringify({
//     requested: { value: "requested", title: "Requested", color: "#F9896B" },
//     negotiate: { value: "negotiate", title: "Negotiate", color: "#33D69F" },
//     ordered: { value: "ordered", title: "Ordered", color: "#F324B9" },
//     structureReady: {
//       value: "structureReady",
//       title: "Structure Ready",
//       color: "#64C900",
//     },
//     upholsteryReady: {
//       value: "upholsteryReady",
//       title: "Upholstery Ready",
//       color: "#F68D00",
//     },
//     readyForDelivery: {
//       value: "readyForDelivery",
//       title: "Ready For Delivery",
//       color: "#4F46BA",
//     },
//     delivered: { value: "delivered", title: "Delivered", color: "#00AB4D" },
//   })
// );
