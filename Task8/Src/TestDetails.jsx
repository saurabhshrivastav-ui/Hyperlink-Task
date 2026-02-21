import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  FlatList,
  Modal,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.38;

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

const TestDetails = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPatientSheet, setShowPatientSheet] = useState(false);
  const [showSlotSheet, setShowSlotSheet] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slotDays = [
    { label: "Today", slots: "6 slots" },
    { label: "Tomorrow", slots: "10 slots" },
    { label: "Sun, 29 jun", slots: "12 slots" },
  ];
  const timePeriods = ["Morning", "Afternoon", "Evening"];
  const timeSlots = [
    "09.00 am - 10.00 am",
    "10.00 am - 11.00 am",
    "11.00 am - 12.00 pm",
  ];

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

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
              Test
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
                resizeMode="cover"
              />
            </View>
            <View style={styles.testInfoRight}>
              <Text weight="700" style={styles.testTitle}>
                Diabetes Screening{"\n"}(HbAIC & Fasting Sugar)
              </Text>
              <View style={styles.pillRow}>
                <View style={styles.pill}>
                  <Text weight="500" style={styles.pillText}>
                    Contains 2 tests
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={16} color="#22C55E" />
                </View>
                <View style={styles.pill}>
                  <Text weight="500" style={styles.pillText}>
                    Report within 15 hrs
                  </Text>
                </View>
              </View>
              <View style={styles.priceRow}>
                <Text weight="700" style={styles.price}>479/-</Text>
                <Text weight="400" style={styles.originalPrice}>625/-</Text>
                <Text weight="600" style={styles.discount}>25% off</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Know More Section */}
        <View style={styles.section}>
          <Text weight="600" style={styles.sectionTitle}>
            Know more about this test
          </Text>
          <View style={styles.knowMoreCard}>
            <Text weight="400" style={styles.knowMoreText}>
              {"\u2022"} Passengers travelling to and from YF endemic countries (countries
              where Yellow Fever is persisting) are required to be in possession
              of a "VALID YELLOW FEVER VACCINATION CERTIFICATE" issued by
              authorized and designated vaccination centers in India.
            </Text>
            <Text weight="400" style={styles.knowMoreText}>
              {"\u2022"} Those found not in possession of such Valid certificate or defective
              certificate as enumerated by the WHO, are upon...{" "}
              <Text weight="600" style={styles.seeMore}>See more</Text>
            </Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCardRow}>
            <View style={styles.infoCard}>
              <Text weight="400" style={styles.infoLabel}>Samples Required</Text>
              <Text weight="700" style={styles.infoValue}>Blood</Text>
            </View>
            <View style={styles.infoCard}>
              <Text weight="400" style={styles.infoLabel}>Find out</Text>
              <Text weight="700" style={styles.infoValue}>
                Why is this test{"\n"}booked?
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text weight="400" style={styles.infoLabel}>Preparations</Text>
              <Text weight="700" style={styles.infoValue}>
                Overnight Fasting{"\n"}Required
              </Text>
            </View>
          </View>
          <View style={styles.infoCardFull}>
            <Text weight="400" style={styles.infoLabel}>Sample Collection</Text>
            <Text weight="700" style={styles.infoValue}>
              Who will collect your samples?
            </Text>
          </View>
        </View>

        {/* Popular Packages */}
        <View style={styles.popularSection}>
          <View style={styles.popularHeader}>
            <Text weight="700" style={styles.popularTitle}>Popular Packages</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text weight="600" style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={popularPackages}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.packageList}
            snapToInterval={CARD_WIDTH + 12}
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <View style={styles.packageCard}>
                <Text weight="700" style={styles.packageTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text weight="600" style={styles.packageDesc}>
                  {item.desc}
                </Text>
                <Text weight="800" style={styles.packagePrice}>
                  {item.price}
                </Text>
                <View style={styles.packageArrowBtn}>
                  <MaterialIcons name="keyboard-arrow-right" size={14} color="#5C3EAB" />
                </View>
              </View>
            )}
          />

          {/* Dots */}
          <View style={styles.dotsRow}>
            {popularPackages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <LinearGradient
        colors={["#E4CCF7", "#FFE9CF"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.bottomBar}
      >
        <View>
          <Text weight="400" style={styles.totalLabel}>Total Amount</Text>
          <Text weight="700" style={styles.totalPrice}>479/-</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.bookTestBtnWrap}
          onPress={() => setShowPatientSheet(true)}
        >
          <LinearGradient
            colors={["#B148FF", "#F6339B", "#9914F9"]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookTestBtn}
          >
            <Text weight="700" style={styles.bookTestBtnText}>Book a Test</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Patient Details Bottom Sheet */}
      <Modal
        visible={showPatientSheet}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPatientSheet(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setShowPatientSheet(false)}
        >
          <View style={styles.sheetContainer} onStartShouldSetResponder={() => true}>
            <LinearGradient
              colors={["#E4CCF7", "#FFE9CF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.4 }}
              style={styles.sheetGradient}
            >
              {/* Header */}
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setShowPatientSheet(false)}>
                  <MaterialIcons name="arrow-back" size={24} color="#6D28D9" />
                </TouchableOpacity>
                <Text weight="700" style={styles.sheetTitle}>Patient details</Text>
              </View>

              <Text weight="600" style={styles.sheetSubtitle}>
                Lets Start with your personal details
              </Text>

              {/* Profile Card */}
              <LinearGradient
                colors={["#FDEFFB", "#FBF1FE", "#E9DAFD"]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.sheetProfileCard}
              >
                <View style={styles.sheetProfileRow}>
                  <LinearGradient
                    colors={["#FDBEA5", "#F695CF", "#8E66EB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarOuterRing}
                  >
                    <View style={styles.avatarWhiteRing}>
                      <LinearGradient
                        colors={["#EEA6C8", "#996EEB"]}
                        start={{ x: 0.13, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.avatarGradient}
                      >
                        <Text weight="700" style={styles.avatarText}>SN</Text>
                      </LinearGradient>
                    </View>
                  </LinearGradient>

                  <View style={styles.sheetProfileInfo}>
                    <Text weight="700" style={styles.sheetProfileName}>Sakshi Nishad</Text>
                    <View style={styles.sheetTagsRow}>
                      <View style={styles.sheetTag}>
                        <Text weight="500" style={styles.sheetTagText}>Female</Text>
                      </View>
                      <View style={styles.sheetTag}>
                        <Text weight="500" style={styles.sheetTagText}>22 yrs</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.sheetDropdownIcon}>
                    <Ionicons name="chevron-down" size={22} color="#7C3AED" />
                  </View>
                </View>
              </LinearGradient>

              {/* Book a Slot Button */}
              <TouchableOpacity activeOpacity={0.8} style={styles.bookSlotBtnWrap}
                onPress={() => {
                  setShowPatientSheet(false);
                  setShowSlotSheet(true);
                }}
              >
                <LinearGradient
                  colors={["#B148FF", "#F6339B", "#9914F9"]}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.bookSlotBtn}
                >
                  <Text weight="700" style={styles.bookSlotBtnText}>Book a slot</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Slot Selection Bottom Sheet */}
      <Modal
        visible={showSlotSheet}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSlotSheet(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setShowSlotSheet(false)}
        >
          <View style={styles.slotSheetContainer} onStartShouldSetResponder={() => true}>
            <LinearGradient
              colors={["#E4CCF7", "#FFE9CF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.4 }}
              style={styles.slotSheetGradient}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.sheetHeader}>
                  <TouchableOpacity onPress={() => setShowSlotSheet(false)}>
                    <MaterialIcons name="arrow-back" size={24} color="#6D28D9" />
                  </TouchableOpacity>
                  <Text weight="700" style={styles.sheetTitle}>Slot Selection</Text>
                </View>

                {/* Profile Card */}
                <LinearGradient
                  colors={["#FDEFFB", "#FBF1FE", "#E9DAFD"]}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.sheetProfileCard}
                >
                  <View style={styles.sheetProfileRow}>
                    <LinearGradient
                      colors={["#FDBEA5", "#F695CF", "#8E66EB"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.avatarOuterRing}
                    >
                      <View style={styles.avatarWhiteRing}>
                        <LinearGradient
                          colors={["#EEA6C8", "#996EEB"]}
                          start={{ x: 0.13, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.avatarGradient}
                        >
                          <Text weight="700" style={styles.avatarText}>SN</Text>
                        </LinearGradient>
                      </View>
                    </LinearGradient>

                    <View style={styles.sheetProfileInfo}>
                      <Text weight="700" style={styles.sheetProfileName}>Sakshi Nishad</Text>
                      <View style={styles.sheetTagsRow}>
                        <View style={styles.sheetTag}>
                          <Text weight="500" style={styles.sheetTagText}>Female</Text>
                        </View>
                        <View style={styles.sheetTag}>
                          <Text weight="500" style={styles.sheetTagText}>22 yrs</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.sheetDropdownIcon}>
                      <Ionicons name="chevron-down" size={22} color="#7C3AED" />
                    </View>
                  </View>
                </LinearGradient>

                {/* Select Address */}
                <View style={styles.slotAddressCard}>
                  <View style={styles.slotAddressHeader}>
                    <Text weight="600" style={styles.slotAddressTitle}>Select Address</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text weight="600" style={styles.slotChangeText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.slotDivider} />
                  <Text weight="700" style={styles.slotAddressLine1}>
                    473, Torana Chs, Ramnagar, Ghatkopar West
                  </Text>
                  <Text weight="400" style={styles.slotAddressLine2}>
                    Mumbai, Maharashtra – 400086
                  </Text>
                </View>

                {/* Select A Slot */}
                <View style={styles.slotPickerCard}>
                  <Text weight="600" style={styles.slotPickerTitle}>Select A Slot</Text>
                  <View style={styles.slotDivider} />

                  {/* Day Pills */}
                  <View style={styles.slotDayRow}>
                    {slotDays.map((day, index) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => setSelectedDay(index)}
                        style={[
                          styles.slotDayPill,
                          selectedDay === index && styles.slotDayPillActive,
                        ]}
                      >
                        <Text
                          weight="600"
                          style={[
                            styles.slotDayLabel,
                            selectedDay === index && styles.slotDayLabelActive,
                          ]}
                        >
                          {day.label}
                        </Text>
                        <Text
                          weight="400"
                          style={[
                            styles.slotDaySlots,
                            selectedDay === index && styles.slotDaySlotsActive,
                          ]}
                        >
                          {day.slots}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Time Period Pills */}
                  <View style={styles.slotPeriodRow}>
                    {timePeriods.map((period, index) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => setSelectedPeriod(index)}
                        style={[
                          styles.slotPeriodPill,
                          selectedPeriod === index && styles.slotPeriodPillActive,
                        ]}
                      >
                        <Text
                          weight="500"
                          style={[
                            styles.slotPeriodText,
                            selectedPeriod === index && styles.slotPeriodTextActive,
                          ]}
                        >
                          {period}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Time Slots */}
                  <View style={styles.slotTimesContainer}>
                    {timeSlots.map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => setSelectedSlot(index)}
                        style={styles.slotTimeRow}
                      >
                        <View style={styles.slotRadioOuter}>
                          {selectedSlot === index && <View style={styles.slotRadioInner} />}
                        </View>
                        <Text
                          weight={selectedSlot === index ? "600" : "400"}
                          style={styles.slotTimeText}
                        >
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Continue Button */}
              <TouchableOpacity activeOpacity={0.8} style={styles.slotContinueBtnWrap}
                onPress={() => {
                  setShowSlotSheet(false);
                  navigation.navigate("BookingDetails");
                }}
              >
                <LinearGradient
                  colors={["#B148FF", "#F6339B", "#9914F9"]}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.slotContinueBtn}
                >
                  <Text weight="700" style={styles.slotContinueBtnText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFF",
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: Platform.OS === "android" ? 44 : 54,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    padding: 4,
  },
  navTitle: {
    fontSize: 20,
    color: "#553FB5",
  },

  // Test Info Card
  testCard: {
    width: 323,
    height: 129,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#FBF1FE",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  testCardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  testImgWrap: {
    width: 74,
    height: 74,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  testImg: {
    width: 50,
    height: 50,
  },
  testInfoRight: {
    flex: 1,
  },
  testTitle: {
    fontSize: 14,
    color: "#1f2937",
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
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 2,
  },
  pillText: {
    fontSize: 10,
    color: "#374151",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  price: {
    fontSize: 18,
    color: "#1f2937",
  },
  originalPrice: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 12,
    color: "#22C55E",
  },

  // Know More Section
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    color: "#553FB5",
    marginBottom: 10,
  },
  knowMoreCard: {
    width: 323,
    height: 99,
    alignSelf: "center",
    backgroundColor: "#F2FCFF",
    borderRadius: 6,
    padding: 14,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  knowMoreText: {
    width: 299,
    fontSize: 9,
    color: "#374151",
    lineHeight: 12.6,
    marginBottom: 6,
  },
  seeMore: {
    fontSize: 9,
    color: "#1f2937",
  },

  // Info Grid
  infoGrid: {
    marginHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  infoCardRow: {
    flexDirection: "row",
    gap: 10,
  },
  infoCard: {
    width: 100,
    height: 90,
    backgroundColor: "#F2FCFF",
    borderRadius: 6,
    padding: 12,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  infoCardFull: {
    backgroundColor: "#F2FCFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  infoLabel: {
    fontSize: 8,
    color: "#6B7280",
    lineHeight: 11.2,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 10,
    color: "#1f2937",
    lineHeight: 14,
  },

  // Popular Packages
  popularSection: {
    marginTop: 24,
    paddingBottom: 20,
  },
  popularHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  popularTitle: {
    fontSize: 16,
    color: "#1f2937",
  },
  viewAll: {
    fontSize: 13,
    color: "#22C55E",
  },
  packageList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  packageCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.67,
    backgroundColor: "#FCF6FF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#3D136B",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
      },
      android: { elevation: 12, shadowColor: "#3D136B" },
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
      android: { elevation: 3 },
    }),
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    backgroundColor: "#7C3AED",
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: Platform.OS === "ios" ? 30 : 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  totalLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  totalPrice: {
    fontSize: 22,
    color: "#1f2937",
  },
  bookTestBtnWrap: {
    borderRadius: 10,
    overflow: "hidden",
  },
  bookTestBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bookTestBtnText: {
    color: "#fff",
    fontSize: 15,
  },

  // Patient Details Bottom Sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  sheetGradient: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 18,
    color: "#1F2937",
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 16,
  },
  sheetProfileCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    padding: 14,
    marginBottom: 20,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    overflow: "hidden",
  },
  sheetProfileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarOuterRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    padding: 2,
  },
  avatarWhiteRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  sheetProfileInfo: {
    flex: 1,
  },
  sheetProfileName: {
    fontSize: 17,
    color: "#1F2937",
    marginBottom: 5,
  },
  sheetTagsRow: {
    flexDirection: "row",
    gap: 6,
  },
  sheetTag: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  sheetTagText: {
    fontSize: 11,
    color: "#7C3AED",
  },
  sheetDropdownIcon: {
    padding: 8,
    backgroundColor: "#F1E7FE",
    borderRadius: 20,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bookSlotBtnWrap: {
    borderRadius: 14,
    overflow: "hidden",
  },
  bookSlotBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  bookSlotBtnText: {
    color: "#fff",
    fontSize: 16,
  },

  // Slot Selection Bottom Sheet
  slotSheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    maxHeight: "90%",
  },
  slotSheetGradient: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  slotAddressCard: {
    backgroundColor: "#FBF1FE",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 0.6,
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  slotDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
  slotAddressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotAddressTitle: {
    fontSize: 15,
    color: "#1F2937",
  },
  slotChangeText: {
    fontSize: 13,
    color: "#6D28D9",
  },
  slotAddressLine1: {
    fontSize: 13,
    color: "#1F2937",
    marginBottom: 2,
  },
  slotAddressLine2: {
    fontSize: 12,
    color: "#6B7280",
  },
  slotPickerCard: {
    backgroundColor: "#FBF1FE",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.6,
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  slotPickerTitle: {
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 2,
  },
  slotDayRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  slotDayPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0.6,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  slotDayPillActive: {
    backgroundColor: "#F8DFFF",
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  slotDayLabel: {
    fontSize: 12,
    color: "#374151",
  },
  slotDayLabelActive: {
    color: "#7C3AED",
  },
  slotDaySlots: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  slotDaySlotsActive: {
    color: "#7C3AED",
  },
  slotPeriodRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  slotPeriodPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.6,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  slotPeriodPillActive: {
    backgroundColor: "#F8DFFF",
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  slotPeriodText: {
    fontSize: 12,
    color: "#374151",
  },
  slotPeriodTextActive: {
    color: "#7C3AED",
  },
  slotTimesContainer: {
    gap: 16,
  },
  slotTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  slotRadioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  slotRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7C3AED",
  },
  slotTimeText: {
    fontSize: 14,
    color: "#1F2937",
  },
  slotContinueBtnWrap: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 10,
  },
  slotContinueBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  slotContinueBtnText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TestDetails;
