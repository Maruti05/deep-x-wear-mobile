// import { Image, useColorMode } from "@gluestack-ui/themed";
// import React from "react";
// import Logo from "../../assets/images/logo-d.svg";

// const APP_NAME = "Deep-Xwear";

// export function BrandLogo() {
//   const  colorMode = useColorMode();

//   return (
//     <Image
//       source={Logo}
//       alt={APP_NAME}
//       size={{ width: "auto", height: "$10" }} // Responsive: h-10 w-auto equivalent
//       style={{
//         // Dark mode inversion via tint (lightens/darkens; adjust as needed)
//         tintColor: colorMode === "dark" ? "#ffffff" : undefined,
//         // Or use opacity/filter for more control
//         // opacity: colorMode === "dark" ? 1 : 0.8, // Example
//       }}
//       resizeMode="contain" // Ensures it scales nicely like w-auto
//     />
//   );
// }