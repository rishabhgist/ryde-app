import React, { useEffect, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import Button from "./Button";
import { useStripe } from "@stripe/stripe-react-native";
import { fetchAPI } from "../lib/fetch";
import { PaymentProps } from "../types/types";
import { useLocationStore } from "../store";
import { useAuth } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import { images } from "../constants";
import { Router } from "../app/util";

const Payment = ({ fullName, email, amount, driverId, rideTime }: PaymentProps) => {
  const { userAddress, userLatitude, userLongitude, destinationAddress, destinationLatitude, destinationLongitude } = useLocationStore();
  const { userId } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [success, setSuccess] = useState(false);

  const initializePaymentSheet = async () => {
    try {
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Ryde Inc.",
        intentConfiguration: {
          mode: { amount: parseInt(amount) * 100, currencyCode: "USD" },
          confirmHandler: async (paymentMethod: any, _: any, intentCreationCallBack: any) => {
            const { paymentIntent, customer } = await fetchAPI("/(api)/(stripe)/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fullName || email.split("@")[0], email: email, amount: amount, paymentMethodId: paymentMethod.id }) });

            if (paymentIntent.client_secret) {
              const { result } = await fetchAPI("/(api)/(stripe)/pay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payment_method_id: paymentMethod.id, payment_intent_id: paymentIntent.id, customer_id: customer }) });
              if (result.client_secret) {
                const preparedData = {
                  origin_address: userAddress,
                  destination_address: destinationAddress,
                  origin_latitude: userLatitude,
                  origin_longitude: userLongitude,
                  destination_latitude: destinationLatitude,
                  destination_longitude: destinationLongitude,
                  ride_time: rideTime.toFixed(0),
                  fare_price: parseInt(amount) * 100,
                  payment_status: "paid",
                  driver_id: driverId,
                  user_id: userId,
                };
                const res = await fetchAPI("/(api)/ride/create", { method: "POST", body: JSON.stringify(preparedData), headers: { "Content-Type": "application/json" } });
                intentCreationCallBack({ client_secret: result.client_secret });
              }
            }
          },
        },
        returnURL: "myapp://book-ride",
      });
      console.log("error", error);
    } catch (error) {
      console.log("Payement Error", error);
    }
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    try {
      const preparedData = {
        origin_address: userAddress,
        destination_address: destinationAddress,
        origin_latitude: userLatitude,
        origin_longitude: userLongitude,
        destination_latitude: destinationLatitude,
        destination_longitude: destinationLongitude,
        ride_time: rideTime.toFixed(0),
        fare_price: parseInt(amount) * 100,
        payment_status: "paid",
        driver_id: driverId,
        user_id: userId,
      };
      const res = await fetchAPI("/(api)/ride/create", { method: "POST", body: JSON.stringify(preparedData), headers: { "Content-Type": "application/json" } });
      console.log(res);
      setSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <>
      <Button
        title="Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />
      <ReactNativeModal
        isVisible={success}
        onBackButtonPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image
            source={images.check}
            className="w-28 h-28 mt-5"
          />
          <Text className="text-2xl text-center font-JakartaBold mt-5">Ride booked</Text>
          <Text className="text-base text-general-200 font-JakartaMedium text-center mt-3">Thankyou for your booking. Your reservation has been placed. Please process with your tirp</Text>
          <Button
            title="Back Home"
            className="mt-5"
            onPress={() => {
              setSuccess(false);
              Router.push("/(root)/(tabs)/home");
            }}
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;
