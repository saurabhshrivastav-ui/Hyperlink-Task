import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../../components/TextWrapper";
import QuestionnairesHero from "../../../assets/QuestionnairesHero.svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// 🔥 1. EMBEDDED JSON DATA
const HEALTH_DATA = {
  health_assessments: [
    {
      category: "Chronic Condition",
      conditions: [
        {
          id: "diabetes",
          name: "Diabetes",
          questions: [
            {
              id: 1,
              question_text:
                "Do you have a family history of Type 2 Diabetes? (Parent, sibling)",
              options: [
                {
                  text: "Yes, in immediate family (parent/sibling)",
                  score: 10,
                },
                {
                  text: "Yes, in extended family (grandparent/uncle/aunt)",
                  score: 5,
                },
                { text: "No known history", score: 0 },
                { text: "Not sure", score: 2 },
              ],
            },
            {
              id: 2,
              question_text:
                "Have you ever been diagnosed with high blood sugar or prediabetes?",
              options: [
                { text: "Yes, diagnosed by a doctor", score: 10 },
                { text: "No, never diagnosed", score: 0 },
                { text: "Not sure", score: 5 },
              ],
            },
            {
              id: 3,
              question_text:
                "How often do you exercise or engage in physical activity?",
              options: [
                { text: "Daily (30 minutes or more)", score: 0 },
                { text: "3–5 times a week", score: 3 },
                { text: "Rarely", score: 7 },
                { text: "Never", score: 10 },
              ],
            },
            {
              id: 4,
              question_text:
                "Have you or your family ever experienced obesity-related conditions?",
              options: [
                { text: "Yes, in immediate family", score: 10 },
                { text: "Yes, in extended family", score: 5 },
                { text: "No", score: 0 },
                { text: "Not sure", score: 2 },
              ],
            },
          ],
        },
        {
          id: "hypertension",
          name: "Hypertension (High BP)",
          questions: [
            {
              id: 1,
              question_text:
                "How often do you consume processed or high-salt foods?",
              options: [
                { text: "Daily / Very Often", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "Rarely", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Do you experience frequent headaches or dizziness?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text:
                "Is your resting blood pressure usually above 120/80?",
              options: [
                { text: "Yes, consistently higher", score: 10 },
                { text: "Sometimes / Borderline", score: 5 },
                { text: "No, it is normal", score: 0 },
                { text: "I don't check it", score: 3 },
              ],
            },
            {
              id: 4,
              question_text: "Do you smoke or consume alcohol regularly?",
              options: [
                { text: "Yes, both or heavily", score: 10 },
                { text: "Ideally moderate / Socially", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
      ],
    },
    {
      category: "Cancer Awareness",
      conditions: [
        {
          id: "lung_cancer",
          name: "Lung Cancer",
          questions: [
            {
              id: 1,
              question_text:
                "Do you currently smoke or have you smoked in the past?",
              options: [
                { text: "Yes, currently smoke", score: 10 },
                { text: "Yes, but I quit", score: 5 },
                { text: "No, never", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Are you frequently exposed to secondhand smoke or industrial pollutants?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text:
                "Do you have a persistent cough that hasn't gone away for weeks?",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
                { text: "Not sure", score: 3 },
              ],
            },
            {
              id: 4,
              question_text:
                "Is there a history of lung cancer in your family?",
              options: [
                { text: "Yes, immediate family", score: 10 },
                { text: "Yes, extended family", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
      ],
    },
    {
      category: "Wellbeing",
      conditions: [
        {
          id: "stress",
          name: "Stress",
          questions: [
            {
              id: 1,
              question_text:
                "How often do you feel overwhelmed by your daily responsibilities?",
              options: [
                { text: "Almost every day", score: 10 },
                { text: "A few times a week", score: 5 },
                { text: "Rarely", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Do you experience physical symptoms like tension headaches or chest tightness?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text:
                "Are you able to relax and disconnect from work/study?",
              options: [
                { text: "No, I find it very hard", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "Yes, easily", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "How is your sleep quality when you are stressed?",
              options: [
                { text: "Very poor / Insomnia", score: 10 },
                { text: "Disturbed", score: 5 },
                { text: "Normal", score: 0 },
              ],
            },
          ],
        },
      ],
    },
    {
      category: "Sensory Health",
      conditions: [
        {
          id: "vision",
          name: "Vision",
          questions: [
            {
              id: 1,
              question_text:
                "Do you experience blurred vision when reading or looking at screens?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "After long hours only", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "How many hours per day do you spend looking at digital screens?",
              options: [
                { text: "8+ hours", score: 10 },
                { text: "4-8 hours", score: 5 },
                { text: "Less than 4 hours", score: 0 },
              ],
            },
            {
              id: 3,
              question_text:
                "Do you get frequent headaches around your eyes or forehead?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "When was your last eye checkup?",
              options: [
                { text: "More than 2 years ago / Never", score: 10 },
                { text: "Within last 2 years", score: 5 },
                { text: "Within last year", score: 0 },
              ],
            },
          ],
        },
      ],
    },
  ],
  risk_logic: {
    total_possible_score: 40,
    thresholds: [
      {
        level: "Low Risk",
        range_min: 0,
        range_max: 10,
        color_code: "#28a745",
        message: "Your risk appears low. Keep maintaining a healthy lifestyle.",
      },
      {
        level: "Moderate Risk",
        range_min: 11,
        range_max: 25,
        color_code: "#ffc107",
        message:
          "You have some risk factors. Consider monitoring your health and consulting a doctor.",
      },
      {
        level: "High Risk",
        range_min: 26,
        range_max: 40,
        color_code: "#dc3545",
        message:
          "High risk detected. It is highly recommended to consult a specialist immediately.",
      },
    ],
  },
};

const QuestionnairesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 🔥 2. RETRIEVE PASSED PARAMS
  const { conditionId, conditionName } = route.params || {
    conditionId: "diabetes",
    conditionName: "Diabetes",
  }; // fallback

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0); // Using Index instead of ID for safety
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("right");
  const slideAnim = useRef(new Animated.Value(0)).current;

  // 🔥 3. LOAD QUESTIONS BASED ON ID
  useEffect(() => {
    let found = false;
    for (const cat of HEALTH_DATA.health_assessments) {
      const cond = cat.conditions.find((c) => c.id === conditionId);
      if (cond) {
        setQuestions(cond.questions);
        found = true;
        break;
      }
    }
    if (!found) {
      Alert.alert(
        "Error",
        "Questions for this condition are not yet available."
      );
      navigation.goBack();
    }
  }, [conditionId]);

  useEffect(() => {
    const completed = Object.keys(answers).length;
    // Check if questions are loaded before checking length
    if (questions.length > 0) {
      setAllQuestionsAnswered(completed === questions.length);
    }
  }, [answers, questions]);

  useEffect(() => {
    slideAnim.setValue(animationDirection === "right" ? 40 : -40);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [activeQuestionIndex, animationDirection]);

  // 🔥 4. UPDATED SELECTION LOGIC
  const handleSelect = (questionId, optionObj) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionObj }));

    // Auto advance if not last question
    if (activeQuestionIndex < questions.length - 1) {
      setAnimationDirection("right");
      // Small delay for better UX
      setTimeout(() => setActiveQuestionIndex((prev) => prev + 1), 250);
    }
  };

  const goToNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setAnimationDirection("right");
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setAnimationDirection("left");
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  const progressPct = useMemo(() => {
    if (questions.length === 0) return 0;
    return (Object.keys(answers).length / questions.length) * 100;
  }, [answers, questions]);

  // 🔥 5. NEW SCORING LOGIC BASED ON JSON
  const calculateRiskAssessment = () => {
    let totalScore = 0;
    let riskFactors = [];

    questions.forEach((q) => {
      const ansObj = answers[q.id];
      if (ansObj) {
        totalScore += ansObj.score;
        if (ansObj.score >= 5) {
          riskFactors.push({
            question: q.question_text,
            answer: ansObj.text,
            severity: ansObj.score >= 10 ? "high" : "moderate",
          });
        }
      }
    });

    const thresholds = HEALTH_DATA.risk_logic.thresholds;
    const result =
      thresholds.find(
        (t) => totalScore >= t.range_min && totalScore <= t.range_max
      ) || thresholds[0];

    return {
      conditionName,
      riskLevel: result.level,
      totalScore,
      message: result.message,
      colorCode: result.color_code,
      riskFactors,
      maxPossibleScore: HEALTH_DATA.risk_logic.total_possible_score,
    };
  };

  // 🔥 UPDATED: Handle Submit Logic for Routing
  const handleSubmit = () => {
    if (!allQuestionsAnswered) return;

    const assessment = calculateRiskAssessment();

    // Check the level string from JSON (matches "level" key in thresholds)
    if (assessment.riskLevel === "Low Risk") {
      navigation.navigate("LowRisk", { assessment });
    } else if (assessment.riskLevel === "Moderate Risk") {
      navigation.navigate("ModerateRisk", { assessment });
    } else {
      // Assuming anything else is High Risk (score > 25)
      navigation.navigate("HighRisk", { assessment });
    }
  };

  // 🔥 UPDATED RESET LOGIC: Navigates back to SelfSense
  const resetQuestionnaire = () => {
    // Clear answers
    setAnswers({});
    setActiveQuestionIndex(0);
    // Navigate back to the main Disease Selection screen
    navigation.navigate("SelfSense");
  };

  const activeQ = questions[activeQuestionIndex];

  if (!activeQ) return null; // Loading state

  return (
    <View style={styles.page}>
      {/* ===== HEADER ===== */}
      <LinearGradient
        colors={["#6ea6e7", "#daeffe", "#e0d3ff"]}
        style={styles.hero}
      >
        <View style={styles.heroTopBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={20} color="#553fb5" />
          </TouchableOpacity>

          <View style={styles.heroTexts}>
            <Text style={styles.heroTitle} weight="800">
              HEALTH ASSESSMENT
            </Text>
            <Text style={styles.heroSubtitleTop} weight="400">
              {conditionName} Check
            </Text>
          </View>
        </View>

        <View style={styles.heroContent}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroH1}>Hello!{"\n"}Let's check.</Text>
            <Text style={styles.heroSubtitle} weight="400">
              Answer 4 simple questions to evaluate your risk.
            </Text>
          </View>
          <QuestionnairesHero width={180} height={140} />
        </View>
      </LinearGradient>

      {/* ===== BODY ===== */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressIndicator}>
            <Animated.View
              style={[styles.progressBar, { width: `${progressPct}%` }]}
            />
          </View>
          <Text style={styles.progressText} weight="500">
            {activeQuestionIndex + 1} of {questions.length}
          </Text>

          {/* Navigation Buttons */}
          <View style={styles.questionNav}>
            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                styles.navPrev,
                pressed && styles.navPrevPressed,
                activeQuestionIndex === 0 && styles.navDisabled,
              ]}
              onPress={goToPrevQuestion}
              disabled={activeQuestionIndex === 0}
            >
              <Text style={styles.navPrevText} weight="600">
                Previous
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                styles.navNext,
                pressed && styles.navNextPressed,
                activeQuestionIndex === questions.length - 1 &&
                  styles.navDisabled,
              ]}
              onPress={goToNextQuestion}
              disabled={activeQuestionIndex === questions.length - 1}
            >
              <Text style={styles.navNextText} weight="700">
                Next
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Single Active Question Card */}
        <Animated.View
          style={[
            styles.activeCardWrapper,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <QuestionCard
            question={activeQ}
            selectedAnswerObj={answers[activeQ.id]}
            onSelect={(optObj) => handleSelect(activeQ.id, optObj)}
            isAnswered={!!answers[activeQ.id]}
          />
        </Animated.View>
      </ScrollView>

      {/* ===== BOTTOM TRAY ===== */}
      <View style={styles.bottomTray}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            !allQuestionsAnswered && styles.actionBtnDisabled,
          ]}
          disabled={!allQuestionsAnswered}
          onPress={handleSubmit}
        >
          <Text style={styles.actionBtnText} weight="700">
            Submit Assessment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.secondaryBtn]}
          onPress={resetQuestionnaire}
        >
          <Text
            style={[styles.actionBtnText, styles.secondaryBtnText]}
            weight="500"
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ===== Single Question Card ===== */
const QuestionCard = ({
  question,
  selectedAnswerObj,
  onSelect,
  isAnswered,
}) => {
  return (
    <View style={styles.accordionItem}>
      <View style={styles.accordionHeader}>
        <View style={styles.questionNumWrap}>
          <View style={styles.questionNum}>
            <Text style={{ color: "#553fb5", fontSize: 14 }} weight="600">
              Q{question.id}
            </Text>
            {isAnswered && (
              <View style={styles.answerIndicator}>
                <Feather name="check" size={10} color="#fff" />
              </View>
            )}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.questionText} weight="600">
            {question.question_text}
          </Text>
        </View>
      </View>

      {/* 🔥 REFACTORED OPTIONS UI to Vertical List for long text */}
      <View style={styles.optionsWrap}>
        {question.options.map((opt, i) => {
          const selected = selectedAnswerObj?.text === opt.text;
          return (
            <TouchableOpacity
              key={`${question.id}-${i}`}
              style={[styles.optionCard, selected && styles.optionCardSelected]}
              onPress={() => onSelect(opt)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected && { color: "#553fb5", fontWeight: "700" },
                ]}
                weight={selected ? "700" : "500"}
              >
                {opt.text}
              </Text>
              {selected && <Feather name="check" size={14} color="#553fb5" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default QuestionnairesScreen;

/* ===== Styles ===== */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f9fafc" },
  hero: {
    padding: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#676CFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  heroTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 25,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTexts: { flex: 1, marginLeft: 10 },
  heroTitle: { fontSize: 18, color: "#553fb5" },
  heroSubtitleTop: { fontSize: 12, color: "#000", opacity: 0.8 },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 12,
  },
  heroTextBlock: { flex: 1, justifyContent: "center" },
  heroH1: {
    fontSize: 30,
    color: "#553fb5",
    marginBottom: 8,
    fontWeight: "700",
    flexShrink: 1,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#553fb5",
    opacity: 0.9,
    fontWeight: "400",
    flexShrink: 1,
  },
  body: { flex: 1 },
  progressContainer: { paddingHorizontal: 20, paddingTop: 20 },
  progressIndicator: {
    height: 6,
    backgroundColor: "#edf2f7",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: { height: "100%", backgroundColor: "#553fb5" },
  progressText: { fontSize: 14, color: "#64748b", textAlign: "right" },
  questionNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 24,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  navPrev: { backgroundColor: "#f1f5f9" },
  navPrevPressed: { backgroundColor: "#d1d5db" },
  navNext: { backgroundColor: "#553fb5" },
  navNextPressed: { backgroundColor: "#3b2c85" },
  navDisabled: { opacity: 0.5 },
  navPrevText: { color: "#64748b" },
  navNextText: { color: "#fff" },
  activeCardWrapper: { alignSelf: "center", width: SCREEN_WIDTH * 0.9 },
  accordionItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#edf2f7",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
  },
  questionNumWrap: { marginRight: 16 },
  questionNum: {
    backgroundColor: "rgba(99,102,241,0.1)",
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  answerIndicator: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#10b981",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  questionText: { fontSize: 16, color: "#1e293b", lineHeight: 22 },
  optionsWrap: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "column",
    gap: 10,
  },
  optionCard: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionCardSelected: {
    backgroundColor: "rgba(99,102,241,0.05)",
    borderColor: "#553fb5",
  },
  optionText: { color: "#0f172a", fontSize: 15, maxWidth: "90%" },
  bottomTray: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    padding: 16,
    flexDirection: "row-reverse",
    gap: 16,
    justifyContent: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#553fb5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { color: "#fff", fontSize: 14 },
  secondaryBtn: { backgroundColor: "#f1f5f9" },
  secondaryBtnText: { color: "#64748b" },
});
