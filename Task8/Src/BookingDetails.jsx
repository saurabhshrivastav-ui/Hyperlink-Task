import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../Components/TextWrapper";
import { addBooking } from "./BookingStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.38;
const PKG_ITEM_WIDTH = CARD_WIDTH + 12;
const PKG_CLONE_COUNT = 40;

const popularPackages = [
  {
    id: 1,
    title: "Full Body Checkup",
    desc: "A complete yearly health screen",
    price: "1599/-",
  },
  {
    id: 2,
    title: "Full Body Checkup",
    desc: "A complete yearly health screen",
    price: "1599/-",
  },
  {
    id: 3,
    title: "Full Body Checkup",
    desc: "A complete yearly health screen",
    price: "1599/-",
  },
];

const BookingDetails = () => {
  const navigation = useNavigation();
  const pkgScrollRef = useRef(null);
  const pkgScrollX = useRef(0);
  const [hardCopyChecked, setHardCopyChecked] = useState(false);

  const pkgLoopData = useRef(
    Array.from({ length: popularPackages.length * PKG_CLONE_COUNT }, (_, i) => ({
      ...popularPackages[i % popularPackages.length],
      _key: `pkg-${i}`,
    }))
  ).current;
  const PKG_ONE_SET = popularPackages.length * PKG_ITEM_WIDTH;
  const PKG_ORIGIN = PKG_ONE_SET * Math.floor(PKG_CLONE_COUNT / 2);

  React.useEffect(() => {
    if (pkgScrollRef.current) {
      pkgScrollRef.current.scrollTo({ x: PKG_ORIGIN, animated: false });
      pkgScrollX.current = PKG_ORIGIN;
    }
  }, []);

  const pkgRecenter = (x) => {
    pkgScrollX.current = x;
    const setsFromOrigin = Math.abs(x - PKG_ORIGIN) / PKG_ONE_SET;
    if (setsFromOrigin > 5) {
      const offset = ((x % PKG_ONE_SET) + PKG_ONE_SET) % PKG_ONE_SET;
      const newX = PKG_ORIGIN + offset;
      pkgScrollX.current = newX;
      if (pkgScrollRef.current) {
        pkgScrollRef.current.scrollTo({ x: newX, animated: false });
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#E8D5F5", "#F5E0EC", "#FFF0E0"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={26} color="#6D28D9" />
            </TouchableOpacity>
            <Text weight="700" style={styles.navTitle}>
              Booking Details
            </Text>
          </View>
        </LinearGradient>

        {/* Test Info Card */}
        <View style={styles.testCard}>
          <View style={styles.testCardRow}>
            <View style={styles.testImgWrap}>
              <Image
                source={require("../assets/scan.webp")}
                style={styles.testImg}
                resizeMode="contain"
              />
            </View>
            <View style={styles.testInfoCol}>
              <Text weight="700" style={styles.testTitle}>
                Diabetes Screening{"\n"}(HbAIC & Fasting Sugar)
              </Text>
              <View style={styles.pillRow}>
                <View style={styles.pill}>
                  <Text weight="500" style={styles.pillText}>
                    Contains 2 tests
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={14}
                    color="#6D28D9"
                  />
                </View>
                <View style={styles.pill}>
                  <Text weight="500" style={styles.pillText}>
                    Report within 15 hrs
                  </Text>
                </View>
              </View>
              <View style={styles.priceRow}>
                <Text weight="700" style={styles.priceMain}>
                  479/-
                </Text>
                <Text weight="400" style={styles.priceOld}>
                  625/-
                </Text>
                <Text weight="700" style={styles.priceOff}>
                  25% off
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Booked Together */}
        <Text weight="600" style={styles.sectionLabel}>
          Booked Together
        </Text>

        <ScrollView
          ref={pkgScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.packageListContent}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => pkgRecenter(e.nativeEvent.contentOffset.x)}
          onScrollEndDrag={(e) => pkgRecenter(e.nativeEvent.contentOffset.x)}
        >
          {pkgLoopData.map((pkg) => (
            <View key={pkg._key} style={styles.packageCard}>
              <Text weight="700" style={styles.packageTitle} numberOfLines={1}>
                {pkg.title}
              </Text>
              <Text weight="600" style={styles.packageDesc}>
                {pkg.desc}
              </Text>
              <Text weight="800" style={styles.packagePrice}>
                {pkg.price}
              </Text>
              <View style={styles.packageArrowBtn}>
                <MaterialIcons name="keyboard-arrow-right" size={14} color="#5C3EAB" />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Date & Time */}
        <View style={styles.dateTimeRow}>
          <Ionicons name="calendar-outline" size={18} color="#6D28D9" />
          <Text weight="500" style={styles.dateTimeText}>
            Saturday, 28th Jun 09:00 am
          </Text>
        </View>

        {/* Patient Details Card */}
        <View style={styles.patientCard}>
          {/* Patient Name */}
          <View style={styles.patientRow}>
            <View>
              <Text weight="400" style={styles.patientLabel}>
                Patient name
              </Text>
              <Text weight="600" style={styles.patientValue}>
                Sakshi Nishad
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text weight="600" style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Patient Contact */}
          <View style={styles.patientRow}>
            <View>
              <Text weight="400" style={styles.patientLabel}>
                Patient contact number
              </Text>
              <Text weight="600" style={styles.patientValue}>
                8169928844
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text weight="600" style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mode of Test */}
          <View style={styles.patientRow}>
            <View>
              <Text weight="400" style={styles.patientLabel}>
                Mode of Test
              </Text>
              <View style={styles.modeChip}>
                <Text weight="500" style={styles.modeChipText}>
                  Home Sample Collection
                </Text>
              </View>
            </View>
          </View>

          {/* Address */}
          <View style={styles.patientRow}>
            <View style={{ flex: 1 }}>
              <Text weight="600" style={styles.patientValue}>
                473, Torana Chs, Ramnagar, Ghatkopar West
              </Text>
              <Text weight="400" style={styles.addressSubline}>
                Mumbai, Maharashtra – 400086
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text weight="600" style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Value Add-ons */}
        <Text weight="700" style={styles.sectionTitle}>
          Value add-ons
        </Text>

        <View style={styles.addOnCardShadow}>
        <LinearGradient
          colors={["rgba(255, 233, 207, 0.6)", "rgba(255, 253, 251, 0.6)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.48, y: 1 }}
          style={styles.addOnCard}
        >
          <View style={styles.addOnRow}>
            <View style={styles.addOnIconWrap}>
              <Image
                source={require("../assets/print.webp")}
                style={styles.addOnImg}
                resizeMode="cover"
              />
            </View>
            <View style={styles.addOnInfo}>
              <Text weight="700" style={styles.addOnTitle}>
                Hard copy of reports
              </Text>
              <Text weight="400" style={styles.addOnDesc}>
                reports will be delivered within 3 - 4 working days.{"\n"}hard copy charges are non-refundable
              </Text>
              <Text weight="700" style={styles.addOnPrice}>
                150/- <Text weight="400" style={styles.addOnPriceSub}>per person</Text>
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setHardCopyChecked(!hardCopyChecked)}
              style={styles.checkboxOuter}
            >
              {hardCopyChecked && (
                <MaterialIcons name="check" size={16} color="#6D28D9" />
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
        </View>

        {/* Bill Summary */}
        <Text weight="700" style={styles.sectionTitle}>
          Bill summary
        </Text>

        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text weight="500" style={styles.billLabel}>
              Item total (MRP)
            </Text>
            <Text weight="500" style={styles.billValue}>
              479/-
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text weight="500" style={styles.billDiscountLabel}>
              Price discount
            </Text>
            <Text weight="500" style={styles.billDiscountValue}>
              -150/-
            </Text>
          </View>
          <View style={styles.billDivider} />
          <View style={styles.billRow}>
            <Text weight="700" style={styles.billTotalLabel}>
              Total Amount
            </Text>
            <Text weight="700" style={styles.billTotalValue}>
              479/-
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <LinearGradient
        colors={["#E4CCF7", "#FFE9CF"]}
        locations={[0, 1]}
        start={{ x: 0.17, y: 0 }}
        end={{ x: 0.93, y: 1 }}
        style={styles.bottomBar}
      >
        <View style={styles.bottomBarInner}>
          <View>
            <Text weight="400" style={styles.bottomBarLabel}>
              Total Amount
            </Text>
            <Text weight="700" style={styles.bottomBarPrice}>
              479/-
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={async () => {
            await addBooking({
              testTitle: "Diabetes Screening (HbAIC & Fasting Sugar)",
              patientName: "Sakshi Kewat",
              contact: "8169928844",
              address: "Amrut Nagar, Ghatkopar West, Mumbai",
              time: "12pm",
              amount: "479/-",
              paymentStatus: "Paid",
              reportStatus: "Upcoming",
              status: "upcoming",
            });
            navigation.navigate("LabHistory");
          }}>
            <LinearGradient
              colors={["#B148FF", "#F6339B", "#9914F9"]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.payNowBtn}
            >
              <Text weight="700" style={styles.payNowText}>
                Pay Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF5FF",
  },
  scrollView: {
    flex: 1,
  },

  /* Header */
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    padding: 2,
  },
  navTitle: {
    fontSize: 18,
    color: "#553FB5",
  },

  /* Test Card */
  testCard: {
    width: 323,
    alignSelf: "center",
    backgroundColor: "#FBF1FE",
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    borderWidth: 0.6,
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  testCardRow: {
    flexDirection: "row",
    gap: 12,
  },
  testImgWrap: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
  },
  testImg: {
    width: 36,
    height: 36,
  },
  testInfoCol: {
    flex: 1,
  },
  testTitle: {
    fontSize: 13,
    color: "#1F2937",
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 2,
  },
  pillText: {
    fontSize: 10,
    color: "#6D28D9",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priceMain: {
    fontSize: 16,
    color: "#6D28D9",
  },
  priceOld: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  priceOff: {
    fontSize: 12,
    color: "#16A34A",
  },

  /* Booked Together */
  sectionLabel: {
    fontSize: 14,
    color: "#6D28D9",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  packageListContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  packageCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.67,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3E8FF",
    ...Platform.select({
      ios: {
        shadowColor: "#BF7BB9",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: { elevation: 3, shadowColor: "#BF7BB9" },
    }),
  },
  packageTitle: {
    fontSize: 11,
    color: "#1A1A1A",
    marginBottom: 4,
    textAlign: "center",
  },
  packageDesc: {
    fontSize: 8,
    color: "#6D28D9",
    textAlign: "center",
    lineHeight: 10,
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 14,
    color: "#000000",
  },
  packageArrowBtn: {
    position: "absolute",
    top: "38%",
    right: -10,
    width: 21,
    height: 21,
    borderRadius: 10.5,
    borderWidth: 1,
    borderColor: "#E2D3FE",
    backgroundColor: "#F1E7FE",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },


  /* Date & Time */
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 14,
  },
  dateTimeText: {
    fontSize: 13,
    color: "#374151",
  },

  /* Patient Card */
  patientCard: {
    width: 323,
    alignSelf: "center",
    backgroundColor: "#FBF1FE",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  patientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  patientLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  patientValue: {
    fontSize: 13,
    color: "#1F2937",
  },
  editText: {
    fontSize: 12,
    color: "#6D28D9",
  },
  modeChip: {
    paddingHorizontal: 12,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 4,
  },
  modeChipText: {
    fontSize: 11,
    color: "#595959",
    textAlign: "center",
  },
  addressSubline: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },

  /* Value Add-ons */
  sectionTitle: {
    fontSize: 15,
    color: "#1F2937",
    marginTop: 22,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  addOnCardShadow: {
    width: 326,
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#FFF5EC",
  },
  addOnCard: {
    width: "100%",
    height: 85,
    borderRadius: 10,
    padding: 14,
    overflow: "hidden",
  },
  addOnRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  addOnIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  addOnImg: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  addOnInfo: {
    flex: 1,
  },
  addOnTitle: {
    fontSize: 13,
    color: "#1F2937",
    marginBottom: 4,
  },
  addOnDesc: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
    marginBottom: 6,
  },
  addOnPrice: {
    fontSize: 13,
    color: "#1F2937",
  },
  addOnPriceSub: {
    fontSize: 11,
    color: "#6B7280",
  },
  checkboxOuter: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  /* Bill Summary */
  billCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.6,
    borderColor: "#F3E8FF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    color: "#374151",
  },
  billValue: {
    fontSize: 13,
    color: "#374151",
  },
  billDiscountLabel: {
    fontSize: 13,
    color: "#17c625",
  },
  billDiscountValue: {
    fontSize: 13,
    color: "#17c625",
  },
  billDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  billTotalLabel: {
    fontSize: 15,
    color: "#1F2937",
  },
  billTotalValue: {
    fontSize: 15,
    color: "#1F2937",
  },

  /* Bottom Bar */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  bottomBarInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomBarLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 2,
  },
  bottomBarPrice: {
    fontSize: 18,
    color: "#000000",
  },
  payNowBtn: {
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  payNowText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
});
